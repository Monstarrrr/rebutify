from rest_framework import serializers

from .models import POSTS_TYPES, Posts, Tags, UserProfile


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = "__all__"


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = "__all__"

    def validate_type(self, value):
        if (
            value not in list(zip(*POSTS_TYPES))[0]
        ):  # validate against post types in models.py
            raise serializers.ValidationError("Invalid post type")
        return value


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"
