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
