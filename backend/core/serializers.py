import logging

from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Post, Report, UserProfile, Vote

logger = logging.getLogger(
    __name__
)  # Create a FileHandler to write log messages to 'app.log'
file_handler = logging.FileHandler(
    "app.log"
)  # Create a StreamHandler to display log messages on the console
stream_handler = (
    logging.StreamHandler()
)  # Create a Formatter to define the log message format
formatter = logging.Formatter(
    "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)  # Set the formatter for both handlers
file_handler.setFormatter(formatter)
stream_handler.setFormatter(formatter)  # Add both handlers to the logger
logger.addHandler(file_handler)
logger.addHandler(stream_handler)


class FollowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class ArgumentSerializer(serializers.ModelSerializer):
    followers = FollowerSerializer(read_only=True, many=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "body",
            "title",
            "ownerUserId",
            "created",
            "updated",
            "followers",
        ]
        read_only_fields = [
            "ownerUserId",
        ]


class RebuttalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = [
            "id",
            "parentId",
            "body",
            "ownerUserId",
            "created",
            "updated",
        ]
        read_only_fields = [
            "ownerUserId",
        ]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["id", "parentId", "body", "ownerUserId", "created", "updated"]
        read_only_fields = [
            "ownerUserId",
        ]


class SuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["id", "parentId", "body", "ownerUserId", "created", "updated"]
        read_only_fields = [
            "ownerUserId",
        ]


class PostSerializer(serializers.ModelSerializer):
    ownerUser = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "type",
            "isPrivate",
            "body",
            "title",
            "ownerUserId",
            "parentId",
            "created",
            "updated",
            "upvotes",
            "downvotes",
            "followers",
            "ownerUser",
        ]
        read_only_fields = [
            "ownerUserId",
        ]

    def get_ownerUser(self, obj):
        # Fetch the user profile based on ownerUserId
        try:
            user = User.objects.get(id=obj.ownerUserId)
            user_profile = user.userprofile

            if not user_profile.username:
                user_profile.username = user.username
                user_profile.save()

            return UserProfileSerializer(user.userprofile).data
        except (User.DoesNotExist, UserProfile.DoesNotExist) as e:
            logger.error(f"Error fetching owner user: {e}")
            return None


class UserProfileSerializer(serializers.ModelSerializer):
    followedPosts = PostSerializer(source="saved_posts", many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = ["username", "avatar", "bio", "reputation", "followedPosts"]


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = "__all__"
        read_only_fields = [
            "ownerUserId",
        ]


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = "__all__"
        read_only_fields = [
            "ownerUserId",
        ]


class VoteResponseSerializer(serializers.Serializer):
    code = serializers.IntegerField(default=201)
    message = serializers.CharField(default="Resource created.")
    resources = serializers.SerializerMethodField()

    def get_resources(self, obj):
        return {
            "user": {
                "id": obj["user"].id,
                "username": obj["user"].username,
                "email": obj["user"].email,
            },
            "post": obj["post"],
        }
