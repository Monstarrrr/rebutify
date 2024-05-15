from django.urls import path
from rest_framework.response import Response

from .views import activate

urlpatterns = [
    path("", lambda request: Response(status=200), name="index"),
    path("activate/<uidb64>/<token>/", activate, name="activate"),
]
