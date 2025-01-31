from django.db import models

UPVOTE = "upvote"
DOWNVOTE = "downvote"
VOTE_TYPES = [
    (UPVOTE, "upvote"),
    (DOWNVOTE, "downvote"),
]


class Vote(models.Model):
    type: models.CharField = models.CharField(
        max_length=10, choices=VOTE_TYPES, default=UPVOTE
    )
    ownerUserId: models.IntegerField = models.IntegerField(null=True)
    parentId: models.IntegerField = models.IntegerField(null=True)
    created: models.DateTimeField = models.DateTimeField(auto_now_add=True)
