from django.db import models


class Member(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    token = models.CharField(max_length=40, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["id"]

    def __str__(self) -> str:
        return self.username

    @property
    def is_authenticated(self) -> bool:
        """Compatibility with Django/DRF authentication system.

        Any real Member instance returned by authentication backends
        should be treated as an authenticated user.
        """

        return True

    @property
    def is_anonymous(self) -> bool:
        """Compatibility with Django's AnonymousUser interface."""

        return False


class ChatMessage(models.Model):
    author = models.ForeignKey(
        Member,
        related_name="messages",
        on_delete=models.CASCADE,
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self) -> str:
        return f"Message {self.pk} by {self.author}"
