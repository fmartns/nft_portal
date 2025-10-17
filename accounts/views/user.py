"""
Views para operações de usuário
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

from ..serializers import UserSerializer


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: UserSerializer},
        description="Retorna dados do perfil do usuário",
    )
    def get(self, request):
        return Response(UserSerializer(request.user).data)

    @extend_schema(
        request=UserSerializer,
        responses={200: UserSerializer},
        description="Atualiza dados do perfil do usuário",
    )
    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
