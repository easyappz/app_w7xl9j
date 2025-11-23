from rest_framework.test import APITestCase


class ChatMessageAPITests(APITestCase):
    def setUp(self) -> None:
        self.register_url = "/api/auth/register"
        self.chat_url = "/api/chat/messages"

        payload = {"username": "testuser", "password": "testpass123"}
        response = self.client.post(self.register_url, payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.token = response.data["token"]

    def test_authenticated_chat_message_create_and_list(self) -> None:
        """Authenticated member can create and list chat messages."""

        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token}")

        create_payload = {"text": "Hello world"}
        response = self.client.post(self.chat_url, create_payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["text"], "Hello world")
        self.assertIn("author", response.data)
        self.assertEqual(response.data["author"]["username"], "testuser")

        list_response = self.client.get(self.chat_url)
        self.assertEqual(list_response.status_code, 200)
        self.assertGreaterEqual(len(list_response.data), 1)

    def test_unauthenticated_chat_message_create_rejected(self) -> None:
        """Unauthenticated member cannot create chat messages."""

        create_payload = {"text": "Should not work"}
        response = self.client.post(self.chat_url, create_payload, format="json")
        self.assertEqual(response.status_code, 401)

    def test_unauthenticated_chat_message_list_rejected(self) -> None:
        """Unauthenticated member cannot list chat messages."""

        response = self.client.get(self.chat_url)
        self.assertEqual(response.status_code, 401)
