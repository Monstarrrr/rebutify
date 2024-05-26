Instructions for contributing to the rebutify repository.

## Table of Content

- [Table of Content](#table-of-content)
- [1. Installing `pre-commit` hooks](#1-installing-pre-commit-hooks)
  - [1.1. Download dependencies using Python:](#11-download-dependencies-using-python)
  - [1.2. Install pre-commit](#12-install-pre-commit)
  - [1.3. Verify install](#13-verify-install)
  - [1.4. Skip pre-commit](#14-skip-pre-commit)
- [2. Running Django](#2-running-django)

## 1. Installing `pre-commit` hooks

> We use `pre-commit` hooks for code quality.

### 1.1. Download dependencies using [Python](https://www.python.org/downloads/):

```bash
pip install -r backend/requirements-dev.txt
```

### 1.2. Install pre-commit

```bash
pre-commit install
```

### 1.3. Verify install

```bash
pre-commit run --all-files
```

<!-- > The `run --all-files` command is handy to use before making commits, or when commits fail the git hook for debugging purposes. -->

### 1.4. Skip pre-commit

> If needed, use `--no-verify` option to commit without running the pre-commit hooks.

```bash
git commit -m "emergency! skipping hooks" --no-verify
```

## 2. Running Django

Install the project first as lined out in the [README](README.md).

Start the development server with

```bash
python backend/manage.py runserver
```

Create and run database migrations with

```
python backend/manage.py makemigrations
python backend/manage.py migrate
```
