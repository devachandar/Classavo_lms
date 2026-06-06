from rest_framework import generics

from .models import User
from .serializers import RegisterSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

class RegisterView(
    generics.CreateAPIView
):
    permission_classes = [AllowAny]

    queryset = User.objects.all()

    serializer_class = RegisterSerializer
    

class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        return Response(
            {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
                "role": request.user.role,
            }
        )