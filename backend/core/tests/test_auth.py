import base64

from django.contrib.auth.models import User
from django.test import Client, TestCase
from django.urls import reverse


class AuthTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123!!!",
        }
        self.signup_data = {
            "username": "testuser2",
            "email": "test2@example.com",
            "password1": "password123!!!",
            "password2": "password123!!!",
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_register(self):
        response = self.client.post(reverse("register-list"), self.signup_data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(User.objects.filter(username="testuser2").exists())

    def test_login(self):
        login_data = {
            "username": "testuser",
            "password": "password123!!!",
        }
        response = self.client.post(reverse("login-list"), login_data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue("_auth_user_id" in self.client.session)

    def test_logout(self):
        # Log in the user
        login_data = {
            "username": "testuser",
            "password": "password123!!!",
        }
        response = self.client.post(reverse("login-list"), login_data)
        self.assertEqual(response.status_code, 200)

        # Attempt to log out the user
        auth_headers = {
            "HTTP_AUTHORIZATION": "Basic "
            + base64.b64encode(
                bytes(login_data["username"] + "." + login_data["password"], "utf-8")
            ).decode("utf-8"),
        }
        response = self.client.post("/api/logout", **auth_headers)

        self.assertEqual(response.status_code, 200)
        self.assertFalse("_auth_user_id" in self.client.session)
