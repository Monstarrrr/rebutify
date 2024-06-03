# Create your tests here.
from django.contrib.auth.models import User
from django.test import Client, TestCase
from django.urls import reverse

from ..models import Posts, Tags, UserProfile


class CoreTests(TestCase):
    def setUp(self):
        # Create a client instance
        self.client = Client()

        # Create sample tag
        self.sample_tag = Tags.objects.create(
            tagName="tag1",
            count=1,
            excerptPostId=1,
            wikiPostId=1,
            isModeratorOnly=False,
            isRequired=True,
        )

        # Create sample post
        self.sample_post = Posts.objects.create(
            postTypeId=1,
            acceptedAnswerId=1,
            parentId=1,
            creationDate="2024-01-01",
            deletionDate=None,
            score=10,
            viewcount=100,
            body="<p>Sample post content</p>",
            ownerUserId=1,
            ownerDisplayName="John Doe",
            lastEditorUserId=1,
            lastEditorDisplayName="Jane Doe",
            lastEditDate="2024-01-02",
            lastActivityDate="2024-01-03",
            title="Sample Title",
            answerCount=0,
            commentCount=0,
            favoriteCount=0,
            closedDate=None,
            communityOwnedDate=None,
        )
        # Correctly assign the tag to the post
        self.sample_post.tags.set([self.sample_tag])

        # Create sample user
        user = User.objects.create_superuser("username")
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

    def test_tags_api(self):
        # Test the tags API endpoint
        response = self.client.get(reverse("tags-list"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_tag.tagName)

    def test_posts_api(self):
        # Test the posts API endpoint
        response = self.client.get(reverse("posts-list"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_post.title)

    def test_user_profile_api(self):
        # Test the user profile API endpoint
        response = self.client.get(reverse("user-profile-list"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_user_profile.username)

    def test_alivecheck_smoketest(self):
        response = self.client.get(reverse("alive-list"))
        self.assertEqual(response.status_code, 200)
