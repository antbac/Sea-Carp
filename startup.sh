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

# Generate a random password for the dev-certificate (32 characters)
CERT_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9!@#$%^&*()-_=+' | head -c 32)
CERT_PATH="/app/https.pfx"

# Create OpenSSL config with SANs
cat > /tmp/openssl-san.cnf <<EOL
[ req ]
default_bits       = 4096
prompt             = no
default_md         = sha256
distinguished_name = dn
x509_extensions    = v3_req

[ dn ]
CN = localhost

[ v3_req ]
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = localhost
IP.1  = 127.0.0.1
IP.2  = ::1
EOL

# Generate key + cert with SANs
openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
  -keyout /tmp/key.pem \
  -out /tmp/cert.pem \
  -config /tmp/openssl-san.cnf

# Combine into PFX
openssl pkcs12 -export \
  -out "$CERT_PATH" \
  -inkey /tmp/key.pem \
  -in /tmp/cert.pem \
  -password pass:$CERT_PASSWORD

# Set environment variables for Kestrel
export Kestrel__Certificates__Default__Path=$CERT_PATH
export Kestrel__Certificates__Default__Password=$CERT_PASSWORD

# Start the application
exec dotnet SeaCarp.Presentation.dll