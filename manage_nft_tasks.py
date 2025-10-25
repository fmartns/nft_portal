#!/usr/bin/env python
"""
Script para gerenciar as tasks do Celery relacionadas à atualização de preços dos NFTs.
Este script permite executar manualmente as tasks e verificar o status.
"""

import os
import sys
import django
from django.conf import settings

# Configura o Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from nft.tasks import (  # noqa: E402
    update_all_nft_prices_nightly,
    update_nft_price,
    cleanup_old_price_updates,
)
from nft.models import NFTItem  # noqa: E402


def show_help():
    """Mostra a ajuda do script."""
    print(
        """
Script de Gerenciamento de Tasks do Celery - NFT Portal

Comandos disponíveis:
  python manage_nft_tasks.py status          - Mostra status das tasks
  python manage_nft_tasks.py run-now         - Executa a rotina de atualização agora
  python manage_nft_tasks.py run-single <product_code> - Atualiza um produto específico
  python manage_nft_tasks.py cleanup         - Executa limpeza de dados antigos
  python manage_nft_tasks.py schedule       - Mostra o agendamento configurado
  python manage_nft_tasks.py help            - Mostra esta ajuda

Exemplos:
  python manage_nft_tasks.py run-now
  python manage_nft_tasks.py run-single "HABBO_FURNITURE_001"
  python manage_nft_tasks.py status
"""
    )


def show_status():
    """Mostra o status das tasks e informações do sistema."""
    print("Status do Sistema de Atualização de Preços NFT")
    print("=" * 50)

    # Conta produtos no banco
    total_products = NFTItem.objects.count()
    products_with_code = (
        NFTItem.objects.filter(product_code__isnull=False)
        .exclude(product_code__exact="")
        .count()
    )

    print(f"Total de produtos no banco: {total_products}")
    print(f"Produtos com product_code válido: {products_with_code}")

    # Mostra alguns produtos de exemplo
    print("\nExemplos de produtos:")
    sample_products = (
        NFTItem.objects.filter(product_code__isnull=False)
        .exclude(product_code__exact="")
        .values_list("product_code", "name", "last_price_brl")[:5]
    )

    for product_code, name, price in sample_products:
        price_str = f"R$ {price}" if price else "N/A"
        print(f"  • {product_code}: {name} - {price_str}")

    print("\nPróxima execução agendada: Todo dia às 1h00")
    print("Intervalo entre atualizações: 6 segundos por produto")

    if products_with_code > 0:
        estimated_duration = products_with_code * 6 / 60
        print(f"Duração estimada da rotina: {estimated_duration:.1f} minutos")


def run_now():
    """Executa a rotina de atualização imediatamente."""
    print("Executando rotina de atualização de preços...")

    try:
        result = update_all_nft_prices_nightly.delay()
        print(f"Task agendada com sucesso! ID: {result.id}")
        print("A rotina está sendo executada em background.")
        print("Use 'celery -A core worker --loglevel=info' para ver os logs.")

    except Exception as e:
        print(f"Erro ao executar a rotina: {e}")


def run_single(product_code):
    """Atualiza um produto específico."""
    print(f"Atualizando produto específico: {product_code}")

    try:
        result = update_nft_price.delay(product_code)
        print(f"Task agendada com sucesso! ID: {result.id}")
        print(f"O produto {product_code} está sendo atualizado em background.")

    except Exception as e:
        print(f"Erro ao atualizar o produto: {e}")


def run_cleanup():
    """Executa a limpeza de dados antigos."""
    print("Executando limpeza de dados antigos...")

    try:
        result = cleanup_old_price_updates.delay()
        print(f"Task de limpeza agendada com sucesso! ID: {result.id}")

    except Exception as e:
        print(f"Erro ao executar limpeza: {e}")


def show_schedule():
    """Mostra o agendamento configurado."""
    print("Agendamento de Tasks Configurado")
    print("=" * 40)

    beat_schedule = getattr(settings, "CELERY_BEAT_SCHEDULE", {})

    for task_name, config in beat_schedule.items():
        print(f"\n{task_name}:")
        print(f"   Task: {config['task']}")
        print(f"   Schedule: {config['schedule']}")
        if "options" in config:
            print(f"   Options: {config['options']}")


def main():
    """Função principal do script."""
    if len(sys.argv) < 2:
        show_help()
        return

    command = sys.argv[1].lower()

    if command == "help":
        show_help()
    elif command == "status":
        show_status()
    elif command == "run-now":
        run_now()
    elif command == "run-single":
        if len(sys.argv) < 3:
            print("Erro: Especifique o product_code")
            print("Exemplo: python manage_nft_tasks.py run-single HABBO_FURNITURE_001")
            return
        product_code = sys.argv[2]
        run_single(product_code)
    elif command == "cleanup":
        run_cleanup()
    elif command == "schedule":
        show_schedule()
    else:
        print(f"Comando desconhecido: {command}")
        show_help()


if __name__ == "__main__":
    main()
