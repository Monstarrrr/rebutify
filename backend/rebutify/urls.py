"""
URL configuration for rebutify project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

import os

from core import views
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r"status/alive", views.StatusViewSet, basename="alive")
router.register(r"posts", views.PostViewSet, basename="posts")
router.register(r"arguments", views.ArgumentViewSet, basename="arguments")
router.register(
    r"comments/(?P<parentId>\d+)", views.CommentViewSet, basename="comments"
)
router.register(r"user-profile", views.UserProfileViewSet, basename="user-profile")

urlpatterns = [
    path(os.getenv("DJANGO_ADMIN_PATH", "admin/"), admin.site.urls),
    path("api/", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("", include("core.urls")),
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.jwt")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/schema/redoc-ui/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc-ui",
    ),
]
