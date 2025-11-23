from django.contrib.auth.hashers import check_password, make_password
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Member, ChatMessage
from .serializers import (
    MessageSerializer,
    AuthRegisterSerializer,
    AuthCredentialsSerializer,
    AuthTokenResponseSerializer,
    MemberSerializer,
    AuthProfileUpdateSerializer,
    ChatMessageSerializer,
    ChatMessageCreateSerializer,
)


class HelloView(APIView):
    """A simple API endpoint that returns a greeting message."""

    permission_classes = [AllowAny]

    @extend_schema(
        responses={200: MessageSerializer},
        description="Get a hello world message",
    )
    def get(self, request):
        data = {"message": "Hello!", "timestamp": timezone.now()}
        serializer = MessageSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RegisterView(APIView):
    """User registration endpoint.

    POST /api/auth/register
    """

    permission_classes = [AllowAny]

    @extend_schema(request=AuthRegisterSerializer, responses={201: AuthTokenResponseSerializer})
    def post(self, request):
        serializer = AuthRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        member = serializer.save()

        response_serializer = AuthTokenResponseSerializer(
            {"token": member.token, "member": member}
        )
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """User login endpoint.

    POST /api/auth/login
    """

    permission_classes = [AllowAny]

    @extend_schema(request=AuthCredentialsSerializer, responses={200: AuthTokenResponseSerializer})
    def post(self, request):
        serializer = AuthCredentialsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]

        try:
            member = Member.objects.get(username=username)
        except Member.DoesNotExist as exc:  # pragma: no cover - simple branch
            raise AuthenticationFailed("Invalid credentials.") from exc

        if not check_password(password, member.password):
            raise AuthenticationFailed("Invalid credentials.")

        if not member.token:
            from secrets import token_hex

            token = token_hex(20)
            while Member.objects.filter(token=token).exists():
                token = token_hex(20)

            member.token = token
            member.save(update_fields=["token"])

        response_serializer = AuthTokenResponseSerializer(
            {"token": member.token, "member": member}
        )
        return Response(response_serializer.data, status=status.HTTP_200_OK)


class MeView(APIView):
    """Current authenticated member profile.

    GET, PATCH /api/members/me
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: MemberSerializer})
    def get(self, request):
        serializer = MemberSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(request=AuthProfileUpdateSerializer, responses={200: MemberSerializer})
    def patch(self, request):
        member = request.user
        serializer = AuthProfileUpdateSerializer(
            data=request.data,
            context={"member": member},
            partial=True,
        )
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        updated_fields = []

        if "username" in data:
            member.username = data["username"]
            updated_fields.append("username")

        if "password" in data:
            member.password = make_password(data["password"])
            updated_fields.append("password")

        if updated_fields:
            member.save(update_fields=updated_fields)

        response_serializer = MemberSerializer(member)
        return Response(response_serializer.data, status=status.HTTP_200_OK)


class ChatMessageListCreateView(APIView):
    """List and create group chat messages.

    GET, POST /api/chat/messages
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: ChatMessageSerializer(many=True)})
    def get(self, request):
        messages = ChatMessage.objects.select_related("author").order_by("created_at")
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(request=ChatMessageCreateSerializer, responses={201: ChatMessageSerializer})
    def post(self, request):
        serializer = ChatMessageCreateSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        message = serializer.save()

        response_serializer = ChatMessageSerializer(message)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
