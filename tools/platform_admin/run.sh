#!/bin/sh


cp -rf ../../platform/app/models .
NODE_ENV=$NODE_ENV node app.js

