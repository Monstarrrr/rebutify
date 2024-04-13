# Rebutify

The official repository of [rebutify.org](https://rebutify.org)

[Status page](https://vj0kytyy.status.cron-job.org/)

# Installation

### Environment Variables

Copy `.template-env` and rename it `.env`.
Read more about the various options in [.template-env](.template-env)

```
cp .template-env .env
```

**Note**: Put your `DJANGO_SECRET_KEY` in your `.env` file.
If you don't have a [secret key](https://docs.djangoproject.com/en/5.0/ref/settings/#secret-key) for your project, generate a secure password longer than 50 characters.

## Installation with Docker

To start, run

```sh
docker compose up
```

## Local installation

### Python dependencies

Install the dependencies in a new virtual environment.

```sh
python -m venv .venv
source .venv/bin/activate # Windows: .venv\Scripts\activate.ps1
pip install -r requirements.txt
```

Begin serving the application with gunicorn.

```sh
gunicorn --bind 0.0.0.0:8000 -k uvicorn.workers.UvicornWorker rebutify.asgi:application
```

# Contributing

For instructions on contributing, read [CONTRIBUTING.md](CONTRIBUTING.md)
