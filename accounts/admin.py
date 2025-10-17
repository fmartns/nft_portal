from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from .models import HabboValidationTask

User = get_user_model()


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin customizado para o modelo User"""

    # Campos exibidos na lista
    list_display = (
        "username",
        "email",
        "wallet_address",
        "nick_habbo",
        "habbo_validado",
        "is_active",
        "date_joined",
    )
    list_filter = ("habbo_validado", "is_active", "is_staff", "date_joined")
    search_fields = ("username", "email", "wallet_address", "nick_habbo", "cpf")

    # Campos do formulário
    fieldsets = (BaseUserAdmin.fieldsets or ()) + (
        ("Dados Brasileiros", {"fields": ("cpf", "telefone", "data_nascimento")}),
        (
            "Dados do Habbo",
            {"fields": ("nick_habbo", "habbo_validado", "palavra_validacao_habbo")},
        ),
        ("Carteira MetaMask", {"fields": ("wallet_address",)}),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    readonly_fields = ("created_at", "updated_at")


@admin.register(HabboValidationTask)
class HabboValidationTaskAdmin(admin.ModelAdmin):
    """Admin para tasks de validação do Habbo"""

    list_display = ("user", "nick_habbo", "palavra_validacao", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("user__username", "nick_habbo", "palavra_validacao")
    readonly_fields = ("task_id", "created_at", "updated_at")

    fieldsets = (
        (None, {"fields": ("user", "nick_habbo", "palavra_validacao", "status")}),
        ("Task Info", {"fields": ("task_id", "resultado"), "classes": ("collapse",)}),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )
