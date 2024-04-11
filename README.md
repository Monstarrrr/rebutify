# rebutify

For instructions on contributing, read [CONTRIBUTING.md](CONTRIBUTING.md)

# Installation
### Environment Variables

Rename `.env-template` to `.env`, or make a copy.
Read more about the various options in [.env-template](.env-template)
```
cp .env-template .env
```

**Note**: Put your `DJANGO_SECRET_KEY` in your `.env` file.
If you don't have a [secret key](https://docs.djangoproject.com/en/5.0/ref/settings/#secret-key) for your project, generate a secure password longer than 50 characters.

## Installation with Docker
Run the webserver using
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