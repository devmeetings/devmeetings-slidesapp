# DOCKER-VERSION 0.3.4
FROM debian:sid

ENV LAST_UPDATE 2014-05-21

# Upgrades
RUN apt-get update
RUN apt-get dist-upgrade -y

# Install nodejs & co
RUN apt-get install nodejs -y
RUN apt-get install npm -y
RUN apt-get install git -y

# Make link to create "node" command
RUN ln -s /usr/bin/nodejs /usr/bin/node

# Bower, grunt
RUN npm install -g grunt-cli bower 

# Configure platform
ADD . /platform

WORKDIR /platform
RUN npm install
RUN bower --allow-root install

# xplatform
EXPOSE 3000 

# Run the whole stuff
CMD ["npm", "start"]
