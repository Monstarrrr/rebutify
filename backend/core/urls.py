from django.conf import settings
from django.urls import path

from .views import ActivateUser, success

urlpatterns = [path("", success, name="index")]

if settings.DEBUG:
    urlpatterns.append(
        path(
            "activate/<uid>/<token>",
            ActivateUser.as_view({"get": "activation"}),
            name="activation",
        )
    )
