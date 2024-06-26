from rest_framework import serializers

from .models import Posts, UserProfile


class ArgumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = ["id", "body", "title", "ownerUserId", "createdAt", "updatedAt"]
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


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"
