from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core"

    def ready(self):
        from core.signals import post_signals
        from core.typesense.client import create_posts_collections

        print(
            f'{"✅ Signals loaded" if post_signals else "❌ Signals not loaded, the app will not work properly."}'
        )
        print("🚀 [1/2] Django server is ready!")
        print("----")
        create_posts_collections()
