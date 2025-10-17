# Marketplace NFT

A plataforma é um marketplace inteligente voltado para o universo dos NFTs, conectando criadores, colecionadores e marcas em um só ecossistema.

A solução simplifica a compra, venda e exibição de ativos digitais, integrando diferentes blockchains e canais de distribuição, ampliando a visibilidade dos projetos e otimizando a gestão de coleções em tempo real.

[![Django CI](https://img.shields.io/badge/Django%20CI-passing-brightgreen)](https://github.com/fmartns/nft_portal/actions)
[![Code Quality](https://img.shields.io/badge/Code%20Quality-A%2B-blue)](https://github.com/fmartns/nft_portal/actions)
[![Docker Build](https://img.shields.io/badge/Docker%20Build%20%26%20Push-passing-blue)](https://github.com/fmartns/nft_portal/actions)
[![Python 3.13](https://img.shields.io/badge/python-3.13-blue.svg)](https://www.python.org/downloads/)
[![Django 5.2](https://img.shields.io/badge/django-5.2-green.svg)](https://www.djangoproject.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Tecnologias

- **Backend**: Django 5.2, Django REST Framework  
- **Banco de Dados**: PostgreSQL (produção), SQLite (desenvolvimento)  
- **Mensageria / Cache**: Redis (cache/logs e filas do Celery)  
- **Infra**: Docker, Docker Compose  
- **Qualidade**: Black, Ruff, Flake8, Pyright  
- **CI/CD**: GitHub Actions (Testes, Lint, Docker Build)

## Como rodar

### 1. Clonar o repositório
```bash
git clone https://github.com/fmartns/nft_portal.git
cd nft_portal
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

### 3. Rodar com Docker (recomendado)
```bash
docker compose up --build
```

A aplicação estará disponível em:
- API: http://127.0.0.1:8001 
- Admin: http://127.0.0.1:8001/admin/  
- Swagger: http://127.0.0.1:8001/docs/  

### 4. Rodar localmente (sem Docker)
```bash
poetry install
poetry run python manage.py migrate
poetry run python manage.py runserver
```

## Testes e Qualidade

Rodar os checadores de código e testes:
```bash
poetry run black .
poetry run ruff check . --fix
poetry run flake8 .
poetry run pyright
poetry run python manage.py test
```

## Docker

Build e execução manual:
```bash
docker compose up --build
docker compose up
```
