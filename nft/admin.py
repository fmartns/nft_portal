from django.contrib import admin

from .models import NFTItem


@admin.register(NFTItem)
class NFTItemAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "collection",
        "product_code",
        "source",
        "rarity",
        "item_type",
        "item_sub_type",
        "is_crafted_item",
        "is_craft_material",
        "last_price_eth",
        "last_price_usd",
        "last_price_brl",
    )
    search_fields = (
        "name",
        "product_code",
        "material",
        "blueprint",
        "type",
    )
    list_filter = (
        "source",
        "rarity",
        "item_type",
        "item_sub_type",
        "is_crafted_item",
        "is_craft_material",
        "collection",
    )
    readonly_fields = ("created_at", "updated_at")
