# Register your models here.

from django.contrib import admin

from .models import Post


@admin.register(Post)
class RequestDemoAdmin(admin.ModelAdmin):
    list_display = ["id", "ownerUserId", "title", "body"]
