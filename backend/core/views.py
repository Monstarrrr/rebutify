from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.utils.decorators import method_decorator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import viewsets
from rest_framework.response import Response

from .forms import UserRegisterForm
from .models import Posts, Tags
from .serializers import PostSerializer, TagSerializer
from .token import account_activation_token


class PostViewSet(viewsets.ModelViewSet):
    queryset = Posts.objects.all()
    serializer_class = PostSerializer


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tags.objects.all()
    serializer_class = TagSerializer


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


# Activate account by email
def activate(request, uidb64, token):
    User = get_user_model()
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return HttpResponse(
            "Thank you for your email confirmation. Now you can login your account."
        )
    else:
        return HttpResponse("Activation link is invalid.")
