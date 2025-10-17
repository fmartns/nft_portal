from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiExample,
    OpenApiResponse,
)
from drf_spectacular.types import OpenApiTypes
from .serializers import NftCollectionSerializer


collection_list_schema = extend_schema(
    operation_id="collections_list",
    tags=["Collections"],
    summary="Listar todas as coleções NFT",
    description="""
    Retorna uma lista de todas as coleções NFT cadastradas no sistema.

    **Funcionalidades:**
    - Listagem completa de coleções
    - Busca por termo (query parameter `q`)
    - Busca em múltiplos campos: nome, descrição, endereço e slug

    **Exemplos de uso:**
    - `/collections/` - Lista todas as coleções
    - `/collections/?q=bored` - Busca coleções com "bored" no nome, descrição, endereço ou slug
    """,
    parameters=[
        OpenApiParameter(
            name="q",
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description="Termo de busca para filtrar coleções por nome, descrição, endereço ou slug",
            required=False,
            examples=[
                OpenApiExample(
                    name="Busca por nome",
                    value="Bored Ape",
                    description="Busca coleções que contenham 'Bored Ape' em qualquer campo",
                ),
                OpenApiExample(
                    name="Busca por endereço",
                    value="0x",
                    description="Busca coleções por endereço Ethereum",
                ),
            ],
        ),
    ],
    responses={
        200: OpenApiResponse(
            response=NftCollectionSerializer(many=True),
            description="Lista de coleções retornada com sucesso",
            examples=[
                OpenApiExample(
                    name="Resposta de Sucesso",
                    value=[
                        {
                            "id": 1,
                            "name": "Bored Ape Yacht Club",
                            "slug": "bored-ape-yacht-club",
                            "description": "Uma coleção de 10.000 NFTs únicos de macacos entediados",
                            "address": "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
                            "profile_image": "https://example.com/profile.jpg",
                            "cover_image": "https://example.com/cover.jpg",
                            "creator": 1,
                            "creator_name": "",
                            "author": "admin",
                            "items_count": 10000,
                            "owners_count": 5400,
                            "floor_price": "15.5000",
                            "floor_price_eth": "15.5000 ETH",
                            "total_volume": "620000.00",
                            "total_volume_eth": "620000.00 ETH",
                            "metadata_api_url": "https://api.example.com/metadata",
                            "project_id": 1,
                            "project_owner_address": "",
                            "website_url": "https://boredapeyachtclub.com",
                            "twitter_url": "https://twitter.com/BoredApeYC",
                            "instagram_url": "",
                            "discord_url": "https://discord.gg/bayc",
                            "telegram_url": "",
                            "created_at": "2025-01-15T10:30:00Z",
                            "updated_at": "2025-01-20T15:45:00Z",
                        }
                    ],
                    response_only=True,
                )
            ],
        ),
    },
)

