Official repository of [rebutify.org](https://rebutify.org)  
[Status page](https://vj0kytyy.status.cron-job.org/)

# Table of Content

- [Table of Content](#table-of-content)
- [1. Installation](#1-installation)
  - [1.1 Environment Variables](#11-environment-variables)
  - [1.2. Deploy with Docker](#12-deploy-with-docker)
  - [1.3. Local installation](#13-local-installation)
    - [1.3.1. Python dependencies](#131-python-dependencies)
    - [1.3.2. Gunicorn](#132-gunicorn)
- [2. Contributing](#2-contributing)

# 1. Installation

## 1.1 Environment Variables

**Create** a `.env` file at the root of the project based on [`.template-env`](.template-env)'s content.

```bash
cp .env-template .env
```

> :warning: Put your `DJANGO_SECRET_KEY` in your `.env` file.  
> If you don't have a [secret key](https://docs.djangoproject.com/en/5.0/ref/settings/#secret-key) for your project, generate a secure password longer than 50 characters.

## 1.2. Deploy with Docker

**Start** the docker container:

```bash
docker compose up
```

## 1.3. Local installation

### 1.3.1. Python dependencies

**Install** the dependencies in a new virtual environment.

```bash
python -m venv .venv
source .venv/bin/activate # Windows: .venv\Scripts\activate.ps1
pip install -r requirements.txt
```

### 1.3.2. Gunicorn

**Begin** serving the application with gunicorn.

```bash
gunicorn --bind 0.0.0.0:8000 -k uvicorn.workers.UvicornWorker rebutify.asgi:application
```

# 2. Contributing

For instructions on contributing, read [CONTRIBUTING.md](CONTRIBUTING.md).
