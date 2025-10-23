#!/bin/bash
# Script para debug do container web travado

echo "=== Debug do container web travado ==="

# Verificar status dos containers
echo "Status dos containers:"
sudo docker ps -a

echo ""
echo "Logs do container web:"
sudo docker logs docker-web-1 --tail=30

echo ""
echo "Health check do container web:"
sudo docker inspect docker-web-1 | grep -A 10 -B 5 Health

echo ""
echo "Testando conectividade interna:"
sudo docker exec docker-web-1 curl -f http://localhost:8000/health/ || echo "Health check falhou"

echo ""
echo "Verificando se o Django está rodando:"
sudo docker exec docker-web-1 ps aux | grep python

echo ""
echo "Verificando se a porta 8000 está aberta:"
sudo docker exec docker-web-1 netstat -tlnp | grep 8000

echo ""
echo "Testando conexão com banco:"
sudo docker exec docker-web-1 python manage.py dbshell -c "SELECT 1;" || echo "Erro de conexão com banco"

echo ""
echo "Verificando arquivo .env:"
sudo cat /opt/nft_portal/.env | head -10

echo ""
echo "=== Debug concluído ==="
