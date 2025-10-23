#!/bin/bash
# Script de debug para identificar problemas no deploy

echo "=== NFT Portal Debug Script ==="

# Verificar logs do container web
echo "=== Logs do container web ==="
sudo docker logs docker-web-1 --tail=50

echo ""
echo "=== Logs do container db ==="
sudo docker logs docker-db-1 --tail=20

echo ""
echo "=== Logs do container redis ==="
sudo docker logs docker-redis-1 --tail=20

echo ""
echo "=== Status dos containers ==="
sudo docker ps -a

echo ""
echo "=== Verificar health check do web ==="
sudo docker inspect docker-web-1 | grep -A 10 -B 5 Health

echo ""
echo "=== Verificar se o Django está respondendo ==="
sudo docker exec docker-web-1 curl -f http://localhost:8000/health/ || echo "Health check falhou"

echo ""
echo "=== Verificar arquivo .env ==="
sudo cat /opt/nft_portal/.env

echo ""
echo "=== Verificar se as migrações foram executadas ==="
sudo docker exec docker-web-1 python manage.py showmigrations

echo ""
echo "=== Verificar conectividade com o banco ==="
sudo docker exec docker-web-1 python manage.py dbshell -c "SELECT 1;" || echo "Erro de conexão com banco"

echo ""
echo "=== Verificar se o usuário tem permissões no banco ==="
sudo docker exec docker-db-1 psql -U postgres -c "SELECT rolname FROM pg_roles WHERE rolname='$POSTGRES_USER';"

echo ""
echo "=== Debug concluído ==="
