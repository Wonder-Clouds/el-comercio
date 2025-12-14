from django.apps import AppConfig


class AssignmentConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'assignment'

    def ready(self):
        """
        Register signals when the app is ready.
        """
        import assignment.signals
