from django.test import Client, TestCase
from django.urls import reverse

from core.models import Post


class PostTests(TestCase):
    def setUp(self):
        # Create a client instance
        self.client = Client()

        # Create sample post
        self.sample_post = Post.objects.create(
            type="argument",
            isPrivate=False,
            createdAt="2024-06-26 02:20:58.689998+00:00",
            updatedAt="2024-06-26 02:20:58.689998+00:00",
            body="<p>Sample post content</p>",
            ownerUserId=1,
            title="Sample Title",
        )

        # Create sample rebuttal
        self.sample_rebuttal = Post.objects.create(
            id="2345432",
            parentId="654332",
            type="rebuttal",
            isPrivate=False,
            createdAt="2024-06-26 02:20:58.689998+00:00",
            updatedAt="2024-06-26 02:20:58.689998+00:00",
            body="<p>Sample rebuttal content</p>",
            ownerUserId=1,
        )

        # Create sample comment
        self.sample_comment = Post.objects.create(
            id="7643424",
            parentId="654332",
            type="comment",
            isPrivate=False,
            createdAt="2024-06-26 02:20:58.689998+00:00",
            updatedAt="2024-06-26 02:20:58.689998+00:00",
            body="<p>Sample comment content</p>",
            ownerUserId=1,
        )

    def test_post_api(self):
        # Test the post API endpoint
        response = self.client.get(reverse("posts-list"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_post.title)

    def test_rebuttals_api(self):
        # Test the rebuttals API endpoint
        parentId = "654332"
        response = self.client.get(
            reverse("rebuttals-list", kwargs={"parentId": parentId})
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_rebuttal.type)

    def test_comments_api(self):
        # Test the comments API endpoint
        parentId = "654332"
        response = self.client.get(
            reverse("comments-list", kwargs={"parentId": parentId})
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_comment.type)
