# DOCKER-VERSION 0.3.4
FROM debian:jessie

ENV LAST_UPDATE 2014-06-24
ENV DEBIAN_FRONTEND noninteractive

# Add keys from PPA & Ubuntu
RUN echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main" | tee /etc/apt/sources.list.d/webupd8team-java.list
RUN echo "deb-src http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main" | tee -a /etc/apt/sources.list.d/webupd8team-java.list
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys EEA14886


# Upgrades
RUN apt-get update
RUN apt-get dist-upgrade -y

# Install Java 8
RUN echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections
RUN apt-get -yqq install oracle-java8-installer oracle-java8-set-default

# Install Gradle
RUN apt-get install -y gradle

# Configure executor
ADD . /javaExecutor

# Java home?
ENV JAVA_HOME /usr/lib/jvm/java-8-oracle

RUN cd /javaExecutor && gradle build
WORKDIR /javaExecutor

# Run the whole stuff
CMD ["gradle", "run"]
