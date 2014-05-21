#!/bin/bash
cwd=$(pwd)

docker build -t xplatform/mongo - < ./Dockerfiles/mongo.docker
docker build -t xplatform/rabbitmq https://github.com/tutumcloud/tutum-docker-rabbitmq.git
docker build -t xplatform/executors-node ./executors/nodeExecutor
docker build -t xplatform/platform ./platform


docker run -d --name mongo -t xplatform/mongo 
docker run -d --name rabbit -p :5672 -p :15672 -e RABBITMQ_PASS="kbAc4kRS" -t xplatform/rabbitmq 
docker run -d --link rabbit:rabbit --name exec-node -t xplatform/executors-node

docker run -p 3000 --link mongo:mongo --link rabbit:rabbit --name xplatform -e MONGO_HOST="mongo" -t xplatform/platform

#docker build -t devmeetings/xplatform-basic .
#docker run -v $cwd/platform:/platform -p 3000 -t devmeetings/xplatform-basic
docker ps
