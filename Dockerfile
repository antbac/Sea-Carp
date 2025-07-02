FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy NuGet.config first
COPY ["NuGet.config", "."]

# Copy solution and csproj files first to take advantage of Docker layer caching
COPY ["SeaCarp.sln", "./"]
COPY ["SeaCarp.Application/*.csproj", "SeaCarp.Application/"]
COPY ["SeaCarp.CrossCutting/*.csproj", "SeaCarp.CrossCutting/"]
COPY ["SeaCarp.Domain/*.csproj", "SeaCarp.Domain/"]
COPY ["SeaCarp.Infrastructure/*.csproj", "SeaCarp.Infrastructure/"]
COPY ["SeaCarp.Presentation/*.csproj", "SeaCarp.Presentation/"]
COPY ["Tools/", "Tools/"]

# Install the CycloneDX tool and ensure it's in the PATH
RUN dotnet tool install --global CycloneDX --version 5.2.0
ENV PATH="${PATH}:/root/.dotnet/tools"

# Restore dependencies
RUN dotnet restore

# Copy the rest of the application
COPY . .

# Build and publish the application
RUN dotnet publish "SeaCarp.Presentation/SeaCarp.Presentation.csproj" -c Release -o /app/publish

# Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
EXPOSE 80
EXPOSE 443

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
COPY startup.sh .
# Fix potential line ending issues and ensure script is executable
RUN sed -i 's/\r$//' startup.sh && chmod +x startup.sh

# Set the entry point to our startup script
ENTRYPOINT ["./startup.sh"]