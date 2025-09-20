# Set the backup directory
$backupDir = "G:\My Drive\dev\talkAI\backup"

# Create backup directory if it doesn't exist
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

# Generate timestamp for the backup file
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$backupFile = Join-Path $backupDir "backup_$timestamp.sql"

# Set the database password
$env:PGPASSWORD = "7GDZw%wwub3i5#ik8T643T"

# Perform the backup
& "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe" "postgresql://postgres.gtxihsziwrypenfpqwat@aws-0-us-east-1.pooler.supabase.com:6543/postgres" > $backupFile

# Log the backup result
$logFile = Join-Path $backupDir "backup_log.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
if ($?) {
    $fileSize = (Get-Item $backupFile).Length / 1MB
    "$timestamp - Backup completed successfully. File size: $fileSize MB" | Out-File -Append $logFile
} else {
    "$timestamp - Backup failed" | Out-File -Append $logFile
}

# Clean up old backups (keep last 7 days)
Get-ChildItem $backupDir -Filter "backup_*.sql" | 
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | 
    Remove-Item -Force 