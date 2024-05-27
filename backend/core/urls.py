from django.urls import path

from .views import ActivateUser, success

urlpatterns = [
    path("", success, name="index"),
    path(
        "activate/<uid>/<token>",
        ActivateUser.as_view({"get": "activation"}),
        name="activation",
    ),
]
