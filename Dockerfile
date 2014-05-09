# DOCKER-VERSION 0.3.4
FROM debian:sid
# Upgrades
RUN apt-get update
RUN apt-get dist-upgrade -y

# Supervisor
RUN apt-get install -y supervisor
RUN mkdir -p /var/log/supervisor

# Software
RUN apt-get install mongodb -y
RUN apt-get install rabbitmq-server -y

# Configure Mongo
RUN mkdir -p /data/db

# Install nodejs & co
RUN apt-get install nodejs -y
RUN apt-get install npm -y

# Make link to create "node" command
RUN ln -s /usr/bin/nodejs /usr/bin/node

# Bower, grunt
RUN npm install -g grunt-cli bower 

ADD ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf
# Configure platform
ADD ./platform /platform
RUN cd /platform; npm install


# Configure executors
ADD ./executors /executors
RUN cd /executors/nodeExecutor; npm install
RUN cd /executors/expressExecutor; npm install

# TODO

# xplatform
EXPOSE 3000 
# mongo
EXPOSE 27017 

# Run the whole stuff
CMD ["supervisord"]
