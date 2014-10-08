#!/bin/bash

for name in *.ogg; do
  mp3Name="${name/.ogg/.mp3}"
  if [ ! -f "$mp3Name" ]; then
    avconv -i "${name}" -ab 48k "${mp3Name}";
  fi
done;

