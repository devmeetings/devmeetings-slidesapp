#!/bin/sh

if [ -d /tmp/$1-node_modules ];
then
  rm -rf node_modules
  cp -r /tmp/$1-node_modules node_modules
fi

if [ -f /tmp/$1-yarn.lock ];
then
  cp /tmp/$1-yarn.lock yarn.lock
fi


