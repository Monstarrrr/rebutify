from django.contrib import admin, messages
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from .models import Post, UserProfile


class CustomUserAdmin(UserAdmin):
    # Keep the default fieldsets
    fieldsets = UserAdmin.fieldsets

    # Custom list to display in the user listing
    list_display = (
        "id",
        "email",
        "username",
        "is_active",
        "is_staff",
        "date_joined",
        "last_login",
    )

    # Fields we can filter by in the right sidebar
    list_filter = ("is_active", "is_staff", "is_superuser", "groups", "date_joined")

    # Search fields
    search_fields = ("id", "username", "first_name", "last_name", "email")

    # Optional: Add fields that can be ordered by clicking the column header
    ordering = ("-date_joined",)


# Unregister the default UserAdmin and register our custom one
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    # List of fields to display
    list_display = [
        "id",
        "title",
        "body",
        "ownerUserId",
        "created",
        "updated",
        "isPending",
    ]
    # Fields that can be edited directly in the admin interface
    list_editable = ["title", "body", "isPending"]

    # Method to customize the save process
    def save_model(self, request, obj, form, change):
        """
        Custom save method to handle reputation increment
        Args:
            request: The current HTTP request
            obj: The Post instance being saved
            form: The ModelForm used to save the instance
            change: Boolean indicating if this is an update to an existing instance
        """
        if change:
            try:
                # Fetch the original version of the instance
                original = Post.objects.get(pk=obj.pk)
                # If isPending is being changed from True to False
                if original.isPending and not obj.isPending:
                    try:
                        from django.contrib.auth.models import User

                        user = User.objects.get(id=obj.ownerUserId)

                        # Get the user profile and increment reputation
                        user_profile = user.userprofile
                        user_profile.reputation += 1
                        user_profile.save()
                        messages.add_message(
                            request,
                            messages.SUCCESS,
                            f"✅ Reputation incremented for user {user.username}",
                        )
                    except User.DoesNotExist:
                        # Handle the case where the user does not exist
                        messages.add_message(
                            request,
                            messages.ERROR,
                            "❌ User does not exist.",
                        )
                    except UserProfile.DoesNotExist:
                        # Handle the case where the user profile does not exist
                        messages.add_message(
                            request,
                            messages.ERROR,
                            "❌ User does not have an associated UserProfile.",
                        )
                    except Exception as e:
                        # Handle other exceptions
                        messages.add_message(
                            request,
                            messages.ERROR,
                            f"❌ Error incrementing reputation: {e}",
                        )
            except Post.DoesNotExist:
                # Handle the case where the original instance does not exist
                messages.add_message(
                    request,
                    messages.ERROR,
                    "❌ Original instance does not exist.",
                )
        # Always call the parent save method to ensure normal saving process
        super().save_model(request, obj, form, change)
