from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

TITLE_MAX_LEN = 255
LAST_EDITOR_MAX_LEN = 255
OWNER_MAX_LEN = 255
USERNAME_MAX_LEN = 255
AVATAR_MAX_LEN = 255
BIO_MAX_LEN = 255
OPTIONS_MAX_LEN = 255
REPORT_BODY_MAX_LEN = 255
ARGUMENT = "argument"
REBUTTAL = "rebuttal"
COMMENT = "comment"
SUGGESTION = "suggestion"
POST_TYPES = [
    (ARGUMENT, "argument"),
    (REBUTTAL, "rebuttal"),
    (COMMENT, "comment"),
    (SUGGESTION, "suggestion"),
]
UPVOTE = "upvote"
DOWNVOTE = "downvote"
VOTE_TYPES = [
    (UPVOTE, "upvote"),
    (DOWNVOTE, "downvote"),
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
    parentId: models.IntegerField = models.IntegerField(null=True)
    created: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated: models.DateTimeField = models.DateTimeField(auto_now=True)
    upvotes: models.IntegerField = models.IntegerField(null=False, default=0)
    downvotes: models.IntegerField = models.IntegerField(null=False, default=0)
    followers: models.ManyToManyField = models.ManyToManyField(
        User, related_name="followers", blank=True
    )


class Report(models.Model):
    ownerUserId: models.IntegerField = models.IntegerField(null=True)
    parentId: models.IntegerField = models.IntegerField(null=True)
    body: models.TextField = models.TextField(max_length=REPORT_BODY_MAX_LEN, null=True)
    created: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    options: models.JSONField = models.JSONField(null=True)


class UserProfile(models.Model):
    # Public
    user: models.OneToOneField = models.OneToOneField(
        User, on_delete=models.CASCADE, null=True, related_name="userprofile"
    )
    username: models.CharField = models.CharField(
        max_length=USERNAME_MAX_LEN, null=True
    )
    avatar: models.CharField = models.CharField(max_length=AVATAR_MAX_LEN, null=True)
    bio: models.TextField = models.TextField(max_length=BIO_MAX_LEN, null=True)
    reputation: models.IntegerField = models.IntegerField(default=0, null=True)
    created: models.DateField = models.DateField(auto_now_add=True)
    edits: models.ManyToManyField = models.ManyToManyField(Post, related_name="edits")

    # Private
    saved_posts: models.ManyToManyField = models.ManyToManyField(
        Post, related_name="saved_posts"
    )


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:  # Only create a profile for newly created users
        UserProfile.objects.create(user=instance, username=instance.username)


class Vote(models.Model):
    type: models.CharField = models.CharField(
        max_length=10, choices=VOTE_TYPES, default=UPVOTE
    )
    ownerUserId: models.IntegerField = models.IntegerField(null=True)
    parentId: models.IntegerField = models.IntegerField(null=True)
    created: models.DateTimeField = models.DateTimeField(auto_now_add=True)
