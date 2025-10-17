"""
Utilitários para validação
"""

import secrets
import requests
import logging
from django.contrib.auth import get_user_model
from eth_account.messages import encode_defunct
from eth_account import Account

User = get_user_model()
logger = logging.getLogger(__name__)


def generate_validation_word():
    """Gera uma palavra aleatória para validação do Habbo"""
    words = [
        "ELEFANTE",
        "GIRAFA",
        "LEAO",
        "TIGRE",
        "ZEBRA",
        "MACACO",
        "URSO",
        "LOBO",
        "AGUIA",
        "FALCAO",
        "GOLFINHO",
        "TUBARAO",
        "BALEIA",
        "POLVO",
        "ESTRELA",
        "DIAMANTE",
        "OURO",
        "PRATA",
        "BRONZE",
        "CRISTAL",
        "FOGO",
        "AGUA",
        "TERRA",
        "VENTO",
        "RAIO",
        "SOL",
        "LUA",
        "ESTRELA",
        "COMETA",
        "GALAXIA",
    ]
    return secrets.choice(words)


def verify_metamask_signature(wallet_address, message, signature):
    """
    Verifica se a assinatura é válida para o endereço da carteira
    """
    try:
        message_hash = encode_defunct(text=message)
        recovered_address = Account.recover_message(message_hash, signature=signature)
        return recovered_address.lower() == wallet_address.lower()
    except Exception as e:
        logger.error("Erro na verificação da assinatura: %s", str(e))
        return False


def get_habbo_user_data(nick_habbo):
    """
    Busca dados do usuário via API do Habbo
    """
    api_url = f"https://www.habbo.com.br/api/public/users?name={nick_habbo}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
        "Accept": "application/json",
    }

    response = requests.get(api_url, headers=headers, timeout=15)
    response.raise_for_status()

    return response.json()


def get_habbo_user_motto(nick_habbo):
    """
    Extrai apenas o motto do usuário
    """
    user_data = get_habbo_user_data(nick_habbo)
    return user_data.get("motto", "").strip() if user_data.get("motto") else ""
