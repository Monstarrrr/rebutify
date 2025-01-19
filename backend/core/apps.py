from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core"

    def ready(self):
        from core.typesense.client import create_posts_collections

        print("🚀 Core app is ready!")
        create_posts_collections()
        # # When server starts
        # signals.post_migrate.connect(self.sync_all_posts_with_typesense, sender=self)
        # # When creating or updating a post
        # signals.post_save.connect(self.sync_individual_post, sender=Post)
