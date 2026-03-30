#!/bin/bash
if [ "$(id -u)" -ne 0 ]; then
  exec sudo -n /bin/pwn "$@"
fi

OWNER="$1"
OWNER_PATTERN='^[-a-zA-Z0-9_@. ]+$'
if [[ ! "$OWNER" =~ $OWNER_PATTERN ]]; then
    echo "Invalid owner value" >&2
    exit 1
fi

PROFILE=/home/seacarp/.profile
if grep -q "^export SYSTEM_PWNER=" "$PROFILE"; then
    sed -i "s|^export SYSTEM_PWNER=.*|export SYSTEM_PWNER=\"$OWNER\"|" "$PROFILE"
else
    echo "export SYSTEM_PWNER=\"$OWNER\"" >> "$PROFILE"
fi
