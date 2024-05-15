# Create your tests here.
from django.test import Client, TestCase
from django.urls import reverse

from .models import Posts, Tags


class CoreTests(TestCase):
    def setUp(self):
        # Create a client instance
        self.client = Client()

        # Create sample posts and tags
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

        self.sample_tag = Tags.objects.create(
            tagName="tag1",
            count=1,
            excerptPostId=1,
            wikiPostId=1,
            isModeratorOnly=False,
            isRequired=True,
        )

        # Correctly assign the tag to the post
        self.sample_post.tags.set([self.sample_tag])

    def test_posts_api(self):
        # Test the posts API endpoint
        response = self.client.get(reverse("posts-list"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_post.title)

    def test_tags_api(self):
        # Test the tags API endpoint
        response = self.client.get(reverse("tags-list"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_tag.tagName)

    def test_alivecheck_smoketest(self):
        response = self.client.get(reverse("alive-list"))
        self.assertEqual(response.status_code, 200)
