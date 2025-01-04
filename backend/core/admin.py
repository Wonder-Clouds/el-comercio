from django.contrib import admin
from django.apps import apps
from .models import TimeStampedModel

class TimeStampedModelAdmin(admin.ModelAdmin):
    """Clase to manage the TimeStampedModel in the Django Admin"""
    list_display = ('__str__', 'create_at', 'update_at', 'delete_at', 'is_deleted')
    search_fields = ('__str__',)
    actions = ['restore_objects', 'delete_objects']
    
    def restore_objects(self, request, queryset):
        """Action to restore the objects"""
        count = queryset.update(delete_at=None)
        self.message_user(request, f"{count} object(s) restored.")
    
    restore_objects.short_description = "Restore objects"

    def delete_objects(self, request, queryset):
        """Action to soft delete the objects"""
        count = 0
        for obj in queryset:
            if not obj.is_deleted:
                obj.soft_delete()
                count += 1
        self.message_user(request, f"{count} object(s) deleted softly.")
    
    delete_objects.short_description = "Delete objects softly"

def register_all_admins():
    """Registers all the models that inherit from TimeStampedModel in the Django Admin"""
    app_models = apps.get_models() 

    for model in app_models:
        if issubclass(model, TimeStampedModel): 
            admin.site.register(model, TimeStampedModelAdmin)

register_all_admins()
