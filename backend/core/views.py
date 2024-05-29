from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage, send_mail
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import viewsets
from rest_framework.response import Response

from .forms import UserRegisterForm
from .models import Posts, Tags, UserProfile
from .serializers import PostSerializer, TagSerializer, UserProfileSerializer
from .token import account_activation_token


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tags.objects.all()
    serializer_class = TagSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Posts.objects.all()
    serializer_class = PostSerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class StatusViewSet(viewsets.ViewSet):
    def list(self, request):
        return Response(status=200)


def index(request):
    return render(request, "user/index.html", {"title": "index"})


def register(request):
    if request.method == "POST":
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False
            user.save()
            username = form.cleaned_data.get("username")
            ######################### mail ####################################
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
                send_mail(
                    mail_subject,
                    message,
                    settings.EMAIL_FROM,
                    [
                        to_email,
                    ],
                )
            )
            email.send()
            ##################################################################
            return HttpResponse(
                "Please confirm your email address to complete the registration."
            )
    else:
        form = UserRegisterForm()
    return render(
        request, "user/register.html", {"form": form, "title": "register here"}
    )


def Login(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            form = login(request, user)
            messages.success(request, f"Welcome {username}")
            return redirect("index")
        else:
            messages.info(request, "Account done not exist. Please log in.")
    form = AuthenticationForm()
    return render(request, "user/login.html", {"form": form, "title": "log in"})


@login_required
def Logout(request):
    logout(request)
    return render(request, "user/logout.html", {})


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
