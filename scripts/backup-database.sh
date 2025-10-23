#!/bin/bash
# Script de backup do banco de dados

echo "=== Backup do banco de dados NFT Portal ==="

# Criar diretório de backup
sudo mkdir -p /opt/nft_portal/backups

# Backup do PostgreSQL
echo "Fazendo backup do PostgreSQL..."
sudo docker exec docker-db-1 pg_dump -U $POSTGRES_USER -d $POSTGRES_DB > /opt/nft_portal/backups/backup_$(date +%Y%m%d_%H%M%S).sql

# Backup dos volumes Docker
echo "Fazendo backup dos volumes..."
sudo docker run --rm -v docker_pgdata:/data -v /opt/nft_portal/backups:/backup alpine tar czf /backup/pgdata_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .

# Limpar backups antigos (manter apenas os últimos 7 dias)
echo "Limpando backups antigos..."
find /opt/nft_portal/backups -name "backup_*.sql" -mtime +7 -delete
find /opt/nft_portal/backups -name "pgdata_*.tar.gz" -mtime +7 -delete

echo "Backup concluído!"
ls -la /opt/nft_portal/backups/
