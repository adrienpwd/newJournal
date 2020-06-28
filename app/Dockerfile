FROM python:3.7-alpine

LABEL MAINTAINER="Adrien Poirson <adrien.poirson@gmail.com>"

ENV GROUP_ID=1000 \
    USER_ID=1000

WORKDIR /var/www/

ENV FLASK_APP app.py
ENV FLASK_RUN_HOST 0.0.0.0

# ADD ./requirements.txt /var/www/requirements.txt
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# ADD . /var/www/
COPY . .
RUN pip install gunicorn

RUN addgroup -g $GROUP_ID www
RUN adduser -D -u $USER_ID -G www www -s /bin/sh

USER www

#EXPOSE 5000

#Remove "--reload" for PRODUCTION ENV !!!

CMD [ "gunicorn", "-w", "4", "--bind", "0.0.0.0:5000", "wsgi"]
