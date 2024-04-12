# Contributing

### Installing pre-commit hooks

We use pre-commit hooks for code quality.

We include `pre-commit` as a dev dependency, so you can run

```
pip install -r requirements-dev.txt
```

to install the python library.
Then run

```
pre-commit install
```

Try it out with

```
pre-commit run --all-files
```

**Note**: The `run --all-files` command is handy to use before making commits, or when commits fail the git hook for debugging purposes.

You can commit without running the pre-commit hooks with the `--no-verify` option of `git commit`.

```
git commit -m "emergency! skipping hooks" --no-verify
```

### Running Django

Install the project first as lined out in the [README](README.md).

Start the development server with

```
python manage.py runserver
```

Create and run database migrations with

```
python manage.py makemigrations
python manage.py migrate
```
