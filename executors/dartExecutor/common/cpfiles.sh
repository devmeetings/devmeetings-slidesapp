#!/bin/sh
set -e
# set -x

if [ -d build ];
then
  ls | grep -v build | xargs rm -rf
  mv build/web/* .
  rm -rf build
  # Resolve symlinks
  mv packages packages2
  cp -Lr packages2 packages
  rm -rf packages2
fi
