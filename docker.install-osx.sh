#!/bin/bash

if [ -x /usr/bin/VirtualBox ] 
then
  if [ -x ~/bin/boot2docker ]
  then
    echo "boot2Docker installed - skipping"
  else
    # Enter the installation directory
    mkdir -p ~/bin
    cd ~/bin
    # Get the file
    curl https://raw.githubusercontent.com/boot2docker/boot2docker/master/boot2docker > boot2docker
    # Mark it executable
    chmod +x boot2docker

    ./boot2docker init

    for i in {49000..49900}; do
     VBoxManage modifyvm "boot2docker-vm" --natpf1 "tcp-port$i,tcp,,$i,,$i";
     VBoxManage modifyvm "boot2docker-vm" --natpf1 "udp-port$i,udp,,$i,,$i";
    done

    ./boot2docker up
  fi
  
  if [ -x /usr/local/bin/docker ]
  then
    echo "docker installed - skipping"
  else 
    # -------------- Docker OSX client --------------
    DIR=$(mktemp -d ${TMPDIR:-/tmp}/dockerdl.XXXXXXX) && \
        curl -f -o $DIR/ld.tgz https://get.docker.io/builds/Darwin/x86_64/docker-latest.tgz && \
        gunzip $DIR/ld.tgz && \
        tar xvf $DIR/ld.tar -C $DIR/ && \
        cp $DIR/usr/local/bin/docker ./docker
    # Copy the executable file
    sudo mkdir -p /usr/local/bin
    sudo cp docker /usr/local/bin/
  fi

  echo "We are done!. Okthxbye"
else
  echo "Please install VirtualBox first"
  open https://www.virtualbox.org/wiki/Downloads
fi 
