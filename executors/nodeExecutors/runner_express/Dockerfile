# DOCKER-VERSION 0.3.4
FROM debian:sid

ENV LAST_UPDATE 2014-05-21

# Upgrades
RUN apt-get update
RUN apt-get dist-upgrade -y

# Install nodejs & co
RUN apt-get install nodejs -y
RUN apt-get install npm -y

# Make link to create "node" command
RUN ln -s /usr/bin/nodejs /usr/bin/node

# Configure executors
ADD .. /nodeExecutors
RUN cd /nodeExecutors; npm install

WORKDIR /nodeExecutors/runner_express
# Run the whole stuff
CMD ["node", "app"]
