from django.test import Client, TestCase
from django.urls import reverse

from core.models import Post, Report


class ReportTests(TestCase):
    def setUp(self):
        # Create a client instance
        self.client = Client()

        # Create sample post
        self.sample_post = Post.objects.create(
            id="008643568",
            type="argument",
            isPrivate=False,
            created="2024-06-26 02:20:58.689998+00:00",
            updated="2024-06-26 02:20:58.689998+00:00",
            body="<p>Sample post content</p>",
            ownerUserId=1,
            title="Sample Title",
        )

        # Create sample report dict
        self.sample_report_dict = {
            "id": "67659876",
            "parentId": "008643568",
            "created": "2024-06-26 02:20:58.689998+00:00",
            "body": "<p>Sample report content</p>",
            "options": "sample report options",
        }

        # Create sample report
        self.sample_report = Report.objects.create(
            id="65775545",
            parentId="008643568",
            created="2024-06-26 02:20:58.689998+00:00",
            body="<p>Sample report content</p>",
            options="sample report options",
        )

    def test_add_reports_api(self):
        # Test the suggestions API endpoint
        response = self.client.post(
            reverse("arguments-add-reports", kwargs={"pk": self.sample_post.id}),
            data=self.sample_report_dict,
        )
        self.assertEqual(response.status_code, 200)
        if not Report.objects.filter(id=self.sample_report_dict["id"]).exists():
            self.fail("Sample report not found")

    def test_report_options_api(self):
        # Test the report options API endpoint
        response = self.client.get(
            reverse("arguments-reports-options", kwargs={"pk": self.sample_post.id})
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.sample_report.options)
