from django.urls import path
from rest_framework.response import Response

from .views import activate, success

urlpatterns = [
    path("", success, name="index"),
    path("activate/<uidb64>/<token>/", activate, name="activate"),
]
