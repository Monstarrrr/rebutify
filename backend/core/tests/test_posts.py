import os

from django.contrib.auth.models import User
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

        # Create sample user
        self.sample_username = "sample_user"
        self.sample_password = os.environ["SAMPLE_USER_PASSWORD"]
        self.sample_user = User.objects.create_user(
            username=self.sample_username, password=self.sample_password
        )

        # Create sample post
        self.sample_post = Post.objects.create(
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

    def test_argument_follow(self):
        id = self.sample_post.id

        # User logs in
        self.client.login(username=self.sample_username, password=self.sample_password)

        # Test argument followers
        response = self.client.get(reverse("arguments-followers", kwargs={"pk": id}))
        self.assertEqual(response.status_code, 200)
        self.assertNotContains(response, self.sample_user.id)

        # Test argument follow
        response = self.client.post("/api/arguments/{id}/follow/".format(id=id))
        self.assertEqual(response.status_code, 200)

        # Test argument followers a second time
        response = self.client.get(reverse("arguments-followers", kwargs={"pk": id}))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_user.id)

        # Test argument undo follow
        response = self.client.post("/api/arguments/{id}/follow/undo/".format(id=id))
        self.assertEqual(response.status_code, 200)

        # Test argument followers a third time
        response = self.client.get(reverse("arguments-followers", kwargs={"pk": id}))
        self.assertEqual(response.status_code, 200)
        self.assertNotContains(response, self.sample_user.id)
