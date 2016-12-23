#!/bin/sh
if [ -f src/index.html ];
then
  cp src/index.html .
fi

if [ -d dist ];
then
  cp -r dist/* .
fi
