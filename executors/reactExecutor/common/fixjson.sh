#!/bin/sh
find . -name "*.json" | xargs sed -i -e '/^\s*\/\/.*$/d'
