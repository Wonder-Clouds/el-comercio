from django.apps import AppConfig


class TypeProductConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'type_product'

    def ready(self):
        """Register signals when the app is ready."""
        import type_product.signals
