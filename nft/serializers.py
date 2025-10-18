from decimal import Decimal, InvalidOperation
from typing import Any

from rest_framework import serializers

from .models import NFTItem


class FetchByProductCodeSerializer(serializers.Serializer):
    product_code = serializers.CharField(max_length=120)

    def validate_product_code(self, value: str) -> str:
        if not value or not value.strip():
            raise serializers.ValidationError("product_code não pode ser vazio")
        return value.strip()


class NFTItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = NFTItem
        fields = "__all__"

    def _coerce_decimal(self, value: Any) -> Any:
        if value is None or isinstance(value, Decimal):
            return value
        if isinstance(value, (int, float, str)):
            try:
                return Decimal(str(value))
            except (InvalidOperation, ValueError):
                raise serializers.ValidationError("Invalid decimal value")
        return value

    def validate(self, attrs):
        for field in ("last_price_eth", "last_price_usd", "last_price_brl"):
            if field in attrs:
                attrs[field] = self._coerce_decimal(attrs.get(field))
        return attrs
