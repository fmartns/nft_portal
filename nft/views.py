from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .docs import nft_item_upsert_schema

from .models import NFTItem
from .serializers import NFTItemSerializer, FetchByProductCodeSerializer
from .services import fetch_item_from_immutable, ImmutableAPIError
from rest_framework.permissions import AllowAny


class IsAuthenticatedOrReadOnly(permissions.IsAuthenticatedOrReadOnly):
    pass


class NFTItemUpsertAPI(APIView):
    permission_classes = [AllowAny]

    @nft_item_upsert_schema
    def post(self, request):
        serializer = FetchByProductCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product_code = serializer.validated_data["product_code"]

        try:
            mapped = fetch_item_from_immutable(product_code)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except ImmutableAPIError:
            return Response(
                {"detail": "Falha ao consultar a Immutable"},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        except Exception:
            return Response(
                {"detail": "Falha ao consultar a Immutable"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        obj, created = NFTItem.objects.update_or_create(
            product_code=product_code,
            defaults=mapped,
        )
        out = NFTItemSerializer(obj)
        return Response(
            out.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )
