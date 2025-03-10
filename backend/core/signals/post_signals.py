from django.conf import settings
from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.dispatch import receiver

from core.models import Post

signature = """
    - The Rebutify Team 🤍
"""


@receiver(post_save, sender=Post)
def notify_post_update(sender, instance, created, **kwargs):
    print("A post was created or updated")

    print("All Followers:", instance.followers.all())
    for follower in instance.followers.all():
        print("Follower:", follower.username)

    # Notify followers on edits of existing posts
    if not created:
        try:
            followers = instance.followers.all()

            for follower in followers:
                send_mail(
                    subject=f"Some {instance.type} you follow was updated.",
                    message=f"""
                        Hello {follower.username}, 
                        Someone just updated the {instance.type} you follow{' "' + instance.title + '"' if instance.type == "argument" else ""}. 
                        Check it out here: https://www.{settings.SITE_URL}/argument/{instance.id}

                        {signature}
                    """,
                    from_email=settings.EMAIL_FROM,
                    recipient_list=[follower.email],
                )
        except Exception as e:
            print(e)

    # Notify followers on new comments
    if created and instance.type == "comment":
        try:
            top_parent = Post.objects.get(id=instance.topParentId)
            followers = top_parent.followers.all()
            for follower in followers:
                send_mail(
                    subject=f"New comment on {top_parent.type} you follow.",
                    message=f"""
                        Hello {follower.username},
                        There is a new comment on one of the {top_parent.type}s you follow. 
                        Check it out here: https://wwww.{settings.SITE_URL}/argument/{top_parent.id}
                        
                        {signature}
                    """,
                    from_email=settings.EMAIL_FROM,
                    recipient_list=[follower.email],
                )
        except Exception as e:
            print(e)

    # Notify followers on new rebuttals of followed arguments
    if created and instance.type == "rebuttal":
        try:
            print("A rebuttal was created")
            # Get the parent argument post
            parent_argument = Post.objects.get(id=instance.parentId)
            print("The parent argument is:", parent_argument.type, parent_argument.id)
            # Verify it's an argument
            if parent_argument.type == "argument":
                # Get all followers of the argument
                followers = parent_argument.followers.all()
                print("The followers are:", followers)
                for follower in followers:
                    if follower.id != instance.ownerUserId:
                        print("Sending email to", follower.email)
                        send_mail(
                            subject=f"New rebuttal on {parent_argument.type} you follow.",
                            message=f"""
                                Hello {follower.username},
                                There is a new rebuttal on one of the {parent_argument.type}s you follow. 
                                Check it out here: https://www.{settings.SITE_URL}/argument/{parent_argument.id}

                                {signature}
                            """,
                            from_email=settings.EMAIL_FROM,
                            recipient_list=[follower.email],
                        )
        except Exception as e:
            print(e)

    # Notify admins on creations & edits of any post
    # admins = User.objects.filter(is_superuser=True).values_list("email", flat=True)
    # recipient_list = list(set(admins))
    # recipient_list.append("monstar.dev@protonmail.com")
    recipient_list = ["monstar.dev@protonmail.com", "contact@rebutify.org"]
    for recipient in recipient_list:
        try:
            if instance.type != "argument":
                message = f"There is a new {instance.type} {'created' if created else 'updated'}. Check it out here: https://www.{settings.SITE_URL}/argument/{instance.parentId}"
            else:
                message = f"There is a new {instance.type} {'created' if created else 'updated'}. Check it out here: https://www.{settings.SITE_URL}/argument/{instance.id}"
            send_mail(
                subject=f"[ADMIN] Some {instance.type} was {'created' if created else 'updated'}.",
                message=message,
                from_email=settings.EMAIL_FROM,
                recipient_list=[recipient],
                fail_silently=True,
            )
        except Exception as e:
            print(e)
