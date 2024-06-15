# Script to update the domain Django thinks it's
# running on.
# This is the URL sent in activation emails.
#
# To run this script, pipe it into the Django shell.
# python manage.py shell < [this file]

from django.conf import settings
from django.contrib.sites.models import Site

site = Site.objects.get(id=settings.SITE_ID)
site.domain = settings.SITE_URL
site.name = settings.SITE_NAME
site.save()
