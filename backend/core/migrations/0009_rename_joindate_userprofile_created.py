# Generated by Django 5.0.4 on 2024-07-04 22:23

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0008_rename_createdat_posts_created_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="userprofile",
            old_name="joinDate",
            new_name="created",
        ),
    ]