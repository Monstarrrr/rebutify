from django.contrib.auth.tokens import default_token_generator
from djoser import utils
from djoser.conf import settings as djoser_settings
from rebutify import settings
from templated_mail.mail import BaseEmailMessage


class SendConfirmNewEmail(BaseEmailMessage):
    template_name = "send_confirm_new_email.html"

    def get_context_data(self):
        context = super().get_context_data()
        user = context.get("user")
        new_email = context.get("new_email")
        context["uid"] = utils.encode_uid(user.pk)
        context["token"] = default_token_generator.make_token(user)
        context["new_email"] = new_email
        context["debug"] = settings.DEBUG
        context["url"] = djoser_settings.ACTIVATION_NEW_EMAIL_URL.format(**context)

        return context


class SendNewEmailActivated(BaseEmailMessage):
    template_name = "send_new_email_activated.html"


class SendEmailNewPostCreated(BaseEmailMessage):
    template_name = "new_post_created.html"

    def get_subject(self):
        # Override the subject method to provide a clean subject line
        return f"New post by {self.context['user']} on {settings.SITE_NAME}"

    def get_context_data(self):
        try:
            context = super().get_context_data()

            post = context.get("post")
            author = context.get("postAuthor")

            context["postAuthor"] = author
            context["postTitle"] = post.title
            context["postId"] = post.id
            context["postType"] = post.type
            context["postBody"] = post.body
            context["baseUrl"] = f"{settings.SITE_URL}/"
            context["debug"] = settings.DEBUG

            print("topParentId :", post.topParentId)
            if post.type == "argument":
                context["postUrl"] = f"argument/{post.id}/"
            elif post.type == "rebuttal":
                context["postUrl"] = f"argument/{post.parentId}/"
            elif post.type == "comment":
                print('Post type is "comment"')
                context["postUrl"] = f"argument/{post.topParentId}/"
            else:
                raise Exception(
                    f"❌ Couldn't send email. Invalid post type: {post.type}"
                )

        except Exception as e:
            print(f"❌ Couldn't send email. Error: {e}")

        return context

    def send(self, to, *args, **kwargs):
        print(f"Attempting to send email to: {to}")
        try:
            result = super().send(to, *args, **kwargs)
            print("Email sent successfully")  # Debug print
            return result
        except Exception as e:
            print(f"Failed to send email: {str(e)}")  # Debug print
            raise
