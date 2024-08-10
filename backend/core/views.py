from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from djoser.views import UserViewSet
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import viewsets
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.pagination import CursorPagination
from rest_framework.permissions import (
    SAFE_METHODS,
    AllowAny,
    BasePermission,
    IsAuthenticated,
)

# from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Post, UserProfile, Vote
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


DEFAULT_PAGE_SIZE = settings.REST_FRAMEWORK["PAGE_SIZE"]


# https://stackoverflow.com/a/47657610/19071246
# cursor pagination gets previous or next page links
# you can get such links using pagination_class.get_previous_link or pagination_class.get_next_link
class CursorPaginationViewSet(CursorPagination):
    page_size = DEFAULT_PAGE_SIZE
    page_size_query_param = "page_size"


class ArgumentViewSet(viewsets.ModelViewSet):
    serializer_class = ArgumentSerializer
    pagination_class = CursorPaginationViewSet

    def get_queryset(self):
        self.pagination_class.page_size = int(
            self.kwargs.get("page_size", DEFAULT_PAGE_SIZE)
        )

        # gets all arguments
        queryset = Post.objects.filter(type="argument")
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
    pagination_class = CursorPaginationViewSet

    def get_queryset(self):
        self.pagination_class.page_size = int(
            self.kwargs.get("page_size", DEFAULT_PAGE_SIZE)
        )

        # gets all rebuttals
        queryset = Post.objects.filter(type="rebuttal")
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
    pagination_class = CursorPaginationViewSet

    def get_queryset(self):
        self.pagination_class.page_size = int(
            self.kwargs.get("page_size", DEFAULT_PAGE_SIZE)
        )

        # gets all comments
        queryset = Post.objects.filter(type="comment")
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
    serializer_class = PostSerializer
    pagination_class = CursorPaginationViewSet

    def get_queryset(self):
        self.pagination_class.page_size = int(
            self.kwargs.get("page_size", DEFAULT_PAGE_SIZE)
        )

        # gets all posts
        queryset = Post.objects.all()
        return queryset

    def perform_create(self, serializer):
        serializer.save(ownerUserId=self.request.user.id)

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]
        if self.action in ["update", "delete", "partial_update"]:
            return [IsOwnerOrReadOnly()]
        return [AllowAny()]


class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    pagination_class = CursorPaginationViewSet

    def get_queryset(self):
        self.pagination_class.page_size = int(
            self.kwargs.get("page_size", DEFAULT_PAGE_SIZE)
        )

        # gets all user profiles
        queryset = UserProfile.objects.all()
        return queryset


class UpvoteViewSet(viewsets.ModelViewSet):
    serializer_class = VoteSerializer

    def get_queryset(self):
        # gets all upvotes
        queryset = Vote.objects.filter(type="upvote")
        return queryset


class DownvoteViewSet(viewsets.ModelViewSet):
    serializer_class = VoteSerializer

    def get_queryset(self):
        # gets all downvotes
        queryset = Vote.objects.filter(type="downvote")
        return queryset


class StatusViewSet(viewsets.ViewSet):
    serializer_class = None

    def list(self, request):
        return Response(status=200)


@extend_schema(
    parameters=[
        OpenApiParameter(name="uid", type=str, location=OpenApiParameter.PATH),
        OpenApiParameter(name="token", type=str, location=OpenApiParameter.PATH),
    ]
)
# Activates user. https://protocolostomy.com/2021/05/06/user-activation-with-django-and-djoser/
class ActivateUserViewSet(UserViewSet):
    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs.setdefault("context", self.get_serializer_context())

        if self.kwargs and "uid" in self.kwargs and "token" in self.kwargs:
            # this line is the only change from the base implementation.
            kwargs["data"] = {"uid": self.kwargs["uid"], "token": self.kwargs["token"]}

        return serializer_class(*args, **kwargs)

    def activation(self, request, *args, **kwargs):
        super().activation(request, *args, **kwargs)
        return HttpResponse("Your account has been activated.")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def upvote_argument(request, id):
    # Verify if there is a post corresponding to the given id
    # If yes, get the corresponding post and caller id
    post = get_object_or_404(Post, pk=id)
    caller_id = request.user.id
    parent_id = post.pk

    # Get the corresponding vote object (create if it doesn't exist)
    # If it is just created, then we don't have to do anything as default
    # is upvote when a vote is created
    vote, created = Vote.objects.get_or_create(
        ownerUserId=caller_id, parentId=parent_id
    )

    # If it is not created, we try to upvote and save
    # If the existing vote is an upvote, an exception will be raised
    if not created:
        vote.upvote()
        vote.save()

    # TODO: Return response
    return HttpResponse({"success": True})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def upvote_argument_undo(request, id):
    # Verify if there is a post corresponding to the given id
    # Get the corresponding post and caller id
    post = get_object_or_404(Post, pk=id)
    caller_id = request.user.id
    parent_id = post.pk

    # Get the vote corresponding to the user and the post
    try:
        vote = Vote.objects.get(ownerUserId=caller_id, parentId=parent_id)
    except Vote.DoesNotExist:
        # If vote doesn't exist, raise an error
        raise Exception(f"A vote between user: {id} & post: {parent_id} does not exist")

    # If the existing vote is a downvote, raise an error as it can't be undoed
    if vote.is_downvoted():
        raise Exception(f"User: {id} downvoted post: {parent_id}. Cannot undo upvote.")

    # If the existing vote is an upvote
    # TODO: Delete the vote and return response
    vote.delete()
    return HttpResponse({"success": True})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def downvote_argument(request, id):
    # Verify if there is a post corresponding to the given id
    # If yes, get the corresponding post and caller id
    post = get_object_or_404(Post, pk=id)
    caller_id = request.user.id
    parent_id = post.pk

    # Get the corresponding vote object (create if it doesn't exist)
    vote, _ = Vote.objects.get_or_create(ownerUserId=caller_id, parentId=parent_id)

    # If it is just created, or if it is not created
    # then we try to downvote and save
    # If the existing vote is an upvote, an exception will be raised
    vote.downvote()
    vote.save()

    # TODO: Return response
    return HttpResponse({"success": True})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def downvote_argument_undo(request, id):
    # Verify if there is a post corresponding to the given id
    # Get the corresponding post and caller id
    post = get_object_or_404(Post, pk=id)
    caller_id = request.user.id
    parent_id = post.pk

    # Get the vote corresponding to the user and the post
    try:
        vote = Vote.objects.get(ownerUserId=caller_id, parentId=parent_id)
    except Vote.DoesNotExist:
        # If vote doesn't exist, raise an error
        raise Exception(f"A vote between user: {id} & post: {parent_id} does not exist")

    # If the existing vote is a downvote, raise an error as it can't be undoed
    if vote.is_upvoted():
        raise Exception(f"User: {id} upvoted post: {parent_id}. Cannot undo downvote.")

    # If the existing vote is a downvote
    # TODO: Delete the vote and return response
    vote.delete()
    return HttpResponse({"success": True})
