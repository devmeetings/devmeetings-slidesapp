#!/bin/sh
if [ -f src/index.html ];
then
  cp src/index.html .
fi

if [ -d dist ];
then
  cp -r dist/* .
fi

if [ -d build ];
then
  cp -r build/* .
fi

if [ -d reactive-angular-slides ];
then
  cp -r reactive-angular-slides/* .
fi
