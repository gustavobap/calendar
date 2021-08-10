FROM ruby:2.7.4-alpine AS base

ARG UNAME
ARG UID
ARG DB_HOST
ARG DB_USER
ARG DB_PASSWORD

ARG PROJECT=calendar_api

RUN apk --no-cache add build-base tzdata bash
RUN apk --no-cache add postgresql-dev
RUN apk --no-cache add git vim

RUN adduser -S -G wheel \
    --uid "${UID}" \
    "${UNAME}"

USER ${UNAME}
WORKDIR "/home/${UNAME}/${PROJECT}/${PROJECT}"

ENV DB_HOST ${DB_HOST}
ENV DB_USER ${DB_USER}
ENV DB_PASSWORD ${DB_PASSWORD}

FROM base as development

RUN git config --global user.name "Gustavo Peixoto"
RUN git config --global user.email "gustavo.bul.mobile@gmail.com"

ENTRYPOINT ["/bin/bash"]


FROM base as production

ARG UNAME
ARG UID

COPY --chown=${UNAME}:wheel ./calendar_api ../

RUN gem install bundler -v "~>2.0"
RUN bundle install

ENTRYPOINT bundle exec rake db:create db:migrate && rails server -b 0.0.0.0