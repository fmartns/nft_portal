#!/bin/bash
# Script de diagnóstico completo para SSL

echo "=== DIAGNÓSTICO COMPLETO SSL NFT PORTAL ==="

# 1. Verificar status dos containers
echo "1. STATUS DOS CONTAINERS:"
sudo docker ps -a

echo ""
echo "2. LOGS DO NGINX:"
sudo docker logs docker-nginx-1 --tail=20

echo ""
echo "3. LOGS DO CERTBOT:"
sudo docker logs docker-certbot-1 --tail=20

echo ""
echo "4. VERIFICAR CERTIFICADOS SSL:"
sudo docker exec docker-certbot-1 ls -la /etc/letsencrypt/live/ || echo "Diretório de certificados não encontrado"

echo ""
echo "5. VERIFICAR CONFIGURAÇÃO NGINX:"
sudo docker exec docker-nginx-1 nginx -t || echo "Erro na configuração nginx"

echo ""
echo "6. VERIFICAR PORTAS ABERTAS:"
sudo netstat -tlnp | grep -E ":(80|443)"

echo ""
echo "7. TESTAR CONECTIVIDADE HTTP:"
curl -I http://nftmarketplace.com.br || echo "HTTP não responde"
curl -I http://api.nftmarketplace.com.br || echo "API HTTP não responde"

echo ""
echo "8. TESTAR CONECTIVIDADE HTTPS:"
curl -I https://nftmarketplace.com.br || echo "HTTPS não responde"
curl -I https://api.nftmarketplace.com.br || echo "API HTTPS não responde"

echo ""
echo "9. VERIFICAR DNS:"
nslookup nftmarketplace.com.br
nslookup api.nftmarketplace.com.br

echo ""
echo "10. VERIFICAR FIREWALL:"
sudo ufw status

echo ""
echo "11. VERIFICAR SE NGINX ESTÁ ESCUTANDO:"
sudo docker exec docker-nginx-1 netstat -tlnp

echo ""
echo "12. VERIFICAR VOLUMES:"
sudo docker volume ls

echo ""
echo "13. VERIFICAR ARQUIVO NGINX.CONF:"
sudo cat /opt/nft_portal/docker/nginx/nginx.conf | head -20

echo ""
echo "14. VERIFICAR SE CERTIFICADOS EXISTEM:"
sudo docker exec docker-certbot-1 find /etc/letsencrypt -name "*.pem" -type f

echo ""
echo "15. TESTAR NGINX INTERNAMENTE:"
sudo docker exec docker-nginx-1 curl -I http://localhost || echo "Nginx interno não responde"

echo ""
echo "=== DIAGNÓSTICO CONCLUÍDO ==="
