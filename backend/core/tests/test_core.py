# Create your tests here.
from django.test import Client, TestCase
from django.urls import reverse


class CoreTests(TestCase):
    def setUp(self):
        # Create a client instance
        self.client = Client()

    def test_alivecheck_smoketest(self):
        response = self.client.get(reverse("alive-list"))
        self.assertEqual(response.status_code, 200)
