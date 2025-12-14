from django.apps import AppConfig


class DevolutionConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'devolution'

    def ready(self):
        """Register signals when the app is ready."""
        import devolution.signals
