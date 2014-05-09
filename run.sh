#!/bin/bash
cwd=$(pwd)

docker build -t devmeetings/xplatform-basic .
docker run -v $cwd/platform:/platform -p 3000 -t devmeetings/xplatform-basic

