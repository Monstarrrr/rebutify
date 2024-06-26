# Contributing to Our Project 👩‍💻👨‍💻

Welcome to our project! We're thrilled that you're interested in contributing.  
Please take a moment to review this document to understand how you can contribute effectively.

## Table of Content

- [Contributing to Our Project 👩‍💻👨‍💻](#contributing-to-our-project-)
  - [Table of Content](#table-of-content)
  - [Ways to Contribute 🚀](#ways-to-contribute-)
  - [Code of Conduct 🤝](#code-of-conduct-)
  - [Getting Started 🏁](#getting-started-)
    - [1. Installing `pre-commit` hooks](#1-installing-pre-commit-hooks)
      - [1.1. Download dependencies using Python:](#11-download-dependencies-using-python)
      - [1.2. Install pre-commit](#12-install-pre-commit)
      - [1.3. Verify install](#13-verify-install)
      - [1.4. Skip pre-commit](#14-skip-pre-commit)
    - [2. Running Django](#2-running-django)
    - [3. Conventions](#3-conventions)

## Ways to Contribute 🚀

There are several ways you can contribute to our project:

- **Reporting Bugs:** If you find a bug, please open an issue and include as much detail as possible.
- **Suggesting Enhancements:** Have an idea to improve the project? Open an issue and share your suggestions!
- **Submitting Pull Requests:** You can contribute code changes by submitting pull requests.

## Code of Conduct 🤝

Please review our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## Getting Started 🏁

### 1. Installing `pre-commit` hooks

> We use `pre-commit` hooks for code quality.

#### 1.1. Download dependencies using [Python](https://www.python.org/downloads/):

```bash
pip install -r backend/requirements-dev.txt
```

#### 1.2. Install pre-commit

```bash
pre-commit install
```

#### 1.3. Verify install

```bash
pre-commit run --all-files
```

<!-- > The `run --all-files` command is handy to use before making commits, or when commits fail the git hook for debugging purposes. -->

#### 1.4. Skip pre-commit

> If needed, use `--no-verify` option to commit without running the pre-commit hooks.

```bash
git commit -m "emergency! skipping hooks" --no-verify
```

### 2. Running Django

Install the project first as lined out in the [README](README.md).

Create and run database migrations with

```
python backend/manage.py makemigrations
python backend/manage.py migrate
```

Add the site URL in the database

```bash
python manage.py shell < scripts/update_site_domain.py
```

Start the development server with

```bash
python backend/manage.py runserver
```

#### 2.1 OpenAPI Spec

We use [drf-spectacular](https://github.com/tfranzel/drf-spectacular) to autogenerate our OpenAPI spec.

Access the OpenAPI spec in three ways while running the django server:
- Download the spec from `/api/schema/`
- Use Swagger UI at `/api/schema/swagger-ui/`
- Use Redoc UI at `/api/schema/redoc-ui/`

### 3. Conventions

#### 3.1 Database table and column names

We use camelCase for our database tables and column names defined in `models.py`.
