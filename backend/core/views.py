import logging

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db import transaction
from django.http import HttpResponse
from django.utils import timezone
from djoser.views import UserViewSet
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import status, viewsets
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

from .models import Post, Report, UserProfile, Vote
from .serializers import (
    ArgumentSerializer,
    CommentSerializer,
    PostSerializer,
    RebuttalSerializer,
    ReportSerializer,
    SuggestionSerializer,
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


# return formatted body for the response
def response_body(code, message, resources={}):
    body = {}
    if code and message:
        body["code"] = code
        body["message"] = message
        if resources:
            body["resources"] = resources
    else:
        body["code"] = status.HTTP_500_INTERNAL_SERVER_ERROR
        body["message"] = "Response code and message are not both defined."
    return body


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

    # get all arguments
    queryset = Post.objects.filter(type="argument")

    def get_queryset(self):
        self.pagination_class.page_size = int(
            self.kwargs.get("page_size", DEFAULT_PAGE_SIZE)
        )
        return self.queryset

    def perform_create(self, serializer):
        serializer.save(ownerUserId=self.request.user.id)

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]
        if self.action in ["update", "delete", "partial_update"]:
            return [IsOwnerOrReadOnly()]
        return [AllowAny()]

    # get followers of the argument
    @action(detail=True, methods=["get"])
    def followers(self, *args, **kwargs):
        followers = {}
        id = self.kwargs.get("pk")
        # check if argument exists
        if self.queryset.filter(id=id).exists():
            code = status.HTTP_200_OK
            message = "Followers for this argument."
            followers = self.get_serializer(self.queryset.get(id=id)).data["followers"]
        else:
            code = status.HTTP_404_NOT_FOUND
            message = "This argument does not exist."
        resources = {"followers": followers} if followers else {}
        body = response_body(code, message, resources)
        return Response(data=body, content_type="application/json")

    # the current user follows the argument
    @action(detail=True, methods=["post"])
    def follow(self, *args, **kwargs):
        id = self.kwargs.get("pk")
        user = self.request.user
        # check if argument exists
        if self.queryset.filter(id=id).exists():
            # check if user is authenticated
            if user.is_authenticated:
                followers = self.queryset.get(id=id).followers
                # check if user follows the argument
                if followers.filter(id=user.id).exists():
                    code = status.HTTP_200_OK
                    message = "You already follow this argument."
                else:
                    followers = followers.add(user.id)
                    code = status.HTTP_200_OK
                    message = "Follow argument successful."
            else:
                code = status.HTTP_401_UNAUTHORIZED
                message = "You are not logged in."
        else:
            code = status.HTTP_404_NOT_FOUND
            message = "This argument does not exist."
        body = response_body(code, message)
        return Response(data=body, status=code, content_type="application/json")

    # the current user undos the argument follow
    @action(detail=True, url_path="follow/undo", methods=["post"])
    def undo_follow(self, *args, **kwargs):
        id = self.kwargs.get("pk")
        user = self.request.user
        # check if argument exists
        if self.queryset.filter(id=id).exists():
            # check if user is authenticated
            if user.is_authenticated:
                followers = self.queryset.get(id=id).followers
                # check if user follows the argument
                if followers.filter(id=user.id).exists():
                    followers = followers.remove(user.id)
                    code = status.HTTP_200_OK
                    message = "Undo follow argument successful."
                else:
                    code = status.HTTP_200_OK
                    message = "You do not follow this argument."
            else:
                code = status.HTTP_401_UNAUTHORIZED
                message = "You are not logged in."
        else:
            code = status.HTTP_404_NOT_FOUND
            message = "This argument does not exist."
        body = response_body(code, message)
        return Response(data=body, status=code, content_type="application/json")

    # get reports of the argument
    @action(detail=True, methods=["get"], serializer_class=ReportSerializer)
    def reports(self, *args, **kwargs):
        reports = {}
        id = self.kwargs["pk"]
        # check if argument exists
        if self.queryset.filter(id=id).exists():
            # check if user is an admin
            if self.request.user.is_superuser:
                code = status.HTTP_200_OK
                message = "Reports for this argument."
                reports = self.get_serializer(
                    Report.objects.filter(parentId=id), many="true"
                ).data
            else:
                code = status.HTTP_401_UNAUTHORIZED
                message = "You are not an admin."
        else:
            code = status.HTTP_404_NOT_FOUND
            message = "This argument does not exist."
        resources = {"reports": reports} if reports else {}
        body = response_body(code, message, resources)
        headers = self.get_success_headers(reports)
        return Response(
            data=body, status=code, headers=headers, content_type="application/json"
        )

    @action(
        detail=True,
        url_path="reports/add",
        methods=["post"],
        serializer_class=ReportSerializer,
    )
    def add_reports(self, *args, **kwargs):
        # check if argument exists
        if self.queryset.filter(id=self.kwargs["pk"]).exists():
            # check if user is authenticated
            if self.request.user.is_authenticated:
                # get report data
                data = self.request.data
                # check if report data is given
                if not data:
                    code = status.HTTP_200_OK
                    message = "No report data provided."
                # check if report data has an id that already exists
                elif "id" in data and Report.objects.filter(id=data["id"]).exists():
                    code = status.HTTP_200_OK
                    message = "Report already exists."
                else:
                    report = {}
                    report_fields = [field.name for field in Report._meta.get_fields()]
                    for key in data:
                        # check if report data has an invalid key
                        if key not in report_fields:
                            report = {}
                            code = status.HTTP_400_BAD_REQUEST
                            message = "Invalid report data."
                            break
                        report[key] = data[key]
                    # check if report was created
                    if report:
                        report = Report.objects.create(**report)
                        code = status.HTTP_200_OK
                        message = "Report created."
            else:
                code = status.HTTP_401_UNAUTHORIZED
                message = "You are not logged in."
        else:
            code = status.HTTP_404_NOT_FOUND
            message = "This argument does not exist."
        body = response_body(code, message)
        return Response(data=body, status=code, content_type="application/json")

    @action(
        detail=True,
        url_path="reports/options",
        methods=["get"],
        serializer_class=ReportSerializer,
    )
    def reports_options(self, *args, **kwargs):
        options = []
        id = self.kwargs["pk"]
        # check if argument exists
        if self.queryset.filter(id=id).exists():
            # check if reports for the argument exist
            if Report.objects.filter(parentId=id).exists():
                reports = Report.objects.filter(parentId=id)
                for report in reports:
                    report = self.get_serializer(report).data
                    # check if options is a list
                    if isinstance(report["options"], list):
                        options = sorted(set(options) | set(report["options"]))
                code = status.HTTP_200_OK
                message = "Report options for this argument."
            else:
                code = status.HTTP_404_NOT_FOUND
                message = "No reports exist for this argument."
        else:
            code = status.HTTP_404_NOT_FOUND
            message = "This argument does not exist."
        resources = {"options": options} if options else {}
        body = response_body(code, message, resources)
        headers = self.get_success_headers(options)
        return Response(
            data=body, status=code, headers=headers, content_type="application/json"
        )

    @action(
        detail=True,
        url_path="suggest-edit",
        methods=["post"],
        serializer_class=SuggestionSerializer,
    )
    def suggest_edit(self, *args, **kwargs):
        # check if argument exists
        if self.queryset.filter(id=self.kwargs["pk"]).exists():
            # check if user is authenticated
            if self.request.user.is_authenticated:
                # get suggestion data
                data = self.request.data
                # check if suggestion data is given
                if not data:
                    code = status.HTTP_200_OK
                    message = "No suggestion data provided."
                # check if suggestion data has an id that already exists
                elif (
                    "id" in data
                    and Post.objects.filter(type="suggestion", id=data["id"]).exists()
                ):
                    code = status.HTTP_200_OK
                    message = "Suggestion already exists."
                else:
                    suggestion = {}
                    post_fields = [field.name for field in Post._meta.get_fields()]
                    for key in data:
                        # check if suggestion data has an invalid key
                        if key not in post_fields:
                            suggestion = {}
                            code = status.HTTP_400_BAD_REQUEST
                            message = "Invalid suggestion data."
                            break
                        suggestion[key] = data[key]
                    # check if suggestion was created
                    if suggestion:
                        suggestion["type"] = "suggestion"
                        suggestion = Post.objects.create(**suggestion)
                        code = status.HTTP_200_OK
                        message = "Suggestion created."
            else:
                code = status.HTTP_401_UNAUTHORIZED
                message = "You are not logged in."
        else:
            code = status.HTTP_404_NOT_FOUND
            message = "This argument does not exist."
        body = response_body(code, message)
        return Response(data=body, status=code, content_type="application/json")


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


User = get_user_model()


class EditEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Handle email editing for the authenticated user

        Request body should contain the new email
        """
        try:
            # Extract email from request
            email = request.data["email"]

            # Validate email format
            try:
                validate_email(email)
            except ValidationError:
                return Response(
                    {
                        "code": 400,
                        "message": "Invalid email format",
                        "errors": ["Please provide a valid email address"],
                    },
                    status=400,
                )

            # Check if email is already in use
            if User.objects.filter(email=email).exclude(id=request.user.id).exists():
                return Response(
                    {
                        "code": 400,
                        "message": "Email already in use",
                        "errors": [
                            "This email is already associated with another account"
                        ],
                    },
                    status=400,
                )

            # Update user's email
            user = request.user
            user.email = email
            user.save()

            return Response(
                {"code": 200, "message": "Email updated successfully"}, status=200
            )

        except Exception as e:
            # Log the error
            logger.error(f"Email update error: {str(e)}")
            return Response(
                {
                    "code": 500,
                    "message": "Internal server error",
                    "errors": ["Unable to update email"],
                },
                status=500,
            )
