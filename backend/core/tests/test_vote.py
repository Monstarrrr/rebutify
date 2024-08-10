from django.contrib.auth.models import User
from django.test import Client, TestCase
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken

from core.models import Post, Vote


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

    def upvote(self, argument_id):
        url = reverse("upvote-argument", kwargs={"id": argument_id})
        response = self.client.post(url)
        return response

    def downvote(self, argument_id):
        url = reverse("downvote-argument", kwargs={"id": argument_id})
        response = self.client.post(url)
        return response

    def test_upvotes_api(self):
        # Ensure no votes between user1 and argument1
        votes = Vote.objects.filter(
            parentId=self.argument1.pk, ownerUserId=self.user1.pk
        )
        self.assertEqual(len(votes), 0)

        # Upvote argument1 from user1
        response = self.upvote(1)
        self.assertEqual(response.status_code, 200)

        # Ensure there exists upvote between user1 and argument1
        v = Vote.objects.get(parentId=self.argument1.pk, ownerUserId=self.user1.pk)
        self.assertTrue(v.is_upvoted())

        # Upvote already upvoted argument (error)
        response = self.upvote(1)
        self.assertEqual(response.status_code, 400)

        # Ensure there exists upvote between user1 and argument1
        v = Vote.objects.get(parentId=self.argument1.pk, ownerUserId=self.user1.pk)
        self.assertTrue(v.is_upvoted())

        # Upvote downvoted argument
        # Downvote argument1 from user1
        v.downvote()
        v.save()
        # Upvote argument1 from user1
        response = self.upvote(1)
        self.assertEqual(response.status_code, 200)

        # Upvote argument2 from user1
        response = self.upvote(2)

        # Ensure there exists upvote between user1 and argument2
        v = Vote.objects.get(parentId=self.argument2.pk, ownerUserId=self.user1.pk)
        self.assertTrue(v.is_upvoted())

    # This function assumes that the upvote api is working
    def test_upvotes_undo_api(self):
        # TODO: Undo upvote upvoted argument created by same user

        # TODO: Undo upvote upvoted argument created by another user

        # TODO: Undo upvote for an argument that is downvoted (error)

        # TODO: Undo upvote for an argument that the user didn't vote (error)
        pass

    def test_downvotes_api(self):
        # Ensure no votes between user1 and argument1
        votes = Vote.objects.filter(
            parentId=self.argument1.pk, ownerUserId=self.user1.pk
        )
        self.assertEqual(len(votes), 0)

        # Downvote argument1 from user1
        response = self.downvote(1)
        self.assertEqual(response.status_code, 200)

        # Ensure there exists upvote between user1 and argument1
        v = Vote.objects.get(parentId=self.argument1.pk, ownerUserId=self.user1.pk)
        self.assertTrue(v.is_downvoted())

        # Downvote already downvoted argument (error)
        response = self.downvote(1)
        self.assertEqual(response.status_code, 400)

        # Ensure there exists downvote between user1 and argument1
        v = Vote.objects.get(parentId=self.argument1.pk, ownerUserId=self.user1.pk)
        self.assertTrue(v.is_downvoted())

        # Downvote upvoted argument
        # Upvote argument1 from user1
        v.upvote()
        v.save()
        # Downvote argument1 from user1
        response = self.downvote(1)
        self.assertEqual(response.status_code, 200)

        # Downvote argument2 from user1
        response = self.downvote(2)
        self.assertEqual(response.status_code, 200)

        # Ensure there exists downvote between user1 and argument2
        v = Vote.objects.get(parentId=self.argument2.pk, ownerUserId=self.user1.pk)
        self.assertTrue(v.is_downvoted())

    # This function assumes that the downvote api is working
    def test_downvotes_undo_api(self):
        # TODO: Undo downvote downvoted argument created by same user

        # TODO: Undo downvote downvoted argument created by another user

        # TODO: Undo downvote for an argument that is downvoted (error)

        # TODO: Undo downvote for an argument that the user didn't vote (error)
        pass
