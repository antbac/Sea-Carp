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

# Copy the startup script and make it executable
COPY startup .
COPY chkpass /bin/chkpass
COPY rndpass /bin/rndpass
COPY pwn /bin/pwn

# Fix potential line ending issues and ensure scripts are executable
RUN sed -i 's/\r$//' startup && chmod 700 startup
RUN chmod 700 /bin/chkpass
RUN chmod 700 /bin/rndpass
RUN chmod 700 /bin/pwn

# Set the entry point to our startup script
ENTRYPOINT ["./startup"]