mongodump --host mongo -u root -p root123 --authenticationDatabase admin --db chat --out /opt/backups/backup-$(date +"%Y%m%d_%H%M%S")