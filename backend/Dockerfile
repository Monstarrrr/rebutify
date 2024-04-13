FROM python:3.11.4-slim-buster
WORKDIR /home/app

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .
RUN rm requirements.txt Dockerfile

ENTRYPOINT [ "gunicorn", "--bind", "0.0.0.0:8000", "-k", "uvicorn.workers.UvicornWorker", "rebutify.asgi:application" ]