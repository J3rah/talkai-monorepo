#!/bin/zsh

# Exit immediately if a command exits with a non-zero status.
set -e

# This script performs a daily backup of the Supabase PostgreSQL database.

# Path to the pg_dump executable
PG_DUMP="/usr/local/Cellar/libpq/17.5/bin/pg_dump"

# The host of the database to backup
DB_HOST="aws-0-us-east-1.pooler.supabase.com"

# The port of the database to backup
DB_PORT="6543"

# The username for the database
DB_USER="postgres.gtxihsziwrypenfpqwat"

# The name of the database to backup
DB_NAME="postgres"

# The directory where the backup file will be saved
BACKUP_DIR="/Users/dev/Documents/GitHub/talkAI/backups"

# The filename for the backup, with a timestamp
BACKUP_FILENAME="backup_$(date +'%Y-%m-%d_%H-%M-%S').sql"

# The full path for the backup file
BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILENAME"

# Ensure the backup directory exists
mkdir -p "$BACKUP_DIR"

# Run the backup command
# The password should be stored in the ~/.pgpass file
"$PG_DUMP" --host="$DB_HOST" --port="$DB_PORT" --username="$DB_USER" --dbname="$DB_NAME" --file="$BACKUP_PATH" --format=c --blobs

echo "Backup completed successfully and saved to $BACKUP_PATH" 