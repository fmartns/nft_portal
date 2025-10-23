#!/bin/bash
# Script para configurar SSL automaticamente

echo "=== Configurando SSL para NFT Portal ==="

# Definir variáveis
export ECR_REGISTRY="652175364064.dkr.ecr.sa-east-1.amazonaws.com"
export ECR_REPOSITORY="nft-portal"
export TAG="latest"

# Aguardar containers iniciarem
echo "Aguardando containers iniciarem..."
sleep 30

# Verificar se nginx está rodando
echo "Verificando se nginx está rodando..."
sudo docker ps | grep nginx || {
  echo "Nginx não está rodando. Iniciando containers..."
  cd /opt/nft_portal
  sudo env ECR_REGISTRY="$ECR_REGISTRY" ECR_REPOSITORY="$ECR_REPOSITORY" TAG="$TAG" \
    docker compose -f docker/docker-compose.prod.yml up -d
  sleep 30
}

# Verificar se os domínios estão apontando corretamente
echo "Verificando DNS..."
nslookup nftmarketplace.com.br
nslookup api.nftmarketplace.com.br

# Aguardar DNS propagar
echo "Aguardando DNS propagar..."
sleep 60

# Configurar SSL para o domínio principal
echo "Configurando SSL para nftmarketplace.com.br..."
sudo docker exec docker-certbot-1 certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email $LE_EMAIL \
  --agree-tos \
  --no-eff-email \
  -d nftmarketplace.com.br \
  -d www.nftmarketplace.com.br || echo "Erro ao configurar SSL para domínio principal"

# Configurar SSL para API
echo "Configurando SSL para api.nftmarketplace.com.br..."
sudo docker exec docker-certbot-1 certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email $LE_EMAIL \
  --agree-tos \
  --no-eff-email \
  -d api.nftmarketplace.com.br || echo "Erro ao configurar SSL para API"

# Verificar certificados
echo "Verificando certificados..."
sudo docker exec docker-certbot-1 ls -la /etc/letsencrypt/live/

# Reiniciar nginx com SSL
echo "Reiniciando nginx com SSL..."
sudo docker exec docker-nginx-1 nginx -s reload

# Verificar status
echo "Status final:"
sudo docker ps

echo ""
echo "=== SSL configurado! ==="
echo "Teste os domínios:"
echo "- https://nftmarketplace.com.br"
echo "- https://api.nftmarketplace.com.br"
