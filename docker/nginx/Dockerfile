FROM nginx:1.27-alpine

RUN mkdir -p /var/www/certbot /.well-known/acme-challenge

COPY conf.d/*.conf /etc/nginx/conf.d/

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
