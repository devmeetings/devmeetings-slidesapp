#!/bin/bash
sudo hciconfig hci0 up
sudo rfcomm release hci0
sudo rfcomm bind hci0 68:86:E7:02:21:37
sudo chmod 666 /dev/rfcomm0

