from django.contrib import admin, messages

from .models import Post, UserProfile


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
