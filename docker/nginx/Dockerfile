FROM nginx:1.27-alpine

# ACME webroot and well-known path
RUN mkdir -p /var/www/certbot /.well-known/acme-challenge

# Base configs (kept for fallback); runtime generator will overwrite as needed
COPY conf.d/*.conf /etc/nginx/conf.d/

# Templates and entrypoint script to generate runtime configs based on env
COPY templates/ /etc/nginx/templates/
COPY --chmod=755 entrypoint.d/10-generate-configs.sh /docker-entrypoint.d/10-generate-configs.sh
COPY --chmod=755 entrypoint.d/25-clean-ssl-on-local.sh /docker-entrypoint.d/25-clean-ssl-on-local.sh

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
