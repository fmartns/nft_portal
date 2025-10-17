from django.db import models
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from django.conf import settings


def validate_eth_address(value: str):
    if not isinstance(value, str) or not value.startswith("0x") or len(value) != 42:
        raise ValidationError("Endereço Ethereum inválido. Esperado: 0x + 40 hex.")


class NftCollection(models.Model):
    name = models.CharField(max_length=150, verbose_name="Nome da Coleção")
    slug = models.SlugField(max_length=180, unique=True, blank=True)
    description = models.TextField(blank=True, verbose_name="Descrição")
    address = models.CharField(
        max_length=42,
        unique=True,
        validators=[validate_eth_address],
        verbose_name="Endereço do Contrato",
    )

    profile_image = models.URLField(blank=True, verbose_name="Foto de Perfil")
    cover_image = models.URLField(blank=True, verbose_name="Foto de Capa")

    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_collections",
        verbose_name="Criador",
    )
    creator_name = models.CharField(
        max_length=150,
        blank=True,
        verbose_name="Nome do Criador",
        help_text="Nome do criador (caso não seja um usuário registrado)",
    )

    items_count = models.PositiveIntegerField(
        default=0,
        verbose_name="Número de Itens",
        help_text="Total de NFTs nesta coleção",
    )
    owners_count = models.PositiveIntegerField(
        default=0,
        verbose_name="Número de Proprietários",
        help_text="Total de proprietários únicos",
    )
    floor_price = models.DecimalField(
        max_digits=20,
        decimal_places=8,
        default=0,
        verbose_name="Floor Price (ETH)",
        help_text="Menor preço listado na coleção",
    )
    total_volume = models.DecimalField(
        max_digits=30,
        decimal_places=8,
        default=0,
        verbose_name="Volume Total (ETH)",
        help_text="Volume total negociado",
    )

    metadata_api_url = models.URLField(
        blank=True, verbose_name="URL da API de Metadados"
    )

    project_id = models.PositiveBigIntegerField(null=True, blank=True)
    project_owner_address = models.CharField(
        max_length=42, blank=True, validators=[validate_eth_address]
    )

    website_url = models.URLField(blank=True, verbose_name="Site Oficial")
    twitter_url = models.URLField(blank=True, verbose_name="X (Twitter)")
    instagram_url = models.URLField(blank=True, verbose_name="Instagram")
    discord_url = models.URLField(blank=True, verbose_name="Discord")
    telegram_url = models.URLField(blank=True, verbose_name="Telegram")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["address"]),
        ]

    def save(self, *args, **kwargs):
        # gera slug se vazio; garante unicidade alterando com sufixo numérico se necessário
        if not self.slug:
            base = slugify(self.name)[:170] or "colecao"
            slug = base
            i = 2
            while NftCollection.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{i}"
                i += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.address})"

    @property
    def author(self):
        """Retorna o nome do autor/criador da coleção"""
        if self.creator:
            return self.creator.username
        return self.creator_name or "Desconhecido"

    @property
    def floor_price_eth(self):
        """Retorna o floor price formatado"""
        return f"{self.floor_price:.4f} ETH" if self.floor_price > 0 else "N/A"

    @property
    def total_volume_eth(self):
        """Retorna o volume total formatado"""
        return f"{self.total_volume:.2f} ETH" if self.total_volume > 0 else "N/A"
