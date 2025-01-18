from django.db import models

REPORT_BODY_MAX_LEN = 255


class Report(models.Model):
    ownerUserId: models.IntegerField = models.IntegerField(null=True)
    parentId: models.IntegerField = models.IntegerField(null=True)
    body: models.TextField = models.TextField(max_length=REPORT_BODY_MAX_LEN, null=True)
    created: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    options: models.JSONField = models.JSONField(null=True)
