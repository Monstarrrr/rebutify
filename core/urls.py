from django.http import HttpResponse
from django.urls import path

from . import views

urlpatterns = [
    path(
        "alivecheck/",
        lambda request: HttpResponse(),
        name="alivecheck",
    ),
    path("", views.browse, name="browse"),
]
