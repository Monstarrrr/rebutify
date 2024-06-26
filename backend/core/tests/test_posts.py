from django.test import Client, TestCase
from django.urls import reverse

from core.models import Posts


class PostsTests(TestCase):
    def setUp(self):
        # Create a client instance
        self.client = Client()

        # Create sample post
        self.sample_post = Posts.objects.create(
            type="argument",
            createdAt="2024-06-26 02:20:58.689998+00:00",
            updatedAt="2024-06-26 02:20:58.689998+00:00",
            body="<p>Sample post content</p>",
            ownerUserId=1,
            title="Sample Title",
        )

    def test_posts_api(self):
        # Test the posts API endpoint
        response = self.client.get(reverse("posts-list"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_post.title)
