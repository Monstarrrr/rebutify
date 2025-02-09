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


class NotifyFollowers(BaseEmailMessage):
    template_name = "notify_followers.html"

    def get_subject(self):
        # Override the subject method to provide a clean subject line
        return f"New post by {self.context['user']} on {settings.SITE_NAME}"

    def get_context_data(self):
        context = super().get_context_data()
        context["user"] = context.get("user")
        context["post"] = context.get("post")
        context["debug"] = settings.DEBUG
        context["url"] = context.get("url")
        context["domain"] = settings.SITE_URL
        print("Email context:", context)
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
