from django.apps import AppConfig

from core.typesense.posts.sync import sync_post_with_typesense


class CoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core"

    def ready(self):
        from django.db.models import signals

        from core.models import Post

        # When starting the server
        signals.post_migrate.connect(self.sync_all_posts_with_typesense, sender=self)
        # When creating or updating a post
        signals.post_save.connect(self.sync_individual_post, sender=Post)

    def sync_all_posts_with_typesense(self, sender, **kwargs):
        from core.models import Post

        # Sync all posts
        posts = Post.objects.all()
        for post in posts:
            sync_post_with_typesense(post.id)

    def sync_individual_post(self, sender, instance, created, **kwargs):
        # Sync individual post
        if created or instance.is_updated:
            sync_post_with_typesense(instance.id)
