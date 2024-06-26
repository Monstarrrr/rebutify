from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from djoser.views import UserViewSet
from rest_framework import viewsets
from rest_framework.permissions import (
    SAFE_METHODS,
    AllowAny,
    BasePermission,
    IsAdminUser,
    IsAuthenticated,
)
from rest_framework.response import Response

from .forms import UserRegisterForm
from .models import Posts, Tags, UserProfile
from .serializers import (
    ArgumentSerializer,
    PostSerializer,
    TagSerializer,
    UserProfileSerializer,
)
from .token import account_activation_token


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
        # Instance must have an attribute named `owner`.
        return obj.owner == request.user


def success(request):
    return HttpResponse("", status=200)


class ArgumentViewSet(viewsets.ModelViewSet):
    queryset = Posts.objects.filter(type="argument")
    serializer_class = ArgumentSerializer

    def perform_create(self, serializer):
        serializer.save(ownerUserId=self.request.user.id)

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]
        if self.action == "update" or self.action == "delete":
            return [
                IsOwnerOrReadOnly() | IsAdminUser(),
            ]
        return [AllowAny()]


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tags.objects.all()
    serializer_class = TagSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Posts.objects.all()
    serializer_class = PostSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]
        if self.action in ["update", "delete", "partial_update"]:
            return [IsOwnerOrReadOnly() | IsAdminUser()]
        return [AllowAny()]


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class StatusViewSet(viewsets.ViewSet):
    def list(self, request):
        return Response(status=200)


class RegisterViewSet(viewsets.ViewSet):
    def create(self, request):
        form = UserRegisterForm(request.data)

        if not form.is_valid():
            return Response({"errors": form.errors}, status=400)

        user = form.save(commit=False)
        user.is_active = False
        user.save()

        username = form.cleaned_data.get("username")
        current_site = get_current_site(request)
        mail_subject = f"Activation link for {username}"
        message = render_to_string(
            "user/acc_active_email.html",
            {
                "user": user,
                "domain": current_site.domain,
                "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                "token": account_activation_token.make_token(user),
            },
        )
        to_email = form.cleaned_data.get("email")
        email = EmailMessage(
            mail_subject,
            message,
            settings.EMAIL_FROM,
            [to_email],
        )
        email.send()

        return Response(
            {
                "detail": "Please confirm your email address to complete the registration."
            },
            status=200,
        )


class UserLoginViewSet(viewsets.ViewSet):
    def create(self, request):
        form = AuthenticationForm(request, data=request.data)

        if not form.is_valid():
            return Response({"errors": form.errors}, status=400)

        username = form.cleaned_data.get("username")
        password = form.cleaned_data.get("password")
        user = authenticate(request, username=username, password=password)

        if user is None:
            messages.info(request, "Account does not exist. Please log in.")
            return Response(
                {"detail": "Invalid username or password."},
                status=401,
            )

        login(request, user)
        messages.success(request, f"Welcome {username}")
        return Response({"detail": "Login successful."}, status=200)


class LogoutViewSet(viewsets.ViewSet):
    def create(self, request):
        return Response({"detail": "Logged out successfully."}, status=200)


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
