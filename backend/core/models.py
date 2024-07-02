from django.contrib.auth.models import User
from django.db import models

TITLE_MAX_LEN = 255
LAST_EDITOR_MAX_LEN = 255
OWNER_MAX_LEN = 255
USERNAME_MAX_LEN = 255
AVATAR_MAX_LEN = 255
BIO_MAX_LEN = 255
ARGUMENT = "argument"
REBUTTAL = "rebuttal"
COMMENT = "comment"
POSTS_TYPES = [
    (ARGUMENT, "argument"),
    (REBUTTAL, "rebuttal"),
    (COMMENT, "comment"),
]
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
    createdAt: models.DateTimeField = models.DateTimeField(auto_now_add=True)


class Posts(models.Model):
    """Posts database model"""

    type: models.CharField = models.CharField(
        max_length=10, choices=POSTS_TYPES, default=ARGUMENT
    )
    body: models.TextField = models.TextField()  # render as HTML
    title: models.CharField = models.CharField(max_length=TITLE_MAX_LEN)
    ownerUserId: models.IntegerField = models.IntegerField(null=True)
    parentId: models.IntegerField = models.IntegerField(null=True)
    upvotes: models.ManyToManyField = models.ManyToManyField(
        Vote, related_name="post_upvotes"
    )
    downvotes: models.ManyToManyField = models.ManyToManyField(
        Vote, related_name="post_downvotes"
    )
    createdAt: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updatedAt: models.DateTimeField = models.DateTimeField(auto_now=True)


class UserProfile(models.Model):
    # Public
    user: models.OneToOneField = models.OneToOneField(
        User, on_delete=models.CASCADE, null=True
    )
    username: models.CharField = models.CharField(
        max_length=USERNAME_MAX_LEN, null=True
    )
    avatar: models.CharField = models.CharField(max_length=AVATAR_MAX_LEN, null=True)
    bio: models.TextField = models.TextField(max_length=BIO_MAX_LEN, null=True)
    reputation: models.IntegerField = models.IntegerField(default=0, null=True)
    joinDate: models.DateField = models.DateField()
    posts: models.ManyToManyField = models.ManyToManyField(Posts, related_name="posts")
    edits: models.ManyToManyField = models.ManyToManyField(Posts, related_name="edits")

    # Private
    savedPosts: models.ManyToManyField = models.ManyToManyField(
        Posts, related_name="saved_posts"
    )
    private_post: models.ManyToManyField = models.ManyToManyField(
        Posts, related_name="private_post"
    )
    upvotes: models.ManyToManyField = models.ManyToManyField(
        Vote, related_name="user_profile_upvotes"
    )
    downvotes: models.ManyToManyField = models.ManyToManyField(
        Vote, related_name="user_profile_downvotes"
    )
