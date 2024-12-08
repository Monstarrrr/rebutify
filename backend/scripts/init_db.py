# Script to update the domain Django thinks it's
# running on.
# This is the URL sent in activation emails.
#
# To run this script, pipe it into the Django shell.
# python manage.py shell < [this file]

from core.models import Post, User
from django.conf import settings
from django.contrib.sites.models import Site

site = Site.objects.get(id=settings.SITE_ID)
site.domain = settings.SITE_URL
site.name = settings.SITE_NAME
site.save()

print("Updated site name and url")

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

    arguments_data = [
        {
            "argument": {
                "title": "Animals eat other animals, so it's natural for humans to eat animals",
                "body": "Animals eat other animals all the time in nature, so it is natural and morally acceptable for humans to eat animals as well.",
                "type": "argument",
            },
            "rebuttal": {
                "title": "Naturalistic fallacy: Animal behavior does not determine human ethics",
                "body": "Basing human ethics on animal behavior is a logical fallacy. If we justified actions solely because animals do them, we would have to accept many unethical practices. Humans have the capacity for moral reasoning that goes beyond instinctive animal behaviors.",
                "type": "rebuttal",
            },
        },
        {
            "argument": {
                "title": "Humans are at the top of the food chain, so we should eat animals",
                "body": "As the most intelligent and powerful species, humans are naturally at the top of the food chain and have the right to consume other animals.",
                "type": "argument",
            },
            "rebuttal": {
                "title": "Might does not make right: Challenging the food chain argument",
                "body": "The concept of being 'top of the food chain' is a 'might makes right' fallacy. Our superior intelligence and capability should be used to show compassion, not to dominate and exploit other sentient beings who cannot defend themselves.",
                "type": "rebuttal",
            },
        },
    ]

    # Create posts with parent-child relationship
    for arg_set in arguments_data:
        # Create parent argument
        argument = Post.objects.create(
            title=arg_set["argument"]["title"],
            body=arg_set["argument"]["body"],
            type=arg_set["argument"]["type"],
            ownerUserId=user.id,
            isPrivate=False,
        )
        print(f"Created argument: {argument.title}")

        # Create corresponding rebuttal as a child post
        rebuttal = Post.objects.create(
            title=arg_set["rebuttal"]["title"],
            body=arg_set["rebuttal"]["body"],
            type=arg_set["rebuttal"]["type"],
            ownerUserId=user.id,
            parentId=argument.id,
            isPrivate=False,
        )
        print(f"Created rebuttal: {rebuttal.title}")

print("Database initialization complete.")
