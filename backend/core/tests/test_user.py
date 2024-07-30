from django.contrib.auth.models import User
from django.test import Client, TestCase
from django.urls import reverse

from core.models import Post, UserProfile, Vote


class UserTests(TestCase):
    def setUp(self):
        self.client = Client()
        user = User.objects.create_superuser("username")

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

        self.sample_post = Post.objects.create(
            type="argument",
            isPrivate=False,
            created="2024-06-26 02:20:58.689998+00:00",
            updated="2024-06-26 02:20:58.689998+00:00",
            body="<p>Sample post content</p>",
            ownerUserId=1,
            title="Sample Title",
        )

        # Create sample user profile
        self.sample_user_profile = UserProfile.objects.create(
            user=user,
            username="username",
            avatar="avatar",
            bio="bio",
            reputation=1,
            created="2024-01-01",
        )
        # Correctly assign the edits to the user profile
        self.sample_user_profile.saved_posts.set(
            [
                self.sample_post,
            ]
        )
        self.sample_user_profile.edits.set(
            [
                self.sample_post,
            ]
        )

    def test_user_profiles_api(self):
        # Test the user profiles API endpoint
        response = self.client.get(reverse("user-profiles-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.renderer_context.get("view")
            .get_queryset()
            .first()
            .saved_posts.all()
            .first(),
            self.sample_post,
        )
        self.assertContains(response, self.sample_user_profile.username)
