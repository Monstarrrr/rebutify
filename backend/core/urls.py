from django.urls import path

from .views import activate, index

urlpatterns = [
    path("", index, name="index"),
    path("activate/<uidb64>/<token>/", activate, name="activate"),
]
