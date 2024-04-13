from django.http import HttpResponse
from django.urls import path

urlpatterns = [
    path(
        "alivecheck/",
        lambda request: HttpResponse(),
        name="alivecheck",
    ),
]
