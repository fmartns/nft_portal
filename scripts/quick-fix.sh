#!/bin/bash
# Script de correção rápida para problemas de deploy

echo "=== NFT Portal Quick Fix ==="

# Parar todos os containers
echo "Stopping all containers..."
cd /opt/nft_portal
sudo env ECR_REGISTRY="$ECR_REGISTRY" ECR_REPOSITORY="$ECR_REPOSITORY" TAG="$TAG" \
  docker compose -f docker/docker-compose.prod.yml down

# Limpar volumes antigos (cuidado!)
echo "Cleaning old volumes..."
sudo docker volume prune -f

# Verificar se o banco está funcionando
echo "Testing database connection..."
sudo docker run --rm --network docker_default \
  -e PGPASSWORD="$POSTGRES_PASSWORD" \
  postgres:16 \
  psql -h db -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT 1;" || {
  echo "Database connection failed. Creating user and database..."
  
  # Criar usuário e banco se não existirem
  sudo docker run --rm --network docker_default \
    -e PGPASSWORD="postgres" \
    postgres:16 \
    psql -h db -U postgres -c "
    DO \$\$ 
    BEGIN 
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='$POSTGRES_USER') THEN
        CREATE ROLE $POSTGRES_USER LOGIN PASSWORD '$POSTGRES_PASSWORD';
      END IF;
    END \$\$;
    "
  
  sudo docker run --rm --network docker_default \
    -e PGPASSWORD="postgres" \
    postgres:16 \
    psql -h db -U postgres -c "
    DO \$\$ 
    BEGIN 
      IF NOT EXISTS (SELECT FROM pg_database WHERE datname='$POSTGRES_DB') THEN
        CREATE DATABASE $POSTGRES_DB OWNER $POSTGRES_USER;
      END IF;
    END \$\$;
    "
}

# Recriar containers
echo "Starting containers with fresh setup..."
sudo env ECR_REGISTRY="$ECR_REGISTRY" ECR_REPOSITORY="$ECR_REPOSITORY" TAG="$TAG" \
  docker compose -f docker/docker-compose.prod.yml up -d

# Aguardar inicialização
echo "Waiting for services to start..."
sleep 60

# Verificar status
echo "Checking container status..."
sudo docker ps

echo ""
echo "Checking web container health..."
sudo docker inspect docker-web-1 | grep -A 5 -B 5 Health

echo ""
echo "Testing Django health endpoint..."
sudo docker exec docker-web-1 curl -f http://localhost:8000/health/ || echo "Health check still failing"

echo ""
echo "=== Quick fix completed ==="
echo "If issues persist, check logs with:"
echo "sudo docker logs docker-web-1"
