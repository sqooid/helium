#!/bin/bash

docker build . -t sqooid/helium-proxy:latest
docker push sqooid/helium-proxy:latest