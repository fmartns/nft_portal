#!/bin/bash
# Script de limpeza completa para resolver conflitos

echo "=== Limpeza completa de containers ==="

# Parar tudo
echo "Parando todos os containers..."
sudo docker stop $(sudo docker ps -aq) 2>/dev/null || true

# Remover todos os containers
echo "Removendo todos os containers..."
sudo docker rm -f $(sudo docker ps -aq) 2>/dev/null || true

# Limpar redes órfãs
echo "Limpando redes órfãs..."
sudo docker network prune -f

# Limpar volumes órfãos (CUIDADO: isso remove dados não utilizados)
echo "Limpando volumes órfãos..."
sudo docker volume prune -f

# Verificar volumes importantes
echo "Verificando volumes importantes..."
sudo docker volume ls | grep -E "(pgdata|redisdata)" || echo "Volumes de dados não encontrados"

# Aguardar
sleep 5

# Definir variáveis
export ECR_REGISTRY="652175364064.dkr.ecr.sa-east-1.amazonaws.com"
export ECR_REPOSITORY="nft-portal"
export TAG="latest"

# Login ECR
echo "Fazendo login no ECR..."
aws ecr get-login-password --region sa-east-1 | sudo docker login --username AWS --password-stdin $ECR_REGISTRY

# Iniciar containers limpos
echo "Iniciando containers limpos..."
cd /opt/nft_portal
sudo env ECR_REGISTRY="$ECR_REGISTRY" ECR_REPOSITORY="$ECR_REPOSITORY" TAG="$TAG" \
  docker compose -f docker/docker-compose.prod.yml up -d

# Aguardar
sleep 30

# Verificar status
echo "Status dos containers:"
sudo docker ps

echo ""
echo "=== Limpeza concluída ==="