collection_create_schema = extend_schema(
    operation_id="collections_create",
    tags=["Collections"],
    summary="Criar nova coleção NFT",
    description="""
    Cria uma nova coleção NFT no sistema.

    **Campos obrigatórios:**
    - `name` - Nome da coleção
    - `address` - Endereço do contrato Ethereum (formato: 0x + 40 caracteres hexadecimais)

    **Campos opcionais:**
    - Imagens: `profile_image`, `cover_image`
    - Criador: `creator` (FK), `creator_name` (alternativo)
    - Estatísticas: `items_count`, `owners_count`, `floor_price`, `total_volume`
    - Site Oficial: `website_url`
    - Redes Sociais: `twitter_url`, `instagram_url`, `discord_url`, `telegram_url`
    - Metadados: `metadata_api_url`, `project_id`, `project_owner_address`

    **Nota:** O campo `slug` é gerado automaticamente a partir do nome.
    """,
    request=NftCollectionSerializer,
    examples=[
        OpenApiExample(
            name="Criar Coleção Completa",
            value={
                "name": "CryptoPunks",
                "description": "10,000 unique collectible characters with proof of ownership stored on the Ethereum blockchain",
                "address": "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
                "profile_image": "https://example.com/cryptopunks-profile.jpg",
                "cover_image": "https://example.com/cryptopunks-cover.jpg",
                "creator_name": "Larva Labs",
                "items_count": 10000,
                "owners_count": 3700,
                "floor_price": "45.5",
                "total_volume": "1200000",
                "website_url": "https://cryptopunks.app",
                "twitter_url": "https://twitter.com/cryptopunksnfts",
                "discord_url": "https://discord.gg/cryptopunks",
            },
            request_only=True,
        ),
        OpenApiExample(
            name="Criar Coleção Básica",
            value={
                "name": "My NFT Collection",
                "address": "0x1234567890123456789012345678901234567890",
                "description": "Uma coleção incrível de NFTs",
            },
            request_only=True,
        ),
    ],
    responses={
        201: OpenApiResponse(
            response=NftCollectionSerializer,
            description="Coleção criada com sucesso",
        ),
        400: OpenApiResponse(
            description="Dados inválidos",
            examples=[
                OpenApiExample(
                    name="Erro de Validação - Endereço Inválido",
                    value={
                        "address": [
                            "Endereço Ethereum inválido. Esperado: 0x + 40 hex."
                        ]
                    },
                ),
                OpenApiExample(
                    name="Erro de Validação - Endereço Duplicado",
                    value={
                        "address": [
                            "nft collection com este endereço do contrato já existe."
                        ]
                    },
                ),
            ],
        ),
    },
)

collection_detail_schema = extend_schema(
    operation_id="collections_detail",
    tags=["Collections"],
    summary="Obter detalhes de uma coleção NFT",
    description="""
    Retorna os detalhes completos de uma coleção NFT específica.

    **Identificação:**
    - A coleção é identificada pelo `slug` (gerado automaticamente a partir do nome)

    **Retorna:**
    - Todas as informações da coleção
    - Dados do criador
    - Estatísticas (itens, proprietários, floor price, volume total)
    - Links sociais e metadados
    """,
    responses={
        200: OpenApiResponse(
            response=NftCollectionSerializer,
            description="Detalhes da coleção retornados com sucesso",
        ),
        404: OpenApiResponse(
            description="Coleção não encontrada",
            examples=[
                OpenApiExample(
                    name="Coleção não encontrada",
                    value={"detail": "Not found."},
                )
            ],
        ),
    },
)

collection_update_schema = extend_schema(
    operation_id="collections_update",
    tags=["Collections"],
    summary="Atualizar completamente uma coleção NFT",
    description="""
    Atualiza completamente uma coleção NFT existente (PUT).

    **Atenção:**
    - PUT requer todos os campos obrigatórios
    - Use PATCH para atualização parcial

    **Campos obrigatórios:**
    - `name` - Nome da coleção
    - `address` - Endereço do contrato
    """,
    request=NftCollectionSerializer,
    examples=[
        OpenApiExample(
            name="Atualizar Coleção",
            value={
                "name": "Bored Ape Yacht Club - Updated",
                "description": "Descrição atualizada da coleção",
                "address": "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
                "items_count": 10000,
                "owners_count": 5500,
                "floor_price": "16.2",
                "total_volume": "650000",
            },
            request_only=True,
        ),
    ],
    responses={
        200: OpenApiResponse(
            response=NftCollectionSerializer,
            description="Coleção atualizada com sucesso",
        ),
        400: OpenApiResponse(description="Dados inválidos"),
        404: OpenApiResponse(description="Coleção não encontrada"),
    },
)

