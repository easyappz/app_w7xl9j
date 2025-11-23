from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from .models import Member, ChatMessage


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=200)
    timestamp = serializers.DateTimeField(read_only=True)


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ["id", "username", "created_at"]
        read_only_fields = ["id", "created_at"]


class AuthRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Member
        fields = ["username", "password"]

    def validate_username(self, value: str) -> str:
        if Member.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already taken.")
        return value

    def create(self, validated_data):
        import secrets

        raw_password = validated_data.pop("password")
        hashed_password = make_password(raw_password)
        validated_data["password"] = hashed_password

        token = secrets.token_hex(20)
        while Member.objects.filter(token=token).exists():
            token = secrets.token_hex(20)

        member = Member.objects.create(token=token, **validated_data)
        return member


class AuthCredentialsSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class AuthTokenResponseSerializer(serializers.Serializer):
    token = serializers.CharField()
    member = MemberSerializer()


class AuthProfileUpdateSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    password = serializers.CharField(required=False, write_only=True)

    def validate_username(self, value: str) -> str:
        member = self.context.get("member")
        qs = Member.objects.filter(username=value)
        if member is not None:
            qs = qs.exclude(id=member.id)
        if qs.exists():
            raise serializers.ValidationError("Username is already taken.")
        return value


class ChatMessageSerializer(serializers.ModelSerializer):
    author = MemberSerializer(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ["id", "author", "text", "created_at"]
        read_only_fields = ["id", "author", "created_at"]


class ChatMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ["text"]

    def create(self, validated_data):
        request = self.context.get("request")
        author = getattr(request, "user", None)
        if author is None:
            raise serializers.ValidationError("Author is required.")
        return ChatMessage.objects.create(author=author, **validated_data)
