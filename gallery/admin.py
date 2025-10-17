from django.contrib import admin
from .models import NftCollection


@admin.register(NftCollection)
class NftCollectionAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "author",
        "items_count",
        "owners_count",
        "floor_price_eth",
        "total_volume_eth",
        "created_at",
    ]
    list_filter = ["created_at", "updated_at"]
    search_fields = ["name", "description", "address", "creator_name"]
    readonly_fields = ["slug", "created_at", "updated_at", "author"]

    fieldsets = (
        ("Informações Básicas", {"fields": ("name", "slug", "description", "address")}),
        ("Imagens", {"fields": ("profile_image", "cover_image")}),
        ("Criador", {"fields": ("creator", "creator_name", "author")}),
        (
            "Estatísticas",
            {
                "fields": (
                    "items_count",
                    "owners_count",
                    "floor_price",
                    "total_volume",
                )
            },
        ),
        (
            "Site Oficial",
            {
                "fields": ("website_url",),
            },
        ),
        (
            "Redes Sociais",
            {
                "fields": (
                    "twitter_url",
                    "instagram_url",
                    "discord_url",
                    "telegram_url",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Metadados",
            {
                "fields": (
                    "metadata_api_url",
                    "project_id",
                    "project_owner_address",
                ),
                "classes": ("collapse",),
            },
        ),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )
