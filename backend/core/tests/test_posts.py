from django.test import Client, TestCase
from django.urls import reverse

from core.models import Post, Vote


class PostTests(TestCase):
    def setUp(self):
        # Create a client instance
        self.client = Client()

        # Create sample upvote
        self.sample_upvote = Vote.objects.create(
            type="upvote",
            ownerUserId=1,
            parentId=1,
            created="2024-06-26 02:20:58.689998+00:00",
        )

        # Create sample downvote
        self.sample_downvote = Vote.objects.create(
            type="downvote",
            ownerUserId=1,
            parentId=1,
            created="2024-06-26 02:20:58.689998+00:00",
        )

        # Create sample post
        self.sample_post = Post.objects.create(
            id="76457211",
            type="argument",
            isPrivate=False,
            created="2024-06-26 02:20:58.689998+00:00",
            updated="2024-06-26 02:20:58.689998+00:00",
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
            created="2024-06-26 02:20:58.689998+00:00",
            updated="2024-06-26 02:20:58.689998+00:00",
            body="<p>Sample rebuttal content</p>",
            ownerUserId=1,
        )

        # Create sample comment
        self.sample_comment = Post.objects.create(
            id="7643424",
            parentId="654332",
            type="comment",
            isPrivate=False,
            created="2024-06-26 02:20:58.689998+00:00",
            updated="2024-06-26 02:20:58.689998+00:00",
            body="<p>Sample comment content</p>",
            ownerUserId=1,
        )

        # Create sample suggestion
        self.sample_suggestion = {
            "id": "3245645456542324356",
            "parentId": self.sample_post.id,
            "type": "suggestion",
            "isPrivate": False,
            "created": "2024-06-26 02:20:58.689998+00:00",
            "updated": "2024-06-26 02:20:58.689998+00:00",
            "body": "<p>Sample suggestion content</p>",
            "ownerUserId": 1,
        }

    def test_posts_api(self):
        # Test the posts API endpoint
        page_size = 5
        response = self.client.get(reverse("posts-list"), {"page_size": page_size})
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_post.title)

    def test_rebuttals_api(self):
        # Test the rebuttals API endpoint
        page_size = 2
        response = self.client.get(
            reverse("rebuttals-list"),
            {"page_size": page_size},
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_rebuttal.type)

    def test_comments_api(self):
        # Test the comments API endpoint
        page_size = 3
        response = self.client.get(
            reverse("comments-list"),
            {"page_size": page_size},
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_comment.type)

    def test_suggestions_api(self):
        # Test the suggestions API endpoint
        response = self.client.post(
            reverse("arguments-suggest-edit", kwargs={"pk": self.sample_post.id}),
            data=self.sample_suggestion,
        )
        self.assertEqual(response.status_code, 200)
        if not Post.objects.filter(
            type="suggestion", id=self.sample_suggestion["id"]
        ).exists():
            self.fail("Sample suggestion not found")
