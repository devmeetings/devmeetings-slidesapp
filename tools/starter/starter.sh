#!/bin/bash

timestamp=$(date +%s)

echo ${timestamp} >> timestamps.list

osascript camtasia.AppleScript
osascript chrome.AppleScript
