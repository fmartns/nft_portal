#!/bin/bash
# Script de setup inicial para instância EC2 NFT Portal

set -e

echo "=== NFT Portal EC2 Setup ==="

# Atualizar sistema
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Instalar dependências básicas
echo "Installing basic dependencies..."
sudo apt-get install -y curl wget git unzip htop

# Instalar Docker
echo "Installing Docker..."
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Configurar Docker
echo "Configuring Docker..."
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER

# Configurar firewall
echo "Configuring firewall..."
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw --force enable

# Criar estrutura de diretórios
echo "Creating directory structure..."
sudo mkdir -p /opt/nft_portal/docker/nginx
sudo chown -R $USER:$USER /opt/nft_portal

# Verificar instalação
echo "Verifying installation..."
docker --version
docker compose version

echo ""
echo "=== Setup completed successfully! ==="
echo ""
echo "Next steps:"
echo "1. Make sure your GitHub secrets are configured"
echo "2. Push to main branch to trigger deploy"
echo "3. Check the deploy logs in GitHub Actions"
echo ""
echo "To test Docker manually:"
echo "  docker run hello-world"
echo ""
echo "To check if everything is working:"
echo "  sudo systemctl status docker"
echo "  sudo ufw status"
