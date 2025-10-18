from django.urls import path

from .views import NFTItemUpsertAPI


urlpatterns = [
    path("nft/", NFTItemUpsertAPI.as_view(), name="nft-items-upsert"),
]
