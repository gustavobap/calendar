FROM ruby:2.7.4-alpine as base

ARG PROJECT
ARG UNAME
ARG UID

ARG UHOME="/home/${UNAME}"

RUN apk --no-cache add bash
RUN apk --no-cache add --update nodejs yarn

RUN adduser -S \
    --gecos "" \
    --home "${UHOME}" \
    --ingroup "wheel" \
    --uid "${UID}" \
    "${UNAME}"

RUN mkdir -p "${UHOME}/${PROJECT}/${PROJECT}"
RUN chown ${UNAME}:wheel "/home/${UNAME}/${PROJECT}/${PROJECT}"


FROM base as development

ARG UNAME
ARG PROJECT

ARG UHOME="/home/${UNAME}"

RUN apk --no-cache add git vim sudo busybox-suid
RUN echo '%wheel ALL=(ALL) ALL' > /etc/sudoers.d/wheel

RUN yarn global add serve

USER ${UNAME}
WORKDIR "/${UHOME}/${PROJECT}/${PROJECT}"

RUN git config --global user.name "Gustavo Peixoto"
RUN git config --global user.email "gustavo.bul.mobile@gmail.com"

ENTRYPOINT ["/bin/bash"]


FROM base as production

ARG UNAME
ARG PROJECT
ARG REACT_APP_API_ORIGIN

ARG WORKD="/home/${UNAME}/${PROJECT}/${PROJECT}"

RUN yarn global add serve

USER ${UNAME}
WORKDIR "${WORKD}"

COPY --chown=${UNAME}:wheel ./${PROJECT}/${PROJECT}/ ../${PROJECT}

ENV REACT_APP_API_ORIGIN ${REACT_APP_API_ORIGIN}

RUN yarn
RUN yarn build

ENTRYPOINT serve build -s -p 3000