#!/bin/bash

# Generate a random password for SSH root login (32 characters)
SSH_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9!@#$%^&*()-_=+' | head -c 32)

# Set the root password
echo "root:${SSH_PASSWORD}" | chpasswd

# Display the SSH password so it can be copied
echo "========================================================"
echo "SSH root password: ${SSH_PASSWORD}"
echo "Connect using: ssh root@<container-ip> -p <mapped-port>"
echo "========================================================"

# Start SSH server
/usr/sbin/sshd

# Generate random keys (32 character hex strings)
JWT_KEY=$(openssl rand -hex 16 | tr '[:lower:]' '[:upper:]')

echo "Generated new random keys"

# Use jq to update the appsettings.json file
jq ".Cryptography.JwtEncryptionKey = \"$JWT_KEY\"" /app/appsettings.json > /app/appsettings.json.new
mv /app/appsettings.json.new /app/appsettings.json

echo "Updated appsettings.json with new keys"

# Start the application
exec dotnet SeaCarp.Presentation.dll