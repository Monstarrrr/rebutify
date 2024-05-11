from django.contrib.auth.models import User
from django.db import models

TAG_NAME_MAX_LEN = 50
TITLE_MAX_LEN = 255
LAST_EDITOR_MAX_LEN = 255
OWNER_MAX_LEN = 255


class Tags(models.Model):
    tagName: models.CharField = models.CharField(max_length=TAG_NAME_MAX_LEN)
    count: models.IntegerField = models.IntegerField()
    excerptPostId: models.IntegerField = models.IntegerField(null=True)
    wikiPostId: models.IntegerField = models.IntegerField(null=True)
    isModeratorOnly: models.BooleanField = models.BooleanField()
    isRequired: models.BooleanField = models.BooleanField()


class Posts(models.Model):
    postTypeId: models.IntegerField = models.IntegerField()
    acceptedAnswerId: models.IntegerField = models.IntegerField(null=True)
    parentId: models.IntegerField = models.IntegerField(null=True)
    creationDate: models.DateField = models.DateField()
    deletionDate: models.DateField = models.DateField(null=True)
    score: models.IntegerField = models.IntegerField()
    viewcount: models.IntegerField = models.IntegerField(null=True)
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
    tags: models.ManyToManyField = models.ManyToManyField(Tags, related_name="posts")
    answerCount: models.IntegerField = models.IntegerField(null=True)
    commentCount: models.IntegerField = models.IntegerField(null=True)
    favoriteCount: models.IntegerField = models.IntegerField(null=True)
    closedDate: models.DateField = models.DateField(null=True)
    communityOwnedDate: models.DateField = models.DateField(null=True)
