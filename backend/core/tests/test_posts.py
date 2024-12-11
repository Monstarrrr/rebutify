import ast
import json
import os

from django.contrib.auth.models import User
from django.test import Client, TestCase
from django.urls import reverse

from core.models import Post, Report, Vote


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
        self.sample_user = User.objects.create_superuser(
            username=self.sample_username, password=self.sample_password
        )
        self.sample_user.save()

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

        # Create sample report
        self.sample_report = Report.objects.create(
            id=43546543,
            ownerUserId=1,
            parentId=self.sample_post.id,
            created="2024-06-26 02:20:58.689998+00:00",
            body="<p>Sample report content</p>",
            options=["Test Report Option"],
        )

        # Create sample report dictionary
        self.sample_report_dict = {
            "id": 67659876,
            "ownerUserId": 1,
            "parentId": self.sample_post.id,
            "created": "2024-06-26 02:20:58.689998+00:00",
            "body": "<p>Sample report content</p>",
            "options": ["Not assertive", "Duplicate", "Needs improvement"],
        }

        # Create sample suggestion
        self.sample_suggestion_dict = {
            "id": 765768867,
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

    def test_argument_reports_api(self):
        id = self.sample_post.id

        # User logs in
        self.client.login(username=self.sample_username, password=self.sample_password)

        # Test get argument reports
        response = self.client.get(reverse("arguments-reports", kwargs={"pk": id}))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_report.id)

        # Test add argument reports
        response = self.client.post(
            "/api/arguments/{id}/reports/add/".format(id=id),
            data=json.dumps(self.sample_report_dict),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            Report.objects.get(id=self.sample_report_dict["id"]).id,
            self.sample_report_dict["id"],
        )

        # Test get argument reports options
        response = self.client.get(
            reverse("arguments-reports-options", kwargs={"pk": id})
        )
        self.assertEqual(response.status_code, 200)
        decoded_response = ast.literal_eval(response.content.decode("UTF-8"))
        if "resources" in decoded_response:
            resources = decoded_response["resources"]
            if "options" in resources:
                options = resources["options"]
            else:
                self.assertRaisesMessage("No options in argument reports options test.")
        else:
            self.assertRaisesMessage("No resources in argument reports options test.")
        self.assertTrue(set(self.sample_report_dict["options"]).issubset(set(options)))

        # User logs out
        self.client.logout()

    def test_suggestions_api(self):
        id = self.sample_post.id

        # User logs in
        self.client.login(username=self.sample_username, password=self.sample_password)

        # Test the suggestions API endpoint
        response = self.client.post(
            "/api/arguments/{id}/suggest-edit/".format(id=id),
            data=json.dumps(self.sample_suggestion_dict),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            Post.objects.get(
                type="suggestion", id=self.sample_suggestion_dict["id"]
            ).id,
            self.sample_suggestion_dict["id"],
        )

        # User logs out
        self.client.logout()

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

        # User logs out
        self.client.logout()
