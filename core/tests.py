# Create your tests here.
from django.test import Client, TestCase


class CoreTests(TestCase):
    def test_alivecheck_smoketest(self):
        c = Client()
        response = c.get("/alivecheck/")
        self.assertEqual(response.status_code, 200)
