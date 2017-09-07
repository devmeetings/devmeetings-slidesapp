#!/bin/sh

if [ -L node_modules ];
then
  rm node_modules
fi

if [ -d node_modules ];
then
  rm -rf /tmp/$1-node_modules
  mv node_modules /tmp/$1-node_modules
fi

if [ -f yarn.lock ];
then
  cp yarn.lock /tmp/$1-yarn.lock
fi


