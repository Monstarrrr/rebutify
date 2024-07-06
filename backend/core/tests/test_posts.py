from django.test import Client, TestCase
from django.urls import reverse

from core.models import Posts, Vote


class PostsTests(TestCase):
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
        self.sample_post = Posts.objects.create(
            type="argument",
            created="2024-06-26 02:20:58.689998+00:00",
            updated="2024-06-26 02:20:58.689998+00:00",
            body="<p>Sample post content</p>",
            ownerUserId=1,
            title="Sample Title",
        )
        self.sample_post.upvotes.set([self.sample_upvote])
        self.sample_post.downvotes.set([self.sample_downvote])

        # Create sample rebuttal
        self.sample_rebuttal = Posts.objects.create(
            id="2345432",
            parentId="654332",
            type="rebuttal",
            created="2024-06-26 02:20:58.689998+00:00",
            updated="2024-06-26 02:20:58.689998+00:00",
            body="<p>Sample rebuttal content</p>",
            ownerUserId=1,
        )
        self.sample_rebuttal.upvotes.set([self.sample_upvote])
        self.sample_rebuttal.downvotes.set([self.sample_downvote])

        # Create sample comment
        self.sample_comment = Posts.objects.create(
            id="7643424",
            parentId="654332",
            type="comment",
            created="2024-06-26 02:20:58.689998+00:00",
            updated="2024-06-26 02:20:58.689998+00:00",
            body="<p>Sample comment content</p>",
            ownerUserId=1,
        )
        self.sample_comment.upvotes.set([self.sample_upvote])
        self.sample_comment.downvotes.set([self.sample_downvote])

    def test_posts_api(self):
        # Test the posts API endpoint
        page_size = 5
        response = self.client.get(
            reverse("posts-list", kwargs={"page_size": page_size})
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_post.title)

    def test_rebuttals_api(self):
        # Test the rebuttals API endpoint
        parentId = "654332"
        page_size = 2
        response = self.client.get(
            reverse(
                "rebuttals-list", kwargs={"parentId": parentId, "page_size": page_size}
            )
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_rebuttal.type)

    def test_comments_api(self):
        # Test the comments API endpoint
        parentId = "654332"
        page_size = 3
        response = self.client.get(
            reverse(
                "comments-list", kwargs={"parentId": parentId, "page_size": page_size}
            )
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_comment.type)
