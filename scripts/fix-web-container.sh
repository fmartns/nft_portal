#!/bin/bash
# Script de correção rápida para container web travado

echo "=== Correção rápida para container web travado ==="

# Definir variáveis
export ECR_REGISTRY="652175364064.dkr.ecr.sa-east-1.amazonaws.com"
export ECR_REPOSITORY="nft-portal"
export TAG="69bd254d7f6e7af12d46d7ef91c3b325a47d3b6d"

# Parar tudo
echo "Parando todos os containers..."
sudo docker compose -f docker/docker-compose.prod.yml down

# Remover apenas o container web problemático
echo "Removendo container web problemático..."
sudo docker rm -f docker-web-1 || true

# Iniciar apenas os serviços básicos primeiro
echo "Iniciando serviços básicos..."
sudo env ECR_REGISTRY="$ECR_REGISTRY" ECR_REPOSITORY="$ECR_REPOSITORY" TAG="$TAG" \
  docker compose -f docker/docker-compose.prod.yml up -d db redis

# Aguardar serviços básicos ficarem prontos
echo "Aguardando serviços básicos..."
sleep 30

# Iniciar o web sem health check
echo "Iniciando container web..."
sudo env ECR_REGISTRY="$ECR_REGISTRY" ECR_REPOSITORY="$ECR_REPOSITORY" TAG="$TAG" \
  docker compose -f docker/docker-compose.prod.yml up -d web

# Aguardar web iniciar
echo "Aguardando web iniciar..."
sleep 30

# Verificar se web está funcionando
echo "Verificando se web está funcionando..."
sudo docker exec docker-web-1 curl -f http://localhost:8000/health/ && echo "Web OK!" || echo "Web ainda com problemas"

# Iniciar resto dos serviços
echo "Iniciando resto dos serviços..."
sudo env ECR_REGISTRY="$ECR_REGISTRY" ECR_REPOSITORY="$ECR_REPOSITORY" TAG="$TAG" \
  docker compose -f docker/docker-compose.prod.yml up -d

# Status final
echo "Status final:"
sudo docker ps

echo ""
echo "=== Correção concluída ==="
