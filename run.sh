#!/bin/bash

if [ -x ~/bin/boot2docker ] 
then
  ~/bin/boot2docker start
fi
export DOCKER_HOST=tcp://127.0.0.1:4243

cwd=$(pwd)

docker build -t xplatform/mongo - < ./Dockerfiles/mongo.docker
docker build -t xplatform/rabbitmq https://github.com/tutumcloud/tutum-docker-rabbitmq.git
docker build -t xplatform/executors-node ./executors/nodeExecutor
docker build -t xplatform/executors-java ./executors/javaExecutor
docker build -t xplatform/platform ./x-platform


docker start mongo || docker run -d --name mongo -p :27017 -t xplatform/mongo 
docker start rabbit || docker run -d --name rabbit -p :5672 -p :15672 -e RABBITMQ_PASS="kbAc4kRS" -t xplatform/rabbitmq 
docker start exec-node || docker run -d --link rabbit:rabbit --name exec-node -e RABBITMQ_HOST="admin:kbAc4kRS@rabbit" -t xplatform/executors-node
docker start exec-java || docker run -d --link rabbit:rabbit --name exec-java -e RABBITMQ_HOST="admin:kbAc4kRS@rabbit" -t xplatform/executors-java


docker stop xplatform
docker rm xplatform
docker run -p 3000 --link mongo:mongo --link rabbit:rabbit --name xplatform -e MONGO_HOST="mongo" RABBIT_HOST="admin:kbAc4kRS@rabbit" -t xplatform/platform

#docker build -t devmeetings/xplatform-basic .
#docker run -v $cwd/platform:/platform -p 3000 -t devmeetings/xplatform-basic
docker ps

PORT=$(docker ps | grep xplatform/platform | sed 's/.*\(49[0-9]\{3\}\).*/\1/')
open http://localhost:${PORT}
