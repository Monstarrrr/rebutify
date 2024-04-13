# Create your views here.
from django.shortcuts import render


def browse(request):
    return render(request, "browse.html")
