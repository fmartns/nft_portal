from django.contrib import admin, messages
from django.db import transaction
from django.shortcuts import render, redirect
from django.urls import path
from django.utils.dateparse import parse_datetime
from decimal import Decimal
import json

from .models import NFTItem, PricingConfig, NFTItemAccess
from gallery.models import NftCollection


@admin.register(NFTItem)
class NFTItemAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "name_pt_br",
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
        "markup_percent",
    )
    # Enable inline editing of the per-item markup in the changelist
    list_editable = ("markup_percent",)
    search_fields = (
        "name",
        "name_pt_br",
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
    change_list_template = "admin/nft/nftitem/change_list.html"

    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path(
                "import-json/",
                self.admin_site.admin_view(self.import_json_view),
                name="nft_nftitem_import_json",
            )
        ]
        return custom + urls

    def import_json_view(self, request):
        context = {**self.admin_site.each_context(request)}
        context.update({
            "opts": self.model._meta,
            "title": "Importar NFTs via JSON",
        })

        if request.method == "POST":
            raw = request.POST.get("payload", "").strip()
            update_existing = request.POST.get("update_existing") == "on"
            try:
                data = json.loads(raw)
            except json.JSONDecodeError as e:
                messages.error(request, f"JSON inválido: {e}")
                return render(request, "admin/nft/nftitem/import_json.html", context)

            # Aceita {"nfts": [...]} ou lista de objetos, ou objeto único
            entries = []
            if isinstance(data, dict) and "nfts" in data and isinstance(data["nfts"], list):
                entries = data["nfts"]
            elif isinstance(data, list):
                entries = data
            elif isinstance(data, dict):
                entries = [data]
            else:
                messages.error(request, "Estrutura JSON não reconhecida. Informe um objeto, lista ou {\"nfts\": [...]}.")
                return render(request, "admin/nft/nftitem/import_json.html", context)

            created = 0
            updated = 0
            errors = 0

            @transaction.atomic
            def _import():
                nonlocal created, updated, errors
                for idx, entry in enumerate(entries, start=1):
                    try:
                        if not isinstance(entry, dict):
                            raise ValueError("Entrada inválida; esperado objeto")
                        fields = entry.get("fields") if isinstance(entry.get("fields"), dict) else entry
                        pk = entry.get("pk")
                        if not isinstance(fields, dict):
                            raise ValueError("Campo 'fields' ausente ou inválido")

                        defaults = {}

                        # Texto/booleanos
                        direct_keys = [
                            "type",
                            "blueprint",
                            "image_url",
                            "name",
                            "name_pt_br",
                            "source",
                            "is_crafted_item",
                            "is_craft_material",
                            "rarity",
                            "item_type",
                            "item_sub_type",
                            "product_code",
                            "product_type",
                            "material",
                        ]
                        for key in direct_keys:
                            if key in fields and fields[key] is not None:
                                defaults[key] = fields[key]

                        # Inteiros
                        if fields.get("number") is not None:
                            try:
                                defaults["number"] = int(fields.get("number"))
                            except Exception:
                                pass
                        if fields.get("seven_day_sales_count") is not None:
                            try:
                                defaults["seven_day_sales_count"] = int(fields.get("seven_day_sales_count"))
                            except Exception:
                                pass

                        # Decimais
                        for src in [
                            "last_price_eth",
                            "last_price_usd",
                            "last_price_brl",
                            "markup_percent",
                            "seven_day_volume_brl",
                            "seven_day_avg_price_brl",
                            "seven_day_last_sale_brl",
                            "seven_day_price_change_pct",
                        ]:
                            if fields.get(src) not in (None, ""):
                                try:
                                    defaults[src] = Decimal(str(fields.get(src)))
                                except Exception:
                                    pass

                        # Datetime
                        if fields.get("seven_day_updated_at"):
                            try:
                                defaults["seven_day_updated_at"] = parse_datetime(fields.get("seven_day_updated_at"))
                            except Exception:
                                pass

                        # ForeignKey: collection por id
                        if fields.get("collection"):
                            try:
                                defaults["collection"] = NftCollection.objects.get(pk=fields.get("collection"))
                            except NftCollection.DoesNotExist:
                                raise ValueError(f"Coleção com id={fields.get('collection')} não existe")

                        product_code = fields.get("product_code")

                        if update_existing:
                            if product_code:
                                obj, created_flag = NFTItem.objects.update_or_create(
                                    product_code=product_code, defaults=defaults
                                )
                                if created_flag:
                                    created += 1
                                else:
                                    updated += 1
                            elif pk:
                                obj = NFTItem.objects.filter(pk=pk).first()
                                if obj:
                                    for k, v in defaults.items():
                                        setattr(obj, k, v)
                                    obj.save()
                                    updated += 1
                                else:
                                    NFTItem.objects.create(id=pk, **defaults)  # type: ignore[arg-type]
                                    created += 1
                            else:
                                NFTItem.objects.create(**defaults)
                                created += 1
                        else:
                            if product_code and NFTItem.objects.filter(product_code=product_code).exists():
                                updated += 1  # existente (pulado)
                            elif pk and NFTItem.objects.filter(pk=pk).exists():
                                updated += 1  # existente (pulado)
                            else:
                                if pk:
                                    NFTItem.objects.create(id=pk, **defaults)  # type: ignore[arg-type]
                                else:
                                    NFTItem.objects.create(**defaults)
                                created += 1
                    except Exception:
                        errors += 1

            _import()

            if created:
                messages.success(request, f"{created} NFT(s) criado(s)")
            if updated:
                messages.info(request, f"{updated} NFT(s) atualizado(s)/existentes")
            if errors:
                messages.warning(request, f"{errors} item(ns) com erro; verifique o JSON e coleções referenciadas")

            return redirect("admin:nft_nftitem_changelist")

        return render(request, "admin/nft/nftitem/import_json.html", context)


@admin.register(PricingConfig)
class PricingConfigAdmin(admin.ModelAdmin):
    list_display = ("global_markup_percent", "updated_at")
    readonly_fields = ("created_at", "updated_at")


@admin.register(NFTItemAccess)
class NFTItemAccessAdmin(admin.ModelAdmin):
    list_display = ("item", "accessed_at")
    list_filter = ("accessed_at",)
    search_fields = ("item__name", "item__product_code")
