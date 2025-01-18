from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

USERNAME_MAX_LEN = 255
AVATAR_MAX_LEN = 255
BIO_MAX_LEN = 255


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:  # Only create a profile for newly created users
        UserProfile.objects.create(user=instance, username=instance.username)


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
    edits: models.ManyToManyField = models.ManyToManyField(
        "core.Post", related_name="edits"
    )

    # Private
    saved_posts: models.ManyToManyField = models.ManyToManyField(
        "core.Post", related_name="saved_posts"
    )
