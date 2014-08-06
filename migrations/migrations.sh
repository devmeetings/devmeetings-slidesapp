#!/bin/bash

mkdir -p scripts
if [ "$1" == "new" ] && [ "$2" != "" ]; then 
    FILENAME="scripts/$2_$(date +%s).js"
    echo "new file created: $FILENAME" 
    echo "" >> $FILENAME
else 
    echo "wrong command $1"
    echo "Usage:" 
    echo "new file"
fi


