# Generated by Django 5.1.3 on 2024-12-22 22:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hr', '0010_rename_is_active_candidate_is_archive_chatlink'),
    ]

    operations = [
        migrations.AlterField(
            model_name='candidate',
            name='is_archive',
            field=models.BooleanField(default=False),
        ),
    ]
