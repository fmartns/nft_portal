"""
Serializers para autenticação
"""

from rest_framework import serializers
from django.core.validators import RegexValidator
from .user import UserSerializer


class MetaMaskAuthSerializer(serializers.Serializer):
    """Serializer para autenticação via MetaMask"""

    wallet_address = serializers.CharField(
        max_length=42,
        validators=[
            RegexValidator(
                regex=r"^0x[a-fA-F0-9]{40}$",
                message="Endereço da carteira deve ser um endereço Ethereum válido",
            )
        ],
    )

    signature = serializers.CharField(
        max_length=132, help_text="Assinatura da mensagem com a carteira"
    )

    message = serializers.CharField(
        max_length=500, help_text="Mensagem que foi assinada"
    )


class AuthResponseSerializer(serializers.Serializer):
    """Serializer para resposta de autenticação"""

    access_token = serializers.CharField()
    refresh_token = serializers.CharField()
    user = UserSerializer()
    is_new_user = serializers.BooleanField(default=False)
