from django.urls import path

from .views import (
    HelloView,
    RegisterView,
    LoginView,
    MeView,
    ChatMessageListCreateView,
)

urlpatterns = [
    path("hello/", HelloView.as_view(), name="hello"),
    path("auth/register", RegisterView.as_view(), name="auth-register"),
    path("auth/login", LoginView.as_view(), name="auth-login"),
    path("members/me", MeView.as_view(), name="members-me"),
    path("chat/messages", ChatMessageListCreateView.as_view(), name="chat-messages"),
]
