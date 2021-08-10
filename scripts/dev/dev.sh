#!/bin/bash

scripts="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker_files="$scripts/../../"

export DOCKER_UID="$(id -u)"
export DOCKER_UNAME="$(whoami)"
docker-compose -f "$docker_files/docker-compose.yml" -f "$docker_files/docker-compose.dev.yml" run --rm --service-ports $1

# scripts="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#mkdir -p "$scripts/gem/home" && \
#mkdir -p "$scripts/gem/local" && \
#mkdir -p "$scripts/gem/lib" && \
 
# mkdir -p "$scripts/gem/usr_local" && \
# docker run --name calendar --rm \
# -u $(id -u ${USER}) \
# -p 3000:3000 \
# -v "$scripts/calendar:/home/${USER}/calendar" \
# -v "$scripts/gem/usr_local:/usr/local/bundle" \
# -it calendar



#-v "$scripts/gem/local:/usr/local/bundle" \
#-v "$scripts/gem/home:/home/${USER}/.gem/" \
#-v "$scripts/gem/lib:/usr/local/lib/ruby/gems" \

# bash -c "mkdir -p /home/bach/calendar /home/bach/.gem /usr/local/bundle /usr/local/lib/ruby/gems; bash"

# rails new calendar -d=postgresql -T --webpack=react --skip-coffee

# rails server --binding=0.0.0.0

# docker run --name calendar_db -e POSTGRES_PASSWORD=calendar_db -p 5432:5432 -d postgres