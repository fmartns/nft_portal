"""
Views para validação do Habbo
"""

from datetime import datetime, timedelta
import pytz
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from ..serializers import HabboValidationSerializer, HabboValidationStatusSerializer
from ..models import HabboValidationTask
from ..utils import generate_validation_word

User = get_user_model()


class HabboValidationView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=HabboValidationSerializer,
        responses={200: dict},
        description="Inicia processo de validação do nick do Habbo",
    )
    def post(self, request):
        serializer = HabboValidationSerializer(
            data=request.data, context={"request": request}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        assert validated_data is not None
        nick_habbo = validated_data["nick_habbo"]
        user = request.user

        # Verifica se o nick já está validado por outro usuário
        if (
            User.objects.filter(nick_habbo=nick_habbo, habbo_validado=True)
            .exclude(id=user.id)
            .exists()
        ):
            return Response(
                {"error": "Este nick do Habbo já está validado por outro usuário"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        palavra_validacao = generate_validation_word()
        user.palavra_validacao_habbo = palavra_validacao
        user.save()

        validation_task = HabboValidationTask.objects.create(
            user=user,
            nick_habbo=nick_habbo,
            palavra_validacao=palavra_validacao,
            task_id=f"habbo_validation_{user.id}_{timezone.now().timestamp()}",
        )

        from ..tasks import validate_habbo_nick

        task_result = validate_habbo_nick.apply_async(
            args=[validation_task.id], countdown=300
        )

        validation_task.task_id = task_result.id
        validation_task.save()

        br_tz = pytz.timezone("America/Sao_Paulo")
        current_time = datetime.now(br_tz)
        eta_time = current_time + timedelta(minutes=5)

        return Response(
            {
                "message": f'Validação iniciada! Coloque a palavra "{palavra_validacao}" no seu motto do Habbo e aguarde 5 minutos.',
                "palavra_validacao": palavra_validacao,
                "nick_habbo": nick_habbo,
                "validation_id": validation_task.id,
                "eta_time": eta_time.strftime("%H:%M:%S"),
                "current_time": current_time.strftime("%H:%M:%S"),
            }
        )


class HabboUnlinkView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = None

    @extend_schema(
        request=None,
        responses={
            200: {
                "type": "object",
                "properties": {
                    "message": {"type": "string"},
                    "nick_anterior": {"type": "string"},
                    "debug": {"type": "object"},
                },
            }
        },
        description="Desvincula o nick do Habbo do usuário",
    )
    def post(self, request):
        user = request.user

        debug_info = {
            "user_id": user.id,
            "nick_habbo": user.nick_habbo,
            "habbo_validado": user.habbo_validado,
            "palavra_validacao_habbo": user.palavra_validacao_habbo,
        }

        if not user.nick_habbo:
            return Response(
                {
                    "error": "Usuário não possui nick do Habbo configurado",
                    "debug": debug_info,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        nick_anterior = user.nick_habbo
        user.nick_habbo = None
        user.habbo_validado = False
        user.palavra_validacao_habbo = None
        user.save()

        return Response(
            {
                "message": f'Nick "{nick_anterior}" desvinculado com sucesso',
                "nick_anterior": nick_anterior,
                "debug": debug_info,
            }
        )


class HabboValidationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="validation_id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description="ID da validação para verificar status",
            )
        ],
        responses={200: HabboValidationStatusSerializer},
        description="Verifica status de uma validação do Habbo",
    )
    def get(self, request):
        validation_id = request.query_params.get("validation_id")

        if validation_id:
            validation_task = HabboValidationTask.objects.filter(
                id=validation_id, user=request.user
            ).first()
        else:
            validation_task = (
                HabboValidationTask.objects.filter(user=request.user)
                .order_by("-created_at")
                .first()
            )

        if not validation_task:
            return Response(
                {"error": "Validação não encontrada"}, status=status.HTTP_404_NOT_FOUND
            )

        return Response(HabboValidationStatusSerializer(validation_task).data)


class HabboValidationHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: HabboValidationStatusSerializer(many=True)},
        description="Histórico de validações do Habbo do usuário",
    )
    def get(self, request):
        validations = HabboValidationTask.objects.filter(user=request.user).order_by(
            "-created_at"
        )

        return Response(HabboValidationStatusSerializer(validations, many=True).data)
