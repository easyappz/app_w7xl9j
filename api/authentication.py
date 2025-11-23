from typing import Optional, Tuple

from django.utils.translation import gettext_lazy as _
from rest_framework import authentication, exceptions

from .models import Member


class MemberTokenAuthentication(authentication.BaseAuthentication):
    """Simple token-based authentication for Member model.

    Expects header: "Authorization: Token <token>".
    """

    keyword = "Token"

    def authenticate(self, request) -> Optional[Tuple[Member, None]]:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0] != self.keyword:
            # Malformed header – treat as no authentication rather than hard fail.
            return None

        token = parts[1]
        if not token:
            return None

        try:
            member = Member.objects.get(token=token)
        except Member.DoesNotExist as exc:  # pragma: no cover - simple branch
            raise exceptions.AuthenticationFailed(_("Invalid token.")) from exc

        return (member, None)

    def authenticate_header(self, request) -> str:  # pragma: no cover - simple
        return self.keyword
