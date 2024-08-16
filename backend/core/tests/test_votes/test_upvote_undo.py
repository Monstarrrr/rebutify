from django.urls import reverse

from core.models import Vote
from core.tests.test_votes.test_votes_base import VoteTests


class UpvoteUndoTests(VoteTests):
    def call_upvote_undo_api(self, argument_id):
        url = reverse("upvote-argument-undo", kwargs={"id": argument_id})
        response = self.client.post(url)
        return response

    # Upvote argument1 from user1 and call undo upvote api
    def test_undo_upvote_same_user(self):
        # Create upvote between user1 and argument1
        self.create_upvote(ownerUserId=self.user1.pk, parentId=self.argument1.pk)
        response = self.call_upvote_undo_api(self.argument1.pk)
        self.assertEqual(response.status_code, 200)

        # Check no upvote exists between user1 and argument1
        votes = Vote.objects.filter(
            ownerUserId=self.user1.pk, parentId=self.argument1.pk
        )
        self.assertEqual(len(votes), 0)

    # Undo upvote twice (error)
    def test_undo_upvote_twice(self):
        # Create upvote between user1 and argument1
        self.create_upvote(ownerUserId=self.user1.pk, parentId=self.argument1.pk)

        # Call undo upvote api twice (error)
        response = self.call_upvote_undo_api(self.argument1.pk)
        self.assertEqual(response.status_code, 200)
        response = self.call_upvote_undo_api(self.argument1.pk)
        self.assertEqual(response.status_code, 400)

        # Check no upvote exists between user1 and argument1
        votes = Vote.objects.filter(
            ownerUserId=self.user1.pk, parentId=self.argument1.pk
        )
        self.assertEqual(len(votes), 0)

    # Undo upvote for a downvoted argument (error)
    def test_undo_upvote_downvoted_argument(self):
        # Create downvote between user1 and argument1
        self.create_downvote(ownerUserId=self.user1.pk, parentId=self.argument1.pk)

        # Call undo upvote (error)
        response = self.call_upvote_undo_api(self.argument1.pk)
        self.assertEqual(response.status_code, 400)

        # Check downvote exists between user1 and argument1
        v = Vote.objects.get(ownerUserId=self.user1.pk, parentId=self.argument1.pk)
        self.assertTrue(v.is_downvoted())

    # Undo upvote for an argument that the user didn't vote (error)
    def test_undo_upvote_for_no_upvote(self):
        # Call undo upvote (error)
        self.call_upvote_undo_api(self.argument1.pk)
        response = self.call_upvote_undo_api(self.argument1.pk)
        self.assertEqual(response.status_code, 400)

    # Undo upvote upvoted argument created by another user
    def test_undo_upvote_non_owned_argument(self):
        # Create upvote between user1 and argument2 (created by user2)
        self.create_upvote(ownerUserId=self.user1.pk, parentId=self.argument2.pk)

        # Call undo upvote api
        response = self.call_upvote_undo_api(self.argument2.pk)
        self.assertEqual(response.status_code, 200)

        # Check no upvote exists between user1 and argument1
        votes = Vote.objects.filter(
            ownerUserId=self.user1.pk, parentId=self.argument1.pk
        )
        self.assertEqual(len(votes), 0)
