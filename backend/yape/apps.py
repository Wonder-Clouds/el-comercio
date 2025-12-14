from django.apps import AppConfig


class YapeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'yape'

    def ready(self):
        """Register signals when the app is ready."""
        import yape.signals
