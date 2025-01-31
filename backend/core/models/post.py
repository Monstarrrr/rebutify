from django.contrib.auth.models import User
from django.db import models

TITLE_MAX_LEN = 255
ARGUMENT = "argument"
REBUTTAL = "rebuttal"
COMMENT = "comment"
SUGGESTION = "suggestion"
POST_TYPES = [
    (ARGUMENT, ARGUMENT),
    (REBUTTAL, REBUTTAL),
    (COMMENT, COMMENT),
    (SUGGESTION, SUGGESTION),
]


class Post(models.Model):
    """Post database model"""

    type: models.CharField = models.CharField(
        max_length=10, choices=POST_TYPES, default=ARGUMENT
    )
    isPrivate: models.BooleanField = models.BooleanField(default=False)
    body: models.TextField = models.TextField()  # render as HTML
    title: models.CharField = models.CharField(max_length=TITLE_MAX_LEN)
    ownerUserId: models.IntegerField = models.IntegerField(null=True)
    parentId: models.IntegerField = models.IntegerField(null=True, blank=True)
    created: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated: models.DateTimeField = models.DateTimeField(auto_now=True)
    upvotes: models.IntegerField = models.IntegerField(null=False, default=0)
    downvotes: models.IntegerField = models.IntegerField(null=False, default=0)
    followers: models.ManyToManyField = models.ManyToManyField(
        User, related_name="followers", blank=True
    )
    isPending: models.BooleanField = models.BooleanField(default=False)
