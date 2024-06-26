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

        # Create sample comment
        self.sample_comment = Posts.objects.create(
            id="7643424",
            parentId="654332",
            type="comment",
            createdAt="2024-06-26 02:20:58.689998+00:00",
            updatedAt="2024-06-26 02:20:58.689998+00:00",
            body="<p>Sample comment content</p>",
            ownerUserId=1,
        )

    def test_posts_api(self):
        # Test the posts API endpoint
        response = self.client.get(reverse("posts-list"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_post.title)

    def test_comments_api(self):
        # Test the comments API endpoint
        parentId = "654332"
        response = self.client.get(
            reverse("comments-list", kwargs={"parentId": parentId})
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_comment.type)
