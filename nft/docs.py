from drf_spectacular.utils import (
    extend_schema,
    OpenApiResponse,
    OpenApiExample,
)

from .serializers import FetchByProductCodeSerializer, NFTItemSerializer


nft_item_upsert_schema = extend_schema(
    operation_id="nft_items_upsert",
    tags=["NFT"],
    summary="Cria ou atualiza item pelo menor preço",
    description=(
        "Envia um product_code; o servidor consulta a Immutable, encontra o menor preço, "
        "converte para ETH/USD/BRL e salva via update_or_create. Retorna o item atualizado."
    ),
    request=FetchByProductCodeSerializer,
    responses={
        200: OpenApiResponse(response=NFTItemSerializer, description="Item atualizado"),
        201: OpenApiResponse(response=NFTItemSerializer, description="Item criado"),
        400: OpenApiResponse(description="Erro de validação / rate limit"),
        502: OpenApiResponse(description="Falha ao consultar a Immutable"),
    },
    examples=[
        OpenApiExample(
            "Exemplo de requisição",
            value={"product_code": "nft_cf25_leather"},
            request_only=True,
        ),
        OpenApiExample(
            "Exemplo de resposta",
            value={
                "id": 1,
                "type": "unknown",
                "blueprint": "",
                "image_url": "https://nft-tokens.habbo.com/items/images/nft_cf25_leather.png",
                "name": "Leather",
                "source": "immutable_bids",
                "is_crafted_item": False,
                "is_craft_material": False,
                "rarity": "",
                "item_type": "",
                "item_sub_type": "",
                "number": None,
                "product_code": "nft_cf25_leather",
                "product_type": "",
                "material": "",
                "last_price_eth": "0.012345678900000000",
                "last_price_usd": "23.45",
                "last_price_brl": "123.45",
                "created_at": "2025-10-18T01:32:14.786137-03:00",
                "updated_at": "2025-10-18T01:35:01.000000-03:00",
            },
            response_only=True,
        ),
    ],
)
