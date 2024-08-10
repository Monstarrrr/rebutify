from django.urls import reverse

from core.models import Vote
from core.tests.test_votes.test_votes_base import VoteTests


class DownvoteTests(VoteTests):
    def call_downvote_api(self, argument_id):
        url = reverse("downvote-argument", kwargs={"id": argument_id})
        response = self.client.post(url)
        return response

    # Ensure no votes between user1 and argument1
    def test_no_votes_initially(self):
        votes = Vote.objects.filter(
            parentId=self.argument1.pk, ownerUserId=self.user1.pk
        )
        self.assertEqual(len(votes), 0)

    # Test downvoting argument1 (created by user1) from user1
    def test_downvote_owned_argument(self):
        # Downvote argument1 from user1
        response = self.call_downvote_api(self.argument1.pk)
        self.assertEqual(response.status_code, 200)

        # Ensure there exists downvote between user1 and argument1
        v = Vote.objects.get(parentId=self.argument1.pk, ownerUserId=self.user1.pk)
        self.assertTrue(v.is_downvoted())

    # Test downvoting already downvoted argument (error)
    def test_downvote_twice(self):
        # Create downvote between user1 and argument1
        self.create_downvote(ownerUserId=self.user1.pk, parentId=self.argument1.pk)

        # Downvote argument
        response = self.call_downvote_api(self.argument1.pk)
        self.assertEqual(response.status_code, 400)

        # Ensure there exists downvote between user1 and argument1
        v = Vote.objects.get(parentId=self.argument1.pk, ownerUserId=self.user1.pk)
        self.assertTrue(v.is_downvoted())

    # Test upvoted argument
    def test_downvote_upvoted_argument(self):
        # Create upvote between user1 and argument1
        self.create_upvote(ownerUserId=self.user1.pk, parentId=self.argument1.pk)

        # Test downvoting upvoted argument
        response = self.call_downvote_api(self.argument1.pk)
        self.assertEqual(response.status_code, 200)

    # Test downvoting argument created by some other user
    def test_downvote_non_owned_argument(self):
        # Downvote argument2 from user1
        response = self.call_downvote_api(self.argument2.pk)
        self.assertEqual(response.status_code, 200)

        # Ensure there exists downvote between user1 and argument2
        v = Vote.objects.get(parentId=self.argument2.pk, ownerUserId=self.user1.pk)
        self.assertTrue(v.is_downvoted())
