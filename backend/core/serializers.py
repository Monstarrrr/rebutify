from rest_framework import serializers

from .models import Post, UserProfile, Vote


class ArgumentSerializer(serializers.ModelSerializer):
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


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
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


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"
