from django.conf import settings
from django.urls import path

from .views import ActivateUserViewSet, success

urlpatterns = [path("", success, name="index")]

if settings.DEBUG:
    urlpatterns.append(
        path(
            "activate/<uid>/<token>",
            ActivateUserViewSet.as_view({"get": "activation"}),
            name="activation",
        )
    )
