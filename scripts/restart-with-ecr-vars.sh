#!/bin/bash
# Script para definir variáveis ECR e reiniciar containers

echo "=== Configurando variáveis ECR e reiniciando containers ==="

# Definir as variáveis ECR (substitua pelos seus valores reais)
export ECR_REGISTRY="652175364064.dkr.ecr.sa-east-1.amazonaws.com"
export ECR_REPOSITORY="nft-portal"
export TAG="69bd254d7f6e7af12d46d7ef91c3b325a47d3b6d"

echo "Variáveis definidas:"
echo "ECR_REGISTRY: $ECR_REGISTRY"
echo "ECR_REPOSITORY: $ECR_REPOSITORY"
echo "TAG: $TAG"

# Parar containers existentes
echo "Parando containers..."
sudo docker compose -f docker/docker-compose.prod.yml down

# Iniciar containers com as variáveis corretas
echo "Iniciando containers..."
sudo env ECR_REGISTRY="$ECR_REGISTRY" ECR_REPOSITORY="$ECR_REPOSITORY" TAG="$TAG" \
  docker compose -f docker/docker-compose.prod.yml up -d

# Aguardar inicialização
echo "Aguardando inicialização..."
sleep 30

# Verificar status
echo "Status dos containers:"
sudo docker ps

echo ""
echo "Verificando health do container web..."
sudo docker inspect docker-web-1 | grep -A 5 -B 5 Health || echo "Container web não encontrado"

echo ""
echo "=== Script concluído ==="
