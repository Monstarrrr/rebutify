from core.models import Vote
from core.tests.test_vote import VoteTests


class UpvoteTests(VoteTests):
    def test_upvotes_api(self):
        # Ensure no votes between user1 and argument1
        votes = Vote.objects.filter(
            parentId=self.argument1.pk, ownerUserId=self.user1.pk
        )
        self.assertEqual(len(votes), 0)

        # Upvote argument1 from user1
        response = self.call_upvote_api(1)
        self.assertEqual(response.status_code, 200)

        # Ensure there exists upvote between user1 and argument1
        v = Vote.objects.get(parentId=self.argument1.pk, ownerUserId=self.user1.pk)
        self.assertTrue(v.is_upvoted())

        # Upvote already upvoted argument (error)
        response = self.call_upvote_api(1)
        self.assertEqual(response.status_code, 400)

        # Ensure there exists upvote between user1 and argument1
        v = Vote.objects.get(parentId=self.argument1.pk, ownerUserId=self.user1.pk)
        self.assertTrue(v.is_upvoted())

        # Upvote downvoted argument
        # Downvote argument1 from user1
        v.downvote()
        v.save()
        # Upvote argument1 from user1
        response = self.call_upvote_api(1)
        self.assertEqual(response.status_code, 200)

        # Upvote argument2 from user1
        response = self.call_upvote_api(2)
        self.assertEqual(response.status_code, 200)

        # Ensure there exists upvote between user1 and argument2
        v = Vote.objects.get(parentId=self.argument2.pk, ownerUserId=self.user1.pk)
        self.assertTrue(v.is_upvoted())
