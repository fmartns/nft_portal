from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework.permissions import AllowAny

from .models import NftCollection
from .serializers import NftCollectionSerializer
from .docs import (
    collection_list_schema,
    collection_create_schema,
    collection_detail_schema,
    collection_update_schema,
    collection_partial_update_schema,
    collection_delete_schema,
    collection_stats_schema,
    collection_trending_schema,
)


class CollectionListCreateAPIView(APIView):
    """
    API para listar e criar coleções NFT.

    GET: Lista todas as coleções com opção de busca
    POST: Cria uma nova coleção
    """

    permission_classes = [AllowAny]
    serializer_class = NftCollectionSerializer

    @collection_list_schema
    def get(self, request):
        """Lista todas as coleções NFT com suporte a busca."""
        q = request.query_params.get("q")
        qs = NftCollection.objects.all()

        if q:
            qs = qs.filter(
                Q(name__icontains=q)
                | Q(description__icontains=q)
                | Q(address__icontains=q)
                | Q(slug__icontains=q)
                | Q(creator_name__icontains=q)
            )

        qs = qs.order_by("-created_at")
        serializer = NftCollectionSerializer(qs, many=True)
        return Response(serializer.data)

class CollectionDetailAPIView(APIView):
    """
    API para operações com uma coleção NFT específica.
    """

    permission_classes = [AllowAny]
    serializer_class = NftCollectionSerializer

    def get_object(self, slug):
        """Retorna uma coleção pelo slug ou retorna 404."""
        return get_object_or_404(NftCollection, slug=slug)

    @collection_detail_schema
    def get(self, request, slug):
        """Retorna os detalhes completos de uma coleção NFT."""
        obj = self.get_object(slug)
        return Response(NftCollectionSerializer(obj).data)

class CollectionStatsAPIView(APIView):
    """
    API para obter estatísticas gerais das coleções.
    """

    @collection_stats_schema
    def get(self, request):
        """Retorna estatísticas agregadas de todas as coleções."""
        from django.db.models import Sum, Avg

        collections = NftCollection.objects.all()

        stats = {
            "total_collections": collections.count(),
            "total_items": collections.aggregate(Sum("items_count"))["items_count__sum"]
            or 0,
            "total_owners": collections.aggregate(Sum("owners_count"))[
                "owners_count__sum"
            ]
            or 0,
            "average_floor_price": float(
                collections.aggregate(Avg("floor_price"))["floor_price__avg"] or 0
            ),
            "total_volume": float(
                collections.aggregate(Sum("total_volume"))["total_volume__sum"] or 0
            ),
        }

        return Response(stats)


class CollectionTrendingAPIView(APIView):
    """
    API para obter coleções em alta (trending).
    Ordenadas por volume total em ordem decrescente.
    """

    @collection_trending_schema
    def get(self, request):
        """Retorna as coleções trending ordenadas por volume total."""
        limit = int(request.query_params.get("limit", 10))

        trending = NftCollection.objects.filter(total_volume__gt=0).order_by(
            "-total_volume"
        )[:limit]

        serializer = NftCollectionSerializer(trending, many=True)
        return Response(serializer.data)
