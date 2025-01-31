from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core"

    def ready(self):
        from core.typesense.client import create_posts_collections

        print("🚀 Core app is ready!")
        create_posts_collections()
