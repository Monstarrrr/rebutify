# Generated by Django 5.0.7 on 2024-08-17 20:11

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0012_report_alter_post_type"),
    ]

    operations = [
        migrations.AddField(
            model_name="report",
            name="options",
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name="report",
            name="body",
            field=models.CharField(max_length=255, null=True),
        ),
    ]
