from django.contrib.auth.models import User
from django.test import Client, TestCase


class VoteTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.username1 = "testuser1"
        self.password1 = "topsekret1"
        self.username2 = "testuser2"
        self.password2 = "topsekret2"

        # Reference: https://stackoverflow.com/a/33294746
        # Create users
        user1 = User.objects.create_superuser(
            username=self.username1, password=self.password1
        )
        user2 = User.objects.create_superuser(
            username=self.username2, password=self.password2
        )
        print(user1, user2)

        # Login user 1
        self.client.login(username=self.username1, password=self.password1)

        # TODO: Create arguments
        self.arguments = [
            # TODO: argument 1 created by user1
            # TODO: argument 2 created by user2
        ]

    def test_upvotes_api(self):
        # TODO: Upvote own argument
        # response = self.client.post(reverse("upvote-argument", kwargs={"id": 1}))
        # print(response.json())
        # self.assertEqual(response.status_code, 200)
        # self.assertContains(response, self.sample_upvote.type)

        # TODO: Upvote another person's argument

        # TODO: Upvote already upvoted argument (error)

        # TODO: Upvote downvoted argument

        # TODO: Upvote previously not voted argument
        pass

    # This function assumes that the upvote api is working
    def test_upvotes_undo_api(self):
        # TODO: Undo upvote upvoted argument created by same user

        # TODO: Undo upvote upvoted argument created by another user

        # TODO: Undo upvote for an argument that is downvoted (error)

        # TODO: Undo upvote for an argument that the user didn't vote (error)
        pass

    def test_downvotes_api(self):
        # TODO: Downvote own argument
        # response = self.client.post(reverse("downvote-argument", kwargs={"id": 1}))
        # print(response.json())
        # self.assertEqual(response.status_code, 200)
        # self.assertContains(response, self.sample_downvote.type)

        # TODO: Downvote another person's argument

        # TODO: Downvote already downvoted argument (error)

        # TODO: Downvote upvoted argument

        # TODO: Downvote previously not voted argument
        pass

    # This function assumes that the downvote api is working
    def test_downvotes_undo_api(self):
        # TODO: Undo downvote downvoted argument created by same user

        # TODO: Undo downvote downvoted argument created by another user

        # TODO: Undo downvote for an argument that is downvoted (error)

        # TODO: Undo downvote for an argument that the user didn't vote (error)
        pass
