# Generated migration to remove date field and add M2M relationship with Assignment

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0003_product_date_alter_product_unique_together'),
        ('assignment', '0001_initial'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='product',
            unique_together={('name', 'type_product')},
        ),
        migrations.RemoveField(
            model_name='product',
            name='date',
        ),
        migrations.AddField(
            model_name='product',
            name='assignments',
            field=models.ManyToManyField(blank=True, related_name='products', to='assignment.assignment'),
        ),
    ]
