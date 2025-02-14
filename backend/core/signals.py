import logging

from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import Post

logger = logging.getLogger(__name__)


@receiver(pre_save, sender=Post)
def handle_pre_save(sender, instance, **kwargs):
    logger.info("Pre-save signal triggered for Post")

    # If this is a new instance (no primary key), skip the comparison
    if not instance.pk:
        logger.info("New Post instance, skipping comparison")
        return

    try:
        # Fetch the previous version of the instance
        previous = Post.objects.get(pk=instance.pk)

        logger.info(f"Previous isPending: {previous.isPending}")
        logger.info(f"Current isPending: {instance.isPending}")

        # Check for the specific state change
        if previous.isPending and not instance.isPending:
            logger.info("isPending changed from True to False")

            # Ensure ownerUserId is not None and has a userprofile
            if instance.ownerUserId:
                try:
                    user_profile = instance.ownerUserId.userprofile
                    user_profile.reputation += 1
                    user_profile.save()
                    logger.info(
                        f"Reputation incremented for user {instance.ownerUserId.username}"
                    )
                except AttributeError as e:
                    logger.error(f"Could not access userprofile: {e}")
            else:
                logger.warning("ownerUserId is None, cannot increment reputation")

    except Post.DoesNotExist:
        # This might happen in rare cases or with certain save methods
        logger.warning("Could not retrieve previous Post instance")
    except Exception as e:
        logger.error(f"Unexpected error in pre_save signal: {e}")
