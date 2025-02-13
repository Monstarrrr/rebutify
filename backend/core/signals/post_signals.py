from django.conf import settings
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.dispatch import receiver

from core.models import Post


@receiver(post_save, sender=Post)
def notify_post_update(sender, instance, created, **kwargs):
    # Notify followers on edits of existing posts
    if not created:
        followers = instance.followers.all()
        for follower in followers:
            send_mail(
                subject=f"Some {instance.type} you follow was updated.",
                message=f"There is an update on some {instance.type} you follow. Check it out here: {{ https://{settings.SITE_URL}/argument/{instance.id}}}",
                from_email=settings.EMAIL_FROM,
                recipient_list=[follower.email],
            )

    # Notify followers on new comments
    if created and instance.type == "comment":
        top_parent = Post.objects.get(id=instance.topParentId)
        followers = top_parent.followers.all()
        for follower in followers:
            send_mail(
                subject=f"New comment on {top_parent.type} you follow.",
                message=f"There is a new comment on {top_parent.type} you follow. Check it out here: {{ https://{settings.SITE_URL}/argument/{top_parent.id}}}",
                from_email=settings.EMAIL_FROM,
                recipient_list=[follower.email],
            )

    # Notify admins on creations & edits of any post
    admins = User.objects.filter(is_superuser=True).values_list("email", flat=True)
    recipient_list = list(set(admins))
    recipient_list.append("monstar.dev@protonmail.com")

    for recipient in recipient_list:
        send_mail(
            subject=f"[ADMIN] Some {instance.type} was {'created' if created else 'updated'}.",
            message=f"There is a new {instance.type} {'created' if created else 'updated'}. Check it out here: {{ https://{settings.SITE_URL}/argument/{instance.id}}}",
            from_email=settings.EMAIL_FROM,
            recipient_list=[recipient],
            fail_silently=False,
        )
