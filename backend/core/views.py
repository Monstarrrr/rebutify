import logging

from django.conf import settings
from django.db import transaction
from django.http import HttpResponse
from django.utils import timezone
from djoser.views import UserViewSet
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.pagination import CursorPagination
from rest_framework.permissions import (
    SAFE_METHODS,
    AllowAny,
    BasePermission,
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Post, UserProfile, Vote
from .serializers import (
    ArgumentSerializer,
    CommentSerializer,
    PostSerializer,
    RebuttalSerializer,
    UserProfileSerializer,
    VoteResponseSerializer,
    VoteSerializer,
)

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


def log(e: Exception, data):
    log = f"ERROR\n----------\n{e}\n----------\nDATA\n{data}"
    logger.error(log)
    return Response(status=500)


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

    @action(detail=True, methods=["get"])
    def followers(self):
        # put your code here
        print("test")

    @action(detail=True, methods=["post"])
    def follow(self):
        # put your code here
        print("test")

    @action(detail=True, url_path="follow/undo", methods=["post"])
    def undo_follow(self):
        # put your code here
        print("test")


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
        type = self.request.query_params.get("type")
        if type is not None and type not in ["Argument", "Rebuttal", "Comment"]:
            Post.objects.none()

        parentId = self.request.query_params.get("parentId")

        self.pagination_class.page_size = int(
            self.kwargs.get("page_size", DEFAULT_PAGE_SIZE)
        )
        queryset = None
        if type:
            queryset = Post.objects.filter(type=type)
        else:
            queryset = Post.objects.all()

        if parentId:
            queryset = queryset.filter(parentId=parentId)

        return queryset

    def perform_create(self, serializer):
        post: Post = serializer.save(ownerUserId=self.request.user.id)

        # Get or create user profile
        user_profile, created = UserProfile.objects.get_or_create(
            user=self.request.user, defaults={"created": timezone.now().date()}
        )
        # Add the created post to saved posts
        user_profile.saved_posts.add(post)

        if post.parentId:
            parent = Post.objects.get(id=post.parentId)
            if parent:
                user_profile.saved_posts.add(parent)

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


class VoteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_type, post_id, vote_type):
        if vote_type not in ["upvote", "downvote"]:
            return Response({"error": "Invalid vote type"}, status=400)

        try:
            # Verify the post exists
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=404)

        # Check for existing vote
        existing_vote = Vote.objects.filter(
            parentId=post_id, ownerUserId=request.user.id
        ).first()

        with transaction.atomic():
            if existing_vote:
                # If the user is trying to vote the same way, remove the vote
                if existing_vote.type == vote_type:
                    existing_vote.delete()

                    # Decrement the corresponding vote count
                    if vote_type == "upvote":
                        post.upvotes -= 1
                    else:
                        post.downvotes -= 1

                # If voting the opposite way, remove existing vote and add new vote
                else:
                    existing_vote.delete()

                    # Decrement the previous vote count
                    if existing_vote.type == "upvote":
                        post.upvotes -= 1
                    else:
                        post.downvotes -= 1

                    # Create and increment new vote
                    Vote.objects.create(
                        parentId=post.id, ownerUserId=request.user.id, type=vote_type
                    )

                    # Increment the new vote count
                    if vote_type == "upvote":
                        post.upvotes += 1
                    else:
                        post.downvotes += 1

            # No existing vote - create a new vote
            else:
                Vote.objects.create(
                    parentId=post.id, ownerUserId=request.user.id, type=vote_type
                )

                # Increment the corresponding vote count
                if vote_type == "upvote":
                    post.upvotes += 1
                else:
                    post.downvotes += 1

            # Save the updated post
            post.save()

        # Serialize and return response
        serializer = VoteResponseSerializer(
            {"user": request.user, "post": PostSerializer(post).data}
        )
        return Response(serializer.data, status=200)


class EditView(APIView):
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    @extend_schema(
        request={
            "application/json": {
                "type": "object",
                "properties": {"body": {"type": "string"}, "title": {"type": "string"}},
            }
        },
        responses={200: PostSerializer},
    )
    def post(self, request, post_type, post_id):
        try:
            # Validate post type
            if post_type.lower() not in ["argument", "rebuttal", "comment"]:
                return Response({"error": "Invalid post type"}, status=400)

            # Find the post
            try:
                post = Post.objects.get(id=post_id, type=post_type.lower())
            except Post.DoesNotExist:
                return Response({"error": "Post not found"}, status=404)

            if post.ownerUserId != request.user.id:
                return Response(status=401)

            # Only allow editing body and title
            update_data = {
                key: value
                for key, value in request.data.items()
                if key in ["body", "title"]
            }

            # Validate and update the post
            serializer = PostSerializer(post, data=update_data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)

            return Response(serializer.errors, status=400)

        except Exception as e:
            log(e, request)
