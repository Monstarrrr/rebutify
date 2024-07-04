from django.http import HttpResponse
from djoser.views import UserViewSet
from rest_framework import viewsets
from rest_framework.permissions import (
    SAFE_METHODS,
    AllowAny,
    BasePermission,
    IsAuthenticated,
)
from rest_framework.response import Response

from .models import Posts, UserProfile, Vote
from .serializers import (
    ArgumentSerializer,
    CommentSerializer,
    PostSerializer,
    RebuttalSerializer,
    UserProfileSerializer,
    VoteSerializer,
)


class IsOwnerOrReadOnly(BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in SAFE_METHODS:
            return True
        # Instance must have an attribute named `ownerUserId`.
        return obj.ownerUserId == request.user


def success(request):
    return HttpResponse("", status=200)


class ArgumentViewSet(viewsets.ModelViewSet):
    serializer_class = ArgumentSerializer

    def get_queryset(self):
        ownerUserId = self.kwargs.get("ownerUserId")
        # gets all arguments from a user
        if ownerUserId:
            queryset = Posts.objects.filter(type="argument", ownerUserId=ownerUserId)
        # gets all arguments
        else:
            queryset = Posts.objects.filter(type="argument")
        return queryset

    def perform_create(self, serializer):
        serializer.save(ownerUserId=self.request.user.id)

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]
        if self.action in ["update", "delete", "partial_update"]:
            return [IsOwnerOrReadOnly()]
        return [AllowAny()]


class RebuttalViewSet(viewsets.ModelViewSet):
    serializer_class = RebuttalSerializer

    def get_queryset(self):
        parentId = self.kwargs.get("parentId")
        ownerUserId = self.kwargs.get("ownerUserId")
        # gets all rebuttals from a post specific to a user
        if parentId and ownerUserId:
            queryset = Posts.objects.filter(
                type="rebuttal", parentId=parentId, ownerUserId=ownerUserId
            )
        # gets all rebuttals from a post
        elif parentId and not ownerUserId:
            queryset = Posts.objects.filter(type="rebuttal", parentId=parentId)
        # gets all rebuttals from a user
        elif not parentId and ownerUserId:
            queryset = Posts.objects.filter(type="rebuttal", ownerUserId=ownerUserId)
        return queryset

    def perform_create(self, serializer):
        serializer.save(ownerUserId=self.request.user.id)

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]
        if self.action in ["update", "delete", "partial_update"]:
            return [IsOwnerOrReadOnly()]
        return [AllowAny()]


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer

    def get_queryset(self):
        parentId = self.kwargs.get("parentId")
        ownerUserId = self.kwargs.get("ownerUserId")
        # gets all comments from a post specific to a user
        if parentId and ownerUserId:
            queryset = Posts.objects.filter(
                type="comment", parentId=parentId, ownerUserId=ownerUserId
            )
        # gets all comments from a post
        elif parentId and not ownerUserId:
            queryset = Posts.objects.filter(type="comment", parentId=parentId)
        # gets all comments from a user
        elif not parentId and ownerUserId:
            queryset = Posts.objects.filter(type="comment", ownerUserId=ownerUserId)
        return queryset

    def perform_create(self, serializer):
        serializer.save(ownerUserId=self.request.user.id)

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]
        if self.action in ["update", "delete", "partial_update"]:
            return [IsOwnerOrReadOnly()]
        return [AllowAny()]


class PostViewSet(viewsets.ModelViewSet):
    queryset = Posts.objects.all()
    serializer_class = PostSerializer

    def perform_create(self, serializer):
        serializer.save(ownerUserId=self.request.user.id)

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]
        if self.action in ["update", "delete", "partial_update"]:
            return [IsOwnerOrReadOnly()]
        return [AllowAny()]


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class UpvoteViewSet(viewsets.ModelViewSet):
    serializer_class = VoteSerializer

    def get_queryset(self):
        parentId = self.kwargs.get("parentId")
        ownerUserId = self.kwargs.get("ownerUserId")
        # gets all upvotes from a post specific to a user
        if parentId and ownerUserId:
            queryset = Vote.objects.filter(
                type="upvote", parentId=parentId, ownerUserId=ownerUserId
            )
        # gets all upvotes from a post
        elif parentId and not ownerUserId:
            queryset = Vote.objects.filter(type="upvote", parentId=parentId)
        # gets all upvotes from a user
        elif not parentId and ownerUserId:
            queryset = Vote.objects.filter(type="upvote", ownerUserId=ownerUserId)
        return queryset


class DownvoteViewSet(viewsets.ModelViewSet):
    serializer_class = VoteSerializer

    def get_queryset(self):
        parentId = self.kwargs.get("parentId")
        ownerUserId = self.kwargs.get("ownerUserId")
        # gets all downvotes from a post specific to a user
        if parentId and ownerUserId:
            queryset = Vote.objects.filter(
                type="downvote", parentId=parentId, ownerUserId=ownerUserId
            )
        # gets all downvotes from a post
        elif parentId and not ownerUserId:
            queryset = Vote.objects.filter(type="downvote", parentId=parentId)
        # gets all downvotes from a user
        elif not parentId and ownerUserId:
            queryset = Vote.objects.filter(type="downvote", ownerUserId=ownerUserId)
        return queryset


class StatusViewSet(viewsets.ViewSet):
    def list(self, request):
        return Response(status=200)


# Activates user. https://protocolostomy.com/2021/05/06/user-activation-with-django-and-djoser/
class ActivateUser(UserViewSet):
    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs.setdefault("context", self.get_serializer_context())

        # this line is the only change from the base implementation.
        kwargs["data"] = {"uid": self.kwargs["uid"], "token": self.kwargs["token"]}

        return serializer_class(*args, **kwargs)

    def activation(self, request, uid, token, *args, **kwargs):
        super().activation(request, *args, **kwargs)
        return HttpResponse("Your account has been activated.")
