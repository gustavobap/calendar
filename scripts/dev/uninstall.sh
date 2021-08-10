#!/bin/bash

scripts="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker_files="$scripts/../../"
docker-compose -f "$docker_files/docker-compose.yml" -f "$docker_files/docker-compose.dev.yml" down --rmi all