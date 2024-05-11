from django.contrib.auth.models import User
from django.db import models

TAG_NAME_MAX_LEN = 50
TITLE_MAX_LEN = 255
LAST_EDITOR_MAX_LEN = 255
OWNER_MAX_LEN = 255


class Tags(models.Model):
    tagName: models.CharField = models.CharField(max_length=TAG_NAME_MAX_LEN)
    count: models.IntegerField = models.IntegerField()
    excerptPostId: models.IntegerField = models.IntegerField()
    wikiPostId: models.IntegerField = models.IntegerField()
    isModeratorOnly: models.BooleanField = models.BooleanField()
    isRequired: models.BooleanField = models.BooleanField()


class Posts(models.Model):
    postTypeId: models.IntegerField = models.IntegerField()
    acceptedAnswerId: models.IntegerField = models.IntegerField()
    parentId: models.IntegerField = models.IntegerField()
    creationDate: models.DateField = models.DateField()
    deletionDate: models.DateField = models.DateField()
    score: models.IntegerField = models.IntegerField()
    viewcount: models.IntegerField = models.IntegerField()
    body: models.TextField = models.TextField()  # render as HTML
    ownerUserId: models.IntegerField = models.IntegerField()
    ownerDisplayName: models.CharField = models.CharField(max_length=OWNER_MAX_LEN)
    lastEditorUserId: models.IntegerField = models.IntegerField()
    lastEditorDisplayName: models.CharField = models.CharField(
        max_length=LAST_EDITOR_MAX_LEN
    )
    lastEditDate: models.DateField = models.DateField()
    lastActivityDate: models.DateField = models.DateField()
    title: models.CharField = models.CharField(max_length=TITLE_MAX_LEN)
    tags: models.ManyToManyField = models.ManyToManyField(Tags, related_name="posts")
    answerCount: models.IntegerField = models.IntegerField()
    commentCount: models.IntegerField = models.IntegerField()
    favoriteCount: models.IntegerField = models.IntegerField()
    closedDate: models.DateField = models.DateField()
    communityOwnedDate: models.DateField = models.DateField()
