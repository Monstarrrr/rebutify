Official repository of [rebutify.org](https://rebutify.org)  
[Status page](https://vj0kytyy.status.cron-job.org/)

# Table of Content

- [Table of Content](#table-of-content)
- [1. Installation](#1-installation)
  - [1.1 Environment Variables](#11-environment-variables)
  - [1.2. Docker](#12-docker)
  - [1.3. Python](#13-python)
      - [Unix OS](#unix-os)
      - [Windows OS](#windows-os)
- [2. Deployment](#2-deployment)
- [3. Contributing](#3-contributing)

# 1. Installation

## 1.1 Environment Variables

**Create** a `.env` file at the root of the project based on [`.template-env`](.template-env)'s content.

```bash
cp .env-template .env
```

> :warning: Put your `DJANGO_SECRET_KEY` in your `.env` file.  
> If you don't have a [secret key](https://docs.djangoproject.com/en/5.0/ref/settings/#secret-key) for your project, generate a secure password longer than 50 characters.

## 1.2. Docker

**Start** the docker container:

```bash
docker compose up
```

## 1.3. Python

**Install** the dependencies in a new virtual environment from the root directory ``/rebutify``.

```bash
python -m venv .venv
```
----
#### Unix OS
```bash
source .venv/bin/activate
```
#### Windows OS
```bash
source .venv/Scripts/activate
```
----
```bash
pip install -r requirements.txt
```

# 2. Deployment

**Begin** serving the application with gunicorn.

```bash
gunicorn --bind 0.0.0.0:8000 -k uvicorn.workers.UvicornWorker rebutify.asgi:application
```

# 3. Contributing

For instructions on contributing, read [CONTRIBUTING.md](CONTRIBUTING.md).
