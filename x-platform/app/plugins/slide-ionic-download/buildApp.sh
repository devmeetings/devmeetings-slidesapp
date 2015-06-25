#!/bin/sh
ARG=$1

echo "Replacing to $1"

mkdir -p /tmp/ionicapp/app
cp app /tmp/ionicapp -r
cd /tmp/ionicapp/app
sed -i "s#content src=\".\+\"#content src=\"$ARG\"#" config.xml
if [ ! -d "/tmp/ionicapp/app/platforms" ];
then
  ionic state restore
fi
ionic build android
