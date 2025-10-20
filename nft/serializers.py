from decimal import Decimal, InvalidOperation
from typing import Any

from rest_framework import serializers

from .models import NFTItem, NFTItemAccess


class FetchByProductCodeSerializer(serializers.Serializer):
    product_code = serializers.CharField(max_length=120)

    def validate_product_code(self, value: str) -> str:
        if not value or not value.strip():
            raise serializers.ValidationError("product_code não pode ser vazio")
        return value.strip()


class NFTItemSerializer(serializers.ModelSerializer):
    # Enrich with collection metadata useful to the frontend routing/UI
    collection_slug = serializers.SerializerMethodField(read_only=True)
    collection_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = NFTItem
        fields = "__all__"
        # Expose extra computed fields as well
        extra_fields = ["collection_slug", "collection_name"]

    def get_collection_slug(self, obj):
        try:
            return obj.collection.slug if obj.collection else None
        except Exception:
            return None

    def get_collection_name(self, obj):
        try:
            return obj.collection.name if obj.collection else None
        except Exception:
            return None

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


class RecordAccessSerializer(serializers.Serializer):
    product_code = serializers.CharField(max_length=120, required=False, allow_blank=True)
    item_id = serializers.IntegerField(required=False)

    def validate(self, attrs: Any) -> Any:
        if not attrs.get("product_code") and not attrs.get("item_id"):
            raise serializers.ValidationError("Informe product_code ou item_id")
        return attrs
