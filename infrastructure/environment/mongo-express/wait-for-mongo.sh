#!/bin/sh
# wait-for-mongo.sh

file_env() {
    local var="$1"
    local fileVar="${var}_FILE"
    local def="${2:-}"
    if [ "${!var:-}" ] && [ "${!fileVar:-}" ]; then
        echo >&2 "error: both $var and $fileVar are set (but are exclusive)"
        exit 1
    fi
    local val="$def"
    if [ "${!var:-}" ]; then
        val="${!var}"
    elif [ "${!fileVar:-}" ]; then
        val="$(< "${!fileVar}")"
    fi
    export "$var"="$val"
    unset "$fileVar"
}

file_env "MONGO_USERNAME"
file_env "MONGO_PASSWORD"

until 'db.runCommand("ping").ok' | mongosh $MONGO_DATABASE -u $MONGO_USERNAME -p $MONGO_PASSWORD --quiet | grep 1; do
  >&2 echo "MongoDB is unavailable - sleeping"
  sleep 1
done

>&2 echo "MongoDB is up - executing command"
exec "$@"