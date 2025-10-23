#!/bin/bash
# Script para configurar SSL manualmente na EC2

echo "=== Configurando SSL manualmente ==="

# Aguardar containers
echo "Aguardando containers iniciarem..."
sleep 30

# Verificar se os domínios estão resolvendo
echo "Verificando DNS..."
nslookup nftmarketplace.com.br
nslookup api.nftmarketplace.com.br

# Aguardar DNS propagar
echo "Aguardando DNS propagar..."
sleep 60

# Configurar SSL para domínio principal
echo "Configurando SSL para nftmarketplace.com.br..."
sudo docker exec docker-certbot-1 certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email $LE_EMAIL \
  --agree-tos \
  --no-eff-email \
  --force-renewal \
  -d nftmarketplace.com.br \
  -d www.nftmarketplace.com.br

# Configurar SSL para API
echo "Configurando SSL para api.nftmarketplace.com.br..."
sudo docker exec docker-certbot-1 certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email $LE_EMAIL \
  --agree-tos \
  --no-eff-email \
  --force-renewal \
  -d api.nftmarketplace.com.br

# Verificar certificados
echo "Verificando certificados..."
sudo docker exec docker-certbot-1 ls -la /etc/letsencrypt/live/

# Criar nginx.conf com SSL
echo "Criando nginx.conf com SSL..."
sudo tee /opt/nft_portal/docker/nginx/nginx.conf >/dev/null << 'EOF'
# HTTP: Redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name nftmarketplace.com.br www.nftmarketplace.com.br;
    
    # ACME challenge for Let's Encrypt
    location ^~ /.well-known/acme-challenge/ {
        alias /var/www/certbot/.well-known/acme-challenge/;
        default_type "text/plain";
        try_files $uri =404;
    }
    
    # Redirect everything else to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 80;
    listen [::]:80;
    server_name api.nftmarketplace.com.br;
    
    # ACME challenge for Let's Encrypt
    location ^~ /.well-known/acme-challenge/ {
        alias /var/www/certbot/.well-known/acme-challenge/;
        default_type "text/plain";
        try_files $uri =404;
    }
    
    # Redirect everything else to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS: Frontend
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name nftmarketplace.com.br www.nftmarketplace.com.br;
    
    ssl_certificate /etc/letsencrypt/live/nftmarketplace.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nftmarketplace.com.br/privkey.pem;
    
    # Basic TLS settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    
    # Serve the built SPA
    root /usr/share/nginx/html;
    index index.html;
    
    # Cache static assets aggressively
    location ~* \.(?:js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$ {
        access_log off;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        try_files $uri =404;
    }
    
    # SPA fallback: route anything else to index.html
    location / {
        try_files $uri /index.html;
    }
}

# HTTPS: API
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.nftmarketplace.com.br;
    
    ssl_certificate /etc/letsencrypt/live/api.nftmarketplace.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.nftmarketplace.com.br/privkey.pem;
    
    # Basic TLS settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    
    # Static Django files
    location /static/ {
        alias /app/staticfiles/;
        access_log off;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        try_files $uri =404;
    }
    location /media/ {
        alias /app/media/;
        access_log off;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        try_files $uri =404;
    }
    
    location / {
        proxy_pass http://web:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        client_max_body_size 25m;
        proxy_read_timeout 60s;
    }
}
EOF

# Reiniciar nginx
echo "Reiniciando nginx..."
sudo docker restart docker-nginx-1

# Aguardar nginx reiniciar
sleep 10

# Verificar status
echo "Status final:"
sudo docker ps

echo ""
echo "=== SSL configurado! ==="
echo "Teste os domínios:"
echo "- https://nftmarketplace.com.br"
echo "- https://api.nftmarketplace.com.br"
