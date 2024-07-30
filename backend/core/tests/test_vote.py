from django.test import Client, TestCase
from django.urls import reverse

from core.models import Vote


class VoteTests(TestCase):
    def setUp(self):
        self.client = Client()

        # Create sample upvote
        self.sample_upvote = Vote.objects.create(
            type="upvote",
            ownerUserId=1,
            parentId=345432,
            created="2024-06-26 02:20:58.689998+00:00",
        )

        # Create sample downvote
        self.sample_downvote = Vote.objects.create(
            type="downvote",
            ownerUserId=1,
            parentId=345433,
            created="2024-06-26 02:20:58.689998+00:00",
        )

    def test_upvotes_api(self):
        # Test the upvotes API endpoint
        response = self.client.get(reverse("upvotes-list"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_upvote.type)

    def test_downvotes_api(self):
        # Test the downvotes API endpoint
        response = self.client.get(reverse("downvotes-list"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_downvote.type)
