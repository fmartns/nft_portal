import django_filters as filters
from decimal import Decimal

from .models import NFTItem
from .models import PricingConfig


class NFTItemFilter(filters.FilterSet):
    # Basic attribute filters (exact match)
    rarity = filters.CharFilter(field_name="rarity", lookup_expr="iexact")
    item_type = filters.CharFilter(field_name="item_type", lookup_expr="iexact")
    item_sub_type = filters.CharFilter(field_name="item_sub_type", lookup_expr="iexact")
    material = filters.CharFilter(field_name="material", lookup_expr="iexact")
    source = filters.CharFilter(field_name="source", lookup_expr="iexact")

    # Boolean toggles
    is_crafted_item = filters.BooleanFilter(field_name="is_crafted_item")
    is_craft_material = filters.BooleanFilter(field_name="is_craft_material")

    # Price range in BRL
    min_price_brl = filters.NumberFilter(field_name="last_price_brl", lookup_expr="gte")
    max_price_brl = filters.NumberFilter(field_name="last_price_brl", lookup_expr="lte")

    # Collection filtering: by id or slug
    collection_id = filters.NumberFilter(
        field_name="collection__id", lookup_expr="exact"
    )
    collection_slug = filters.CharFilter(
        field_name="collection__slug", lookup_expr="iexact"
    )
    # Use a custom method-based filter that robustly parses truthy values
    promo_only = filters.CharFilter(method="filter_promo_only")

    class Meta:
        model = NFTItem
        fields = [
            "rarity",
            "item_type",
            "item_sub_type",
            "material",
            "source",
            "is_crafted_item",
            "is_craft_material",
            "min_price_brl",
            "max_price_brl",
            "collection_id",
            "collection_slug",
            "promo_only",
        ]

    def filter_promo_only(self, queryset, name, value):
        # Apply only when explicitly requested with a truthy value
        truthy = {"1", "true", "t", "yes", "y", "on"}
        apply = False
        if isinstance(value, bool):
            apply = value
        elif value is not None:
            apply = str(value).strip().lower() in truthy
        if not apply:
            return queryset

        # Get latest global markup percent; default to 30.00 if not set
        cfg = (
            PricingConfig.objects.order_by("-updated_at")
            .only("global_markup_percent")
            .first()
        )
        global_markup = (
            cfg.global_markup_percent
            if cfg and cfg.global_markup_percent is not None
            else Decimal("30.00")
        )
        # Items with markup_percent explicitly set and less than global
        return queryset.filter(
            markup_percent__isnull=False, markup_percent__lt=global_markup
        )
