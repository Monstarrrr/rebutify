# Generated by Django 5.0.4 on 2024-06-26 03:14

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0005_delete_tags"),
    ]

    operations = [
        migrations.AddField(
            model_name="posts",
            name="parentId",
            field=models.IntegerField(null=True),
        ),
    ]