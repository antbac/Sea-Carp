#!/bin/bash

# Generate random keys (32 character hex strings)
ADMIN_KEY=$(openssl rand -hex 16 | tr '[:lower:]' '[:upper:]')
JWT_KEY=$(openssl rand -hex 16 | tr '[:lower:]' '[:upper:]')

echo "Generated new random keys"

# Use jq to update the appsettings.json file
jq ".Cryptography.AdminAuthenticationKey = \"$ADMIN_KEY\" | .Cryptography.JwtEncryptionKey = \"$JWT_KEY\"" /app/appsettings.json > /app/appsettings.json.new
mv /app/appsettings.json.new /app/appsettings.json

echo "Updated appsettings.json with new keys"

# Start the application
exec dotnet SeaCarp.Presentation.dll