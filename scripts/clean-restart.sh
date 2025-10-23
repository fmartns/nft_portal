#!/bin/bash
# Script para limpar containers e reiniciar

echo "=== Limpando containers e reiniciando ==="

# Definir variáveis
export ECR_REGISTRY="652175364064.dkr.ecr.sa-east-1.amazonaws.com"
export ECR_REPOSITORY="nft-portal"
export TAG="latest"

# Parar e remover todos os containers
echo "Parando e removendo containers..."
sudo docker compose -f /opt/nft_portal/docker/docker-compose.prod.yml down --remove-orphans || true

# Remover containers com conflito de nomes
echo "Removendo containers com conflito..."
sudo docker rm -f docker-certbot-1 docker-redis-1 docker-db-1 docker-web-1 docker-frontend-1 docker-nginx-1 docker-celery_worker-1 docker-celery_beat-1 docker-flower-1 || true

# Limpar volumes órfãos
echo "Limpando volumes órfãos..."
sudo docker volume prune -f

# Aguardar um pouco
sleep 5

# Iniciar containers novamente
echo "Iniciando containers..."
cd /opt/nft_portal
sudo env ECR_REGISTRY="$ECR_REGISTRY" ECR_REPOSITORY="$ECR_REPOSITORY" TAG="$TAG" \
  docker compose -f docker/docker-compose.prod.yml up -d

# Aguardar inicialização
echo "Aguardando inicialização..."
sleep 30

# Verificar status
echo "Status dos containers:"
sudo docker ps

echo ""
echo "=== Limpeza e reinicialização concluída ==="
