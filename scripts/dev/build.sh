#!/bin/bash

scripts="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker_files="$scripts/../.."

export DOCKER_UID="$(id -u)"
export DOCKER_UNAME="$(whoami)"
docker-compose -f "$docker_files/docker-compose.yml" -f "$docker_files/docker-compose.dev.yml" build $1