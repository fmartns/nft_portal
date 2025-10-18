from django.db import models


class NFTItem(models.Model):
    type = models.CharField(max_length=120)
    blueprint = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    name = models.CharField(max_length=200, db_index=True)

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
