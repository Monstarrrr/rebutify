from core.models import Vote
from core.tests.test_vote import VoteTests


class UpvoteTests(VoteTests):
    # Ensure no votes between user1 and argument1
    def test_no_votes_initially(self):
        votes = Vote.objects.filter(
            parentId=self.argument1.pk, ownerUserId=self.user1.pk
        )
        self.assertEqual(len(votes), 0)

    # Test upvoting argument1 (created by user1) from user1
    def test_upvote_owned_argument(self):
        # Upvote argument1 from user1
        response = self.call_upvote_api(1)
        self.assertEqual(response.status_code, 200)

        # Ensure there exists upvote between user1 and argument1
        v = Vote.objects.get(parentId=self.argument1.pk, ownerUserId=self.user1.pk)
        self.assertTrue(v.is_upvoted())

    # Test upvoting already upvoted argument (error)
    def test_upvote_twice(self):
        # Upvote argument twice
        self.call_upvote_api(1)
        response = self.call_upvote_api(1)
        self.assertEqual(response.status_code, 400)

        # Ensure there exists upvote between user1 and argument1
        v = Vote.objects.get(parentId=self.argument1.pk, ownerUserId=self.user1.pk)
        self.assertTrue(v.is_upvoted())

    # Test downvoted argument
    def test_upvote_downvoted_argument(self):
        # Upvote argument and downvote manually
        self.call_upvote_api(1)
        v = Vote.objects.get(parentId=self.argument1.pk, ownerUserId=self.user1.pk)
        v.downvote()
        v.save()

        # Test upvoting downvoted argument
        response = self.call_upvote_api(1)
        self.assertEqual(response.status_code, 200)

    # Test upvoting argument created by some other user
    def test_upvote_non_owned_argument(self):
        # Upvote argument2 from user1
        response = self.call_upvote_api(2)
        self.assertEqual(response.status_code, 200)

        # Ensure there exists upvote between user1 and argument2
        v = Vote.objects.get(parentId=self.argument2.pk, ownerUserId=self.user1.pk)
        self.assertTrue(v.is_upvoted())
