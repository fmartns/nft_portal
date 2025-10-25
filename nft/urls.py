from django.urls import path

from .views import (
    NFTItemUpsertAPI,
    NFTItemListAPI,
    TrendingByAccessAPI,
    PricingConfigAPI,
)
from .record_access_view import RecordNFTAccessAPI


urlpatterns = [
    # POST upsert by product_code
    path("nft/", NFTItemUpsertAPI.as_view(), name="nft-items-upsert"),
    # GET list with filters/search/order/pagination
    path("nft/items/", NFTItemListAPI.as_view(), name="nft-items-list"),
    # POST record access to an item
    path("nft/items/view/", RecordNFTAccessAPI.as_view(), name="nft-items-record-view"),
    # GET top by access (last N days), default limit=4
    path(
        "nft/trending/", TrendingByAccessAPI.as_view(), name="nft-items-trending-access"
    ),
    # GET pricing configuration
    path("nft/pricing-config/", PricingConfigAPI.as_view(), name="nft-pricing-config"),
]
