from django.contrib.auth.models import User
from django.db import models

TAG_NAME_MAX_LEN = 50
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


class Tags(models.Model):
    tagName: models.CharField = models.CharField(max_length=TAG_NAME_MAX_LEN)
    count: models.IntegerField = models.IntegerField(default=0)
    excerptPostId: models.IntegerField = models.IntegerField(null=True)
    wikiPostId: models.IntegerField = models.IntegerField(null=True)
    isModeratorOnly: models.BooleanField = models.BooleanField(default=False)
    isRequired: models.BooleanField = models.BooleanField(default=False)


class Posts(models.Model):
    """Posts database model

    Posts include the following types, marked
    by their postTypeId

    Arguments (1)
    Rebuttals (2)
    Comments (3)
    Tag wikis (4)
    """

    type: models.CharField = models.CharField(
        max_length=10, choices=POSTS_TYPES, default=ARGUMENT
    )
    body: models.TextField = models.TextField()  # render as HTML
    title: models.CharField = models.CharField(max_length=TITLE_MAX_LEN)
    ownerUserId: models.IntegerField = models.IntegerField(null=True)
    # MVP moment:
    # acceptedAnswerId: models.IntegerField = models.IntegerField(null=True)
    # parentId: models.IntegerField = models.IntegerField(null=True)
    # created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    # updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)
    # deleted_at: models.DateTimeField = models.DateTimeField(null=True)
    # score: models.IntegerField = models.IntegerField(default=0)
    # viewcount: models.IntegerField = models.IntegerField(default=0, null=True)
    # ownerDisplayName: models.CharField = models.CharField(
    #     max_length=OWNER_MAX_LEN, null=True
    # )
    # lastEditorUserId: models.IntegerField = models.IntegerField(null=True)
    # lastEditorDisplayName: models.CharField = models.CharField(
    #     max_length=LAST_EDITOR_MAX_LEN, null=True
    # )
    # lastEditDate: models.DateField = models.DateField(null=True)
    # lastActivityDate: models.DateField = models.DateField()
    # tags: models.ManyToManyField = models.ManyToManyField(Tags, related_name="tags")
    # answerCount: models.IntegerField = models.IntegerField(default=0, null=True)
    # commentCount: models.IntegerField = models.IntegerField(default=0, null=True)
    # favoriteCount: models.IntegerField = models.IntegerField(default=0, null=True)
    # closedDate: models.DateField = models.DateField(null=True)
    # communityOwnedDate: models.DateField = models.DateField(null=True)


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
    upVotes: models.IntegerField = models.IntegerField(default=0, null=True)
    downVotes: models.IntegerField = models.IntegerField(default=0, null=True)

    # Private
    savedPosts: models.ManyToManyField = models.ManyToManyField(
        Posts, related_name="saved_posts"
    )
    private_post: models.ManyToManyField = models.ManyToManyField(
        Posts, related_name="private_post"
    )