collection_partial_update_schema = extend_schema(
    operation_id="collections_partial_update",
    tags=["Collections"],
    summary="Atualizar parcialmente uma coleção NFT",
    description="""
    Atualiza parcialmente uma coleção NFT existente (PATCH).

    **Vantagens:**
    - Atualiza apenas os campos enviados
    - Não requer campos obrigatórios
    - Ideal para atualizar estatísticas ou links

    **Casos de uso comuns:**
    - Atualizar estatísticas (floor price, volume, contagem)
    - Adicionar ou modificar links sociais
    - Atualizar imagens
    """,
    request=NftCollectionSerializer,
    examples=[
        OpenApiExample(
            name="Atualizar Estatísticas",
            value={
                "floor_price": "18.5",
                "total_volume": "700000",
                "owners_count": 5600,
            },
            request_only=True,
        ),
        OpenApiExample(
            name="Atualizar Links Sociais",
            value={
                "twitter_url": "https://twitter.com/new_handle",
                "discord_url": "https://discord.gg/newserver",
            },
            request_only=True,
        ),
        OpenApiExample(
            name="Atualizar Imagens",
            value={
                "profile_image": "https://example.com/new-profile.jpg",
                "cover_image": "https://example.com/new-cover.jpg",
            },
            request_only=True,
        ),
    ],
    responses={
        200: OpenApiResponse(
            response=NftCollectionSerializer,
            description="Coleção atualizada com sucesso",
        ),
        400: OpenApiResponse(description="Dados inválidos"),
        404: OpenApiResponse(description="Coleção não encontrada"),
    },
)

collection_delete_schema = extend_schema(
    operation_id="collections_delete",
    tags=["Collections"],
    summary="Deletar uma coleção NFT",
    description="""
    Remove permanentemente uma coleção NFT do sistema.

    **Atenção:**
    - Esta ação é irreversível
    - Todos os dados da coleção serão perdidos
    - Use com cautela
    """,
    responses={
        204: OpenApiResponse(description="Coleção deletada com sucesso (sem conteúdo)"),
        404: OpenApiResponse(
            description="Coleção não encontrada",
            examples=[
                OpenApiExample(
                    name="Coleção não encontrada",
                    value={"detail": "Not found."},
                )
            ],
        ),
    },
)

collection_stats_schema = extend_schema(
    operation_id="collections_stats",
    tags=["Collections - Analytics"],
    summary="Obter estatísticas gerais das coleções",
    description="""
    Retorna estatísticas agregadas de todas as coleções NFT no sistema.

    **Métricas incluídas:**
    - Total de coleções
    - Total de itens (NFTs) em todas as coleções
    - Total de proprietários únicos
    - Preço médio de floor price
    - Volume total negociado

    **Casos de uso:**
    - Dashboard administrativo
    - Página de estatísticas públicas
    - Análise de mercado
    """,
    responses={
        200: OpenApiResponse(
            description="Estatísticas retornadas com sucesso",
            examples=[
                OpenApiExample(
                    name="Estatísticas",
                    value={
                        "total_collections": 150,
                        "total_items": 2500000,
                        "total_owners": 450000,
                        "average_floor_price": 1.85,
                        "total_volume": 15000000.50,
                    },
                )
            ],
        ),
    },
)

collection_trending_schema = extend_schema(
    operation_id="collections_trending",
    tags=["Collections - Analytics"],
    summary="Obter coleções em alta (trending)",
    description="""
    Retorna as coleções NFT com maior volume de negociação.

    **Ordenação:**
    - Ordenadas por volume total em ordem decrescente
    - Apenas coleções com volume > 0

    **Parâmetros:**
    - `limit` - Número máximo de coleções a retornar (padrão: 10)

    **Casos de uso:**
    - Página inicial - seção de trending
    - Rankings de coleções
    - Análise de mercado
    """,
    parameters=[
        OpenApiParameter(
            name="limit",
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description="Número máximo de coleções trending a retornar",
            required=False,
            default=10,
            examples=[
                OpenApiExample(
                    name="Top 5",
                    value=5,
                ),
                OpenApiExample(
                    name="Top 20",
                    value=20,
                ),
            ],
        ),
    ],
    responses={
        200: OpenApiResponse(
            response=NftCollectionSerializer(many=True),
            description="Lista de coleções trending retornada com sucesso",
        ),
    },
)
