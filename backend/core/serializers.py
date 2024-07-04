from rest_framework import serializers

from .models import Posts, UserProfile, Vote


class ArgumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = ["id", "body", "title", "ownerUserId", "created", "updated"]
        read_only_fields = [
            "ownerUserId",
        ]


class RebuttalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
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
        model = Posts
        fields = ["id", "parentId", "body", "ownerUserId", "created", "updated"]
        read_only_fields = [
            "ownerUserId",
        ]


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
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


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"
