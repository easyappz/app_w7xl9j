from django.contrib import admin

from .models import Member, ChatMessage


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "created_at")
    search_fields = ("username",)


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ("id", "author", "created_at")
    search_fields = ("author__username",)
    raw_id_fields = ("author",)
