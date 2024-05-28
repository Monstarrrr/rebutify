from django.contrib.auth.models import User
from django.db import models

TAG_NAME_MAX_LEN = 50
TITLE_MAX_LEN = 255
LAST_EDITOR_MAX_LEN = 255
OWNER_MAX_LEN = 255
USERNAME_MAX_LEN = 255
AVATAR_MAX_LEN = 255
BIO_MAX_LEN = 255


class Tags(models.Model):
    tagName: models.CharField = models.CharField(max_length=TAG_NAME_MAX_LEN)
    count: models.IntegerField = models.IntegerField(default=0)
    excerptPostId: models.IntegerField = models.IntegerField(null=True)
    wikiPostId: models.IntegerField = models.IntegerField(null=True)
    isModeratorOnly: models.BooleanField = models.BooleanField(default=False)
    isRequired: models.BooleanField = models.BooleanField(default=False)


class Posts(models.Model):
    postTypeId: models.IntegerField = models.IntegerField()
    acceptedAnswerId: models.IntegerField = models.IntegerField(null=True)
    parentId: models.IntegerField = models.IntegerField(null=True)
    creationDate: models.DateField = models.DateField()
    deletionDate: models.DateField = models.DateField(null=True)
    score: models.IntegerField = models.IntegerField(default=0)
    viewcount: models.IntegerField = models.IntegerField(default=0, null=True)
    body: models.TextField = models.TextField()  # render as HTML
    ownerUserId: models.IntegerField = models.IntegerField(null=True)
    ownerDisplayName: models.CharField = models.CharField(
        max_length=OWNER_MAX_LEN, null=True
    )
    lastEditorUserId: models.IntegerField = models.IntegerField(null=True)
    lastEditorDisplayName: models.CharField = models.CharField(
        max_length=LAST_EDITOR_MAX_LEN, null=True
    )
    lastEditDate: models.DateField = models.DateField(null=True)
    lastActivityDate: models.DateField = models.DateField()
    title: models.CharField = models.CharField(max_length=TITLE_MAX_LEN)
    tags: models.ManyToManyField = models.ManyToManyField(Tags, related_name="tags")
    answerCount: models.IntegerField = models.IntegerField(default=0, null=True)
    commentCount: models.IntegerField = models.IntegerField(default=0, null=True)
    favoriteCount: models.IntegerField = models.IntegerField(default=0, null=True)
    closedDate: models.DateField = models.DateField(null=True)
    communityOwnedDate: models.DateField = models.DateField(null=True)


class UserProfile(models.Model):
    # Public
    user = None  # type: ignore
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    username: models.CharField = models.CharField(
        max_length=USERNAME_MAX_LEN, null=True
    )
    avatar: models.CharField = models.CharField(max_length=AVATAR_MAX_LEN, null=True)
    bio: models.TextField = models.TextField(max_length=BIO_MAX_LEN, null=True)
    reputation: models.IntegerField = models.IntegerField(default=0, null=True)
    joinDate: models.DateField = models.DateField()
    posts: models.ManyToManyField = models.ManyToManyField(Posts, related_name="posts")
    edits: models.ManyToManyField = models.ManyToManyField(Posts, related_name="edits")
    upVotes: models.IntegerField = models.IntegerField(default=0, null=True)
    downVotes: models.IntegerField = models.IntegerField(default=0, null=True)

    # Private
    savedPosts: models.ManyToManyField = models.ManyToManyField(
        Posts, related_name="saved_posts"
    )
    privateRebuttals: models.ManyToManyField = models.ManyToManyField(
        Posts, related_name="private_rebuttals"
    )
