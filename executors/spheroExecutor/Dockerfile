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
ADD . /spheroExecutor
RUN cd /spheroExecutor; npm install

WORKDIR /spheroExecutor
# Run the whole stuff
CMD ["npm", "start"]
