#!/bin/bash
WD=$(pwd)

cd deployment-app
forever stop deployment-app
CONFIG_MODULE="$WD/devmeetings-slidesapp/deployment/config" forever start --uid deployment-app -l deployment.log -e deployment.err.log -a app.js
cd ../
