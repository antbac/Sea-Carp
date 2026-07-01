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

# Install Chrome via Google's apt repository (always gets current stable)
RUN mkdir -p /etc/apt/keyrings \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /etc/apt/keyrings/google-chrome.gpg \
    && echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/google-chrome.gpg] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Install matching Chrome for Testing build
RUN CHROME_VERSION=$(google-chrome --version | grep -oP '\d+\.\d+\.\d+\.\d+') \
    && wget -q -O /tmp/chrome-linux64.zip "https://storage.googleapis.com/chrome-for-testing-public/${CHROME_VERSION}/linux64/chrome-linux64.zip" \
    && unzip /tmp/chrome-linux64.zip -d /usr/bin \
    && chmod +x /usr/bin/chrome-linux64/chrome \
    && rm /tmp/chrome-linux64.zip

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
