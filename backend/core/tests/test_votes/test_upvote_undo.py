from core.tests.test_votes.test_vote import VoteTests


class UpvoteUndoTests(VoteTests):
    # Upvote argument1 from user1 and call undo upvote api
    def test_undo_upvote_same_user(self):
        self.call_upvote_api(1)
        response = self.call_upvote_undo_api(1)
        self.assertEqual(response.status_code, 200)

    # Upvote argument1 from user1 and
    def test_undo_upvote_twice(self):
        self.call_upvote_api(1)

        # Call undo upvote api twice
        self.call_upvote_undo_api(1)
        response = self.call_upvote_undo_api(1)
        self.assertEqual(response.status_code, 400)

    # This function assumes that the upvote api is working
    def test_upvotes_undo_api(self):
        # TODO: Undo upvote upvoted argument created by another user

        # TODO: Undo upvote for an argument that is downvoted (error)

        # TODO: Undo upvote for an argument that the user didn't vote (error)
        pass
