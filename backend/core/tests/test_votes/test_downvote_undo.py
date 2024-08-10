from core.models import Vote
from core.tests.test_votes.test_vote import VoteTests


class DownvoteUndoTests(VoteTests):
    # Downvote argument1 from user1 and call undo downvote api
    def test_undo_downvote_same_user(self):
        # Create downvote between user1 and argument1
        Vote.objects.create(ownerUserId=self.user1.pk, parentId=self.argument1.pk)
        response = self.call_downvote_undo_api(self.argument1.pk)
        self.assertEqual(response.status_code, 200)

        # Check no downvote exists between user1 and argument1
        votes = Vote.objects.filter(
            ownerUserId=self.user1.pk, parentId=self.argument1.pk
        )
        self.assertEqual(len(votes), 0)

    # Undo downvote twice (error)
    def test_undo_downvote_twice(self):
        # Create downvote between user1 and argument1
        Vote.objects.create(ownerUserId=self.user1.pk, parentId=self.argument1.pk)

        # Call undo downvote api twice (error)
        response = self.call_downvote_undo_api(self.argument1.pk)
        self.assertEqual(response.status_code, 200)
        response = self.call_downvote_undo_api(self.argument1.pk)
        self.assertEqual(response.status_code, 400)

        # Check no downvote exists between user1 and argument1
        votes = Vote.objects.filter(
            ownerUserId=self.user1.pk, parentId=self.argument1.pk
        )
        self.assertEqual(len(votes), 0)

    # Undo downvote for a upvoted argument (error)
    def test_undo_downvote_upvoted_argument(self):
        # Create upvote between user1 and argument1
        Vote.objects.create(ownerUserId=self.user1.pk, parentId=self.argument1.pk)

        # Call undo downvote (error)
        response = self.call_downvote_undo_api(self.argument1.pk)
        self.assertEqual(response.status_code, 400)

        # Check upvote exists between user1 and argument1
        v = Vote.objects.get(ownerUserId=self.user1.pk, parentId=self.argument1.pk)
        self.assertTrue(v.is_upvoted())

    # Undo downvote for an argument that the user didn't vote (error)
    def test_undo_downvote_for_no_downvote(self):
        # Call undo downvote (error)
        self.call_downvote_undo_api(self.argument1.pk)
        response = self.call_downvote_undo_api(self.argument1.pk)
        self.assertEqual(response.status_code, 400)

    # Undo downvote downvoted argument created by another user
    def test_undo_downvote_non_owned_argument(self):
        # Create downvote between user1 and argument2 (created by user2)
        Vote.objects.create(ownerUserId=self.user1.pk, parentId=self.argument2.pk)

        # Call undo downvote api
        response = self.call_downvote_undo_api(self.argument2.pk)
        self.assertEqual(response.status_code, 200)

        # Check no downvote exists between user1 and argument1
        votes = Vote.objects.filter(
            ownerUserId=self.user1.pk, parentId=self.argument1.pk
        )
        self.assertEqual(len(votes), 0)
