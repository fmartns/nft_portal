from django.db import models


class NFTItem(models.Model):
    type = models.CharField(max_length=120)
    blueprint = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    name = models.CharField(max_length=200, db_index=True)
    name_pt_br = models.CharField("Nome (pt-BR)", max_length=200, blank=True, db_index=True)

    source = models.CharField(max_length=80, db_index=True, blank=True)
    is_crafted_item = models.BooleanField(default=False, db_index=True)
    is_craft_material = models.BooleanField(default=False, db_index=True)
    rarity = models.CharField(max_length=80, db_index=True, blank=True)
    item_type = models.CharField(max_length=80, db_index=True, blank=True)
    item_sub_type = models.CharField(max_length=80, db_index=True, blank=True)

    number = models.IntegerField(blank=True, null=True)
    product_code = models.CharField(max_length=120, unique=True, blank=True, null=True)
    product_type = models.CharField(max_length=120, blank=True)
    material = models.CharField(max_length=120, blank=True)

    collection = models.ForeignKey(
        "gallery.NftCollection",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="items",
        verbose_name="Coleção",
    )

    last_price_eth = models.DecimalField(
        max_digits=38, decimal_places=18, blank=True, null=True
    )
    last_price_usd = models.DecimalField(
        max_digits=18, decimal_places=2, blank=True, null=True
    )
    last_price_brl = models.DecimalField(
        max_digits=18, decimal_places=2, blank=True, null=True
    )

    # Optional per-item markup percentage (e.g., 30.00 means +30%)
    markup_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Percentual de markup específico para este item (ex.: 30.00 = +30%). Se vazio, usa o global.",
    )

    # 7-day sales metrics
    seven_day_volume_brl = models.DecimalField(
        max_digits=18, decimal_places=2, blank=True, null=True, default=0
    )
    seven_day_sales_count = models.IntegerField(default=0)
    seven_day_avg_price_brl = models.DecimalField(
        max_digits=18, decimal_places=2, blank=True, null=True, default=0
    )
    seven_day_last_sale_brl = models.DecimalField(
        max_digits=18, decimal_places=2, blank=True, null=True, default=0
    )
    seven_day_price_change_pct = models.DecimalField(
        max_digits=7, decimal_places=2, blank=True, null=True, default=0
    )
    seven_day_updated_at = models.DateTimeField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["source"]),
            models.Index(fields=["rarity"]),
            models.Index(fields=["item_type"]),
            models.Index(fields=["item_sub_type"]),
            models.Index(fields=["is_crafted_item"]),
            models.Index(fields=["is_craft_material"]),
            models.Index(fields=["name"]),
            models.Index(fields=["product_code"]),
        ]
        ordering = ["name", "rarity", "item_type", "item_sub_type"]

    def __str__(self) -> str:  # type: ignore[override]
        return self.name or (self.product_code or "NFT Item")


class NFTItemAccess(models.Model):
    """Tracks user access/pageviews for NFT items."""

    item = models.ForeignKey(NFTItem, on_delete=models.CASCADE, related_name="accesses")
    accessed_at = models.DateTimeField(auto_now_add=True, db_index=True)
    ip_hash = models.CharField(max_length=64, blank=True, default="")
    user_agent_hash = models.CharField(max_length=64, blank=True, default="")

    class Meta:
        indexes = [
            models.Index(fields=["accessed_at"]),
            models.Index(fields=["item", "accessed_at"]),
        ]


class PricingConfig(models.Model):
    """Configuração global de preços (markup padrão)."""

    global_markup_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=30.00,
        help_text="Markup padrão aplicado em todos os preços quando o item não tem override (ex.: 30.00 = +30%).",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Configuração de Preço"
        verbose_name_plural = "Configurações de Preço"

    def __str__(self) -> str:  # type: ignore[override]
        return f"Markup Global: {self.global_markup_percent}%"
