from django.contrib.auth.models import User
from django.test import Client, TestCase
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken

from core.models import Post


# This is the base class that the following classes inherit from:
# 1. UpvoteTests
# 2. UpvoteUndoTests
# 3. DownvoteTests
# 4. DownvoteUndoTests
# We do that as they all have the same setup and utility functions
class VoteTests(TestCase):
    # Reference: https://django-rest-framework-simplejwt.readthedocs.io/en/latest/creating_tokens_manually.html
    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

    def setUp(self):
        # User 1
        self.username1 = "testuser1"
        self.password1 = "topsekret1"
        self.user1 = User.objects.create_user(
            username=self.username1,
            password=self.password1,
        )
        self.jwt1 = self.get_tokens_for_user(self.user1)["access"]

        # User 2
        self.username2 = "testuser2"
        self.password2 = "topsekret2"
        self.user2 = User.objects.create_user(
            username=self.username2,
            password=self.password2,
        )

        # Create client (logged in as user1)
        self.client = Client(headers={"Authorization": f"Bearer {self.jwt1}"})

        # Create arguments
        # argument 1 created by user1
        self.argument1 = Post.objects.create(
            body="Body 1", title="Title 1", ownerUserId=self.user1.pk
        )
        # argument 2 created by user2
        self.argument2 = Post.objects.create(
            body="Body 2", title="Title 2", ownerUserId=self.user2.pk
        )

    def call_upvote_api(self, argument_id):
        url = reverse("upvote-argument", kwargs={"id": argument_id})
        response = self.client.post(url)
        return response

    def call_upvote_undo_api(self, argument_id):
        url = reverse("upvote-argument-undo", kwargs={"id": argument_id})
        response = self.client.post(url)
        return response

    def call_downvote_api(self, argument_id):
        url = reverse("downvote-argument", kwargs={"id": argument_id})
        response = self.client.post(url)
        return response

    def call_downvote_undo_api(self, argument_id):
        url = reverse("downvote-argument-undo", kwargs={"id": argument_id})
        response = self.client.post(url)
        return response
