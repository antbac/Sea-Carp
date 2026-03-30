FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy solution and csproj files first to take advantage of Docker layer caching
COPY ["SeaCarp.sln", "./"]
COPY ["SeaCarp.Application/*.csproj", "SeaCarp.Application/"]
COPY ["SeaCarp.CrossCutting/*.csproj", "SeaCarp.CrossCutting/"]
COPY ["SeaCarp.Domain/*.csproj", "SeaCarp.Domain/"]
COPY ["SeaCarp.Infrastructure/*.csproj", "SeaCarp.Infrastructure/"]
COPY ["SeaCarp.Presentation/*.csproj", "SeaCarp.Presentation/"]

# Restore dependencies
RUN dotnet restore

# Copy the rest of the application
COPY . .

# Build and publish the application
RUN dotnet publish "SeaCarp.Presentation/SeaCarp.Presentation.csproj" -c Release -o /app/publish

# Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
ENV IS_RUNNING_DOCKER=true
ENV ASPNETCORE_HTTP_PORTS=8080
ENV ASPNETCORE_ENVIRONMENT=Production
WORKDIR /app
EXPOSE 8080

# Install Chrome and ChromeDriver dependencies plus jq for JSON manipulation
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    unzip \
    curl \
    apt-transport-https \
    ca-certificates \
    jq

# Install Chrome version 138.0.7204.49 directly
RUN wget -q https://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_138.0.7204.49-1_amd64.deb -O /tmp/chrome.deb \
    && apt-get install -y /tmp/chrome.deb \
    && rm /tmp/chrome.deb

# Install ChromeDriver
RUN wget -q -O /tmp/chromedriver.zip https://storage.googleapis.com/chrome-for-testing-public/138.0.7204.49/linux64/chrome-linux64.zip \
    && unzip /tmp/chromedriver.zip -d /usr/bin \
    && chmod +x /usr/bin/chrome-linux64 \
    && rm /tmp/chromedriver.zip

# Copy the published app
COPY --from=build /app/publish .

# Copy seed data from repo root
COPY users.json .

# Copy the startup script and make it executable
COPY startup .
COPY chkpass /bin/chkpass
COPY usesecurepass /bin/usesecurepass
COPY pwn /bin/pwn
COPY updateappsettings /bin/updateappsettings

# Fix potential line ending issues and ensure scripts are executable
RUN sed -i 's/\r$//' startup /bin/chkpass /bin/usesecurepass /bin/pwn /bin/updateappsettings \
    && chmod +x /bin/pwn

# Creating a secure password for the root user
RUN /bin/usesecurepass

# Create a non-root user and switch to it for better security
RUN apt-get update && apt-get install -y sudo \
    && useradd -m -s /bin/bash -G shadow seacarp \
    && echo "seacarp ALL=(root) NOPASSWD: /bin/pwn, /bin/usesecurepass, /bin/updateappsettings" > /etc/sudoers.d/seacarp-ops \
    && chmod 440 /etc/sudoers.d/seacarp-ops \
    && su -s /bin/bash -c "sudo -n /bin/usesecurepass" seacarp \
    && chown root:root /app \
    && find /app -type d -exec chmod 755 {} \; \
    && find /app -type f -exec chmod 644 {} \; \
    && chown -R seacarp:seacarp /app/wwwroot \
    && chmod 755 /app/startup \
    && chmod +x /app/runtimes/linux/native/selenium-manager \
    && chown seacarp:seacarp /bin/usesecurepass /bin/chkpass \
    && chmod 700 /bin/usesecurepass /bin/chkpass \
    && chown root:root /bin/updateappsettings \
    && chmod 700 /bin/updateappsettings \
    && chmod a-w /home/seacarp/.bash_logout /home/seacarp/.bashrc /home/seacarp/.profile \
    && chgrp shadow /etc/shadow \
    && chmod 640 /etc/shadow \
    && rm -rf /var/lib/apt/lists/*
USER seacarp

# Set the entry point to our startup script
ENTRYPOINT ["./startup"]
