#!/bin/bash
# Script para resolver problema de HTTPS

echo "=== Resolvendo problema de HTTPS ==="

# Definir variáveis
export ECR_REGISTRY="652175364064.dkr.ecr.sa-east-1.amazonaws.com"
export ECR_REPOSITORY="nft-portal"
export TAG="latest"

# 1. Verificar status atual
echo "1. Status dos containers:"
sudo docker ps

# 2. Verificar se nginx está escutando na 443
echo ""
echo "2. Verificando portas do nginx:"
sudo docker exec docker-nginx-1 netstat -tlnp 2>/dev/null || echo "Nginx não está rodando"

# 3. Verificar certificados
echo ""
echo "3. Verificando certificados SSL:"
sudo docker exec docker-certbot-1 ls -la /etc/letsencrypt/live/ 2>/dev/null || echo "Certificados não encontrados"

# 4. Parar nginx e certbot
echo ""
echo "4. Parando nginx e certbot..."
sudo docker stop docker-nginx-1 docker-certbot-1 || true
sudo docker rm docker-nginx-1 docker-certbot-1 || true

# 5. Recriar certbot
echo ""
echo "5. Recriando certbot..."
cd /opt/nft_portal
sudo env ECR_REGISTRY="$ECR_REGISTRY" ECR_REPOSITORY="$ECR_REPOSITORY" TAG="$TAG" \
  docker compose -f docker/docker-compose.prod.yml up -d certbot

# 6. Aguardar
sleep 10

# 7. Gerar certificados SSL
echo ""
echo "6. Gerando certificados SSL..."
sudo docker exec docker-certbot-1 certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email contato@nftmarketplace.com.br \
  --agree-tos \
  --no-eff-email \
  --non-interactive \
  --force-renewal \
  -d nftmarketplace.com.br \
  -d www.nftmarketplace.com.br \
  -d api.nftmarketplace.com.br

# 8. Verificar se certificados foram criados
echo ""
echo "7. Verificando certificados criados:"
sudo docker exec docker-certbot-1 ls -la /etc/letsencrypt/live/

# 9. Recriar nginx
echo ""
echo "8. Recriando nginx..."
sudo env ECR_REGISTRY="$ECR_REGISTRY" ECR_REPOSITORY="$ECR_REPOSITORY" TAG="$TAG" \
  docker compose -f docker/docker-compose.prod.yml up -d nginx

# 10. Aguardar nginx iniciar
sleep 15

# 11. Verificar se nginx está escutando na 443
echo ""
echo "9. Verificando se nginx está escutando na 443:"
sudo docker exec docker-nginx-1 netstat -tlnp | grep 443 || echo "Nginx não está escutando na 443"

# 12. Testar HTTPS
echo ""
echo "10. Testando HTTPS:"
curl -I https://nftmarketplace.com.br 2>/dev/null || echo "HTTPS não funciona"
curl -I https://api.nftmarketplace.com.br 2>/dev/null || echo "API HTTPS não funciona"

# 13. Status final
echo ""
echo "11. Status final dos containers:"
sudo docker ps

echo ""
echo "=== Script concluído ==="
