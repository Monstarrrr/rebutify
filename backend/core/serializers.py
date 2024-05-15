from rest_framework import serializers

from .models import Posts, Tags


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = "__all__"


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = "__all__"
