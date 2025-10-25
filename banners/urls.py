from django.urls import path
from banners import views

app_name = "banners"

urlpatterns = [
    # API pública para banners
    path("api/banners/", views.BannerListAPIView.as_view(), name="banner-list"),
    path(
        "api/banners/<int:pk>/",
        views.BannerDetailAPIView.as_view(),
        name="banner-detail",
    ),
    path(
        "api/banners/collection/",
        views.CollectionBannerAPIView.as_view(),
        name="collection-banner",
    ),
]
