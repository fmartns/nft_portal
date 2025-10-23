# Production environment variables

Create `/opt/nft_portal/.env` on the EC2 host with the following variables. See `.env.example` for a template.

## Required

- SECRET_KEY: Use a strong random string. Generate on EC2:

  ```bash
  python3 - <<'PY'
  import secrets, string
  print('SECRET_KEY=' + ''.join(secrets.choice(string.ascii_letters+string.digits+string.punctuation) for _ in range(64)))
  PY
  ```

- DEBUG: False
- ALLOWED_HOSTS: nftmarketplace.com.br,www.nftmarketplace.com.br,api.nftmarketplace.com.br
- FRONTEND_ORIGINS: https://nftmarketplace.com.br,https://www.nftmarketplace.com.br
- API_ORIGIN: https://api.nftmarketplace.com.br
- USE_POSTGRES: True
- POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD: values matching your DB
- CELERY_BROKER_URL, CELERY_RESULT_BACKEND: redis://redis:6379/0

## HTTPS

- LE_EMAIL: Your email for Let’s Encrypt (required for automatic certificate issuance via webroot).

## Notes

- The docker compose file sets `POSTGRES_HOST=db` and `POSTGRES_PORT=5432` internally.
- After updating `/opt/nft_portal/.env`, rerun the GitHub Actions deploy workflow.
