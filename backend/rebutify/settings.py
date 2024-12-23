"""
Django settings for rebutify project.

Generated by 'django-admin startproject' using Django 5.0.4.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

import os
from datetime import timedelta
from pathlib import Path
from typing import List

from dotenv import load_dotenv

load_dotenv()

STAGE = os.getenv("STAGE", "local")

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = bool(os.getenv("DJANGO_DEBUG", "True") == "True")

ALLOWED_HOSTS: List[str] = (
    os.getenv("DJANGO_HOSTS", "localhost,127.0.0.1").split(",")
    if STAGE != "local"
    else ["localhost", "127.0.0.1"]
)

# Name of website used in activation, password reset emails, etc.
SITE_NAME = os.getenv("SITE_NAME", "rebutify.org")

# URL used in activation, password reset emails, etc.
SITE_URL = os.getenv("FRONTEND_SITE_URL", "localhost:3000")

SITE_ID = 1

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    "corsheaders",
    "core",
    "rest_framework",
    "rest_framework.authtoken",
    "rebutify",
    "djoser",
    "drf_spectacular",
]

MIDDLEWARE = [
    # CorsMiddleware should be placed as high as possible
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
if DEBUG:
    MIDDLEWARE.append("request_logging.middleware.LoggingMiddleware")

# Domains that can access the API
CORS_ALLOWED_ORIGINS = [
    "https://www.rebutify.org",
    "https://rebutify.org",
    "http://localhost:3000",
    "http://0.0.0.0:3000",
    "http://127.0.0.1:3000",
    "http://192.168.1.14:3000",
]
# ALLOWED_HOSTS = [
#     "localhost",
#     "127.0.0.1",
#     "192.168.1.14"
# ]
if DEBUG:
    CORS_ALLOWED_ORIGINS += ["http://" + host for host in ALLOWED_HOSTS]

# Normalizing URLs for front-end (https://docs.djangoproject.com/en/4.0/ref/middleware/#django.middleware.common.CommonMiddleware)
APPEND_SLASH = True
PREPEND_WWW = False

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    # https://stackoverflow.com/a/47657610/19071246
    # cursor pagination uses previous or next page links
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.CursorPagination",
    "PAGE_SIZE": int(os.getenv("PAGE_SIZE", "10") or "10"),
}

SPECTACULAR_SETTINGS = {
    "TITLE": "Rebutify API",
    "DESCRIPTION": "Rebutify",
    "VERSION": "1.0.0",
}

ROOT_URLCONF = "rebutify.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            os.path.join(BASE_DIR, "templates"),
        ],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


WSGI_APPLICATION = "rebutify.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DEBUG_DB = os.getenv("DEBUG_DB", "True") == "True"
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
    if DEBUG_DB
    else {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("POSTGRES_NAME", ""),
        "USER": os.getenv("POSTGRES_USER", ""),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD", ""),
        "HOST": os.getenv("POSTGRES_HOST", ""),
        "PORT": "5432",
        "CONN_MAX_AGE": 500,
        "CONN_HEALTH_CHECKS": True,
    },
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

SECURE_HSTS_SECONDS = int(os.getenv("DJANGO_SECURE_HSTS_SECONDS", 0))

# No effect if HSTS_SECONDS is 0
SECURE_HSTS_PRELOAD = bool(os.getenv("DJANGO_SECURE_SSL_REDIRECT", False))
SECURE_HSTS_INCLUDE_SUBDOMAINS = bool(
    os.getenv("DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS", False)
)

SECURE_SSL_REDIRECT = bool(os.getenv("DJANGO_SECURE_SSL_REDIRECT", False))

SESSION_COOKIE_SECURE = bool(os.getenv("DJANGO_SESSION_COOKIE_SECURE", False))
CSRF_COOKIE_SECURE = bool(os.getenv("DJANGO_CSRF_COOKIE_SECURE", False))

# Write emails to directory EMAIL_FILE_PATH if special debug flag is true
DEBUG_MAIL = bool(os.getenv("DEBUG_MAIL", "True") == "True")
if DEBUG_MAIL:
    EMAIL_BACKEND = "django.core.mail.backends.filebased.EmailBackend"
    EMAIL_FILE_PATH = ".emails"

EMAIL_HOST = os.getenv("EMAIL_HOST", "")
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
EMAIL_USE_TLS = bool(os.getenv("EMAIL_USE_TLS", True))

EMAIL_FROM = os.getenv("EMAIL_FROM", "noreply@rebutify.org")
DEFAULT_FROM_EMAIL = EMAIL_FROM

DJOSER = {
    "ACTIVATION_URL": "activate?uid={uid}&token={token}",
    "SEND_ACTIVATION_EMAIL": True,
    "SEND_CONFIRMATION_EMAIL": True,
    "SERIALIZERS": {
        "current_user": "core.serializers.UserSerializer",
    },
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=10) if DEBUG else timedelta(minutes=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(minutes=60) if DEBUG else timedelta(minutes=5),
    # https://django-rest-framework-simplejwt.readthedocs.io/en/latest/settings.html#auth-header-types
    "AUTH_HEADER_TYPES": ("Bearer",),
}

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "django.request": {
            "handlers": ["console"],
            "level": "DEBUG",  # change debug level as appropiate
            "propagate": False,
        },
    },
}
