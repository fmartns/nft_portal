#!/bin/bash
# Script de verificação do deploy NFT Portal

set -e

echo "🔍 VERIFICAÇÃO DO DEPLOY NFT PORTAL"
echo "=================================="

# Verificar se Docker está rodando
echo "📦 Verificando Docker..."
if ! docker --version >/dev/null 2>&1; then
    echo "❌ Docker não está instalado ou não está rodando"
    exit 1
fi
echo "✅ Docker OK"

# Verificar se docker-compose está disponível
if ! docker compose version >/dev/null 2>&1; then
    echo "❌ Docker Compose não está disponível"
    exit 1
fi
echo "✅ Docker Compose OK"

# Verificar estrutura de diretórios
echo "📁 Verificando estrutura de diretórios..."
if [ ! -d "/opt/nft_portal" ]; then
    echo "❌ Diretório /opt/nft_portal não existe"
    exit 1
fi
echo "✅ Diretório /opt/nft_portal OK"

if [ ! -f "/opt/nft_portal/.env" ]; then
    echo "❌ Arquivo .env não existe em /opt/nft_portal/"
    exit 1
fi
echo "✅ Arquivo .env OK"

# Verificar variáveis essenciais no .env
echo "🔐 Verificando variáveis essenciais..."
source /opt/nft_portal/.env

if [ -z "$SECRET_KEY" ]; then
    echo "❌ SECRET_KEY não está definido"
    exit 1
fi
echo "✅ SECRET_KEY OK"

if [ -z "$POSTGRES_DB" ] || [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_PASSWORD" ]; then
    echo "❌ Variáveis do PostgreSQL não estão definidas"
    exit 1
fi
echo "✅ Variáveis PostgreSQL OK"

# Verificar conectividade de rede
echo "🌐 Verificando conectividade..."
if ! curl -s --connect-timeout 5 https://nftmarketplace.com.br >/dev/null 2>&1; then
    echo "⚠️  Domínio nftmarketplace.com.br não está acessível"
fi

if ! curl -s --connect-timeout 5 https://api.nftmarketplace.com.br >/dev/null 2>&1; then
    echo "⚠️  Domínio api.nftmarketplace.com.br não está acessível"
fi

# Verificar containers em execução
echo "🐳 Verificando containers..."
cd /opt/nft_portal
if [ -f "docker/docker-compose.prod.yml" ]; then
    echo "📋 Status dos containers:"
    docker compose -f docker/docker-compose.prod.yml ps
else
    echo "❌ docker-compose.prod.yml não encontrado"
fi

echo ""
echo "✅ Verificação concluída!"
echo "💡 Para debug detalhado, execute:"
echo "   docker compose -f docker/docker-compose.prod.yml logs -f"
