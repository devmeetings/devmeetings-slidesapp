#!/bin/bash

osascript camtasia.AppleScript
osascript chrome.AppleScript

timestamp=$(date +%s)
echo ${timestamp} >> timestamps.list

