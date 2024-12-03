# Script to update the domain Django thinks it's
# running on.
# This is the URL sent in activation emails.
#
# To run this script, pipe it into the Django shell.
# python manage.py shell < [this file]

from core.models import User
from django.conf import settings
from django.contrib.sites.models import Site

site = Site.objects.get(id=settings.SITE_ID)
site.domain = settings.SITE_URL
site.name = settings.SITE_NAME
site.save()

print("Success\n")

if settings.DEBUG_DB:
    # Add more example data for this to populate the sqlite database
    if User.objects.exists():
        print("User(s) already exist")
        exit()
    # fmt: off
    # nosec
    user = User.objects.create_user(username="JohnAdmin", email="admin@email.com", password="Passw0rd!") # nosec
    # nosec
    # fmt: on
    user.save()
    print("Created user JohnAdmin")
