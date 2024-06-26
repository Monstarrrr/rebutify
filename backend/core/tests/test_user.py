from django.contrib.auth.models import User
from django.test import Client, TestCase
from django.urls import reverse

from core.models import Posts, UserProfile


class UserTests(TestCase):
    def setUp(self):
        self.client = Client()
        user = User.objects.create_superuser("username")

        self.sample_post = Posts.objects.create(
            type="argument",
            createdAt="2024-06-26 02:20:58.689998+00:00",
            updatedAt="2024-06-26 02:20:58.689998+00:00",
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
            joinDate="2024-01-01",
            upVotes=1,
            downVotes=1,
        )
        # Correctly assign the post to the user profile
        self.sample_user_profile.posts.set([self.sample_post])
        self.sample_user_profile.edits.set([self.sample_post])
        self.sample_user_profile.savedPosts.set([self.sample_post])
        self.sample_user_profile.private_post.set([self.sample_post])

    def test_user_profile_api(self):
        # Test the user profile API endpoint
        response = self.client.get(reverse("user-profile-list"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_user_profile.username)
