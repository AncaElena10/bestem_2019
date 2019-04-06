
FROM python:3.6

COPY ./requirements.txt /core/

RUN apt-get update
RUN apt-get install python3-pip -y
RUN pip3 install pipenv
RUN pip3 install -r /core/requirements.txt

COPY . /core