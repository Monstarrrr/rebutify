# Generated by Django 5.0.4 on 2024-07-02 20:18

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0006_posts_parentid"),
    ]

    operations = [
        migrations.CreateModel(
            name="Vote",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "type",
                    models.CharField(
                        choices=[("upvote", "upvote"), ("downvote", "downvote")],
                        default="upvote",
                        max_length=10,
                    ),
                ),
                ("ownerUserId", models.IntegerField(null=True)),
                ("parentId", models.IntegerField(null=True)),
                ("createdAt", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.RemoveField(
            model_name="userprofile",
            name="downVotes",
        ),
        migrations.RemoveField(
            model_name="userprofile",
            name="upVotes",
        ),
        migrations.AddField(
            model_name="posts",
            name="downvotes",
            field=models.ManyToManyField(related_name="post_downvotes", to="core.vote"),
        ),
        migrations.AddField(
            model_name="posts",
            name="upvotes",
            field=models.ManyToManyField(related_name="post_upvotes", to="core.vote"),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="downvotes",
            field=models.ManyToManyField(
                related_name="user_profile_downvotes", to="core.vote"
            ),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="upvotes",
            field=models.ManyToManyField(
                related_name="user_profile_upvotes", to="core.vote"
            ),
        ),
    ]
