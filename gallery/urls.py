from django.urls import path
from .views import (
    CollectionListCreateAPIView,
    CollectionDetailAPIView,
    CollectionStatsAPIView,
    CollectionTrendingAPIView,
)

urlpatterns = [
    path("", CollectionListCreateAPIView.as_view(), name="collections-list-create"),
    path("stats/", CollectionStatsAPIView.as_view(), name="collections-stats"),
    path("trending/", CollectionTrendingAPIView.as_view(), name="collections-trending"),
    path("<slug:slug>/", CollectionDetailAPIView.as_view(), name="collections-detail"),
]
