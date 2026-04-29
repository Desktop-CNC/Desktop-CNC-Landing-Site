#!/bin/bash
# use abs path to the UGS folder
cd ../../Desktop-CNC-Universal-G-Code-Sender
xhost +localhost # enable local connections to the X server
# add background process screen access
export DISPLAY=${DISPLAY:-:0}
export XAUTHORITY=$HOME/.Xauthority

# run ugs maven
/usr/bin/mvn nbm:run-platform -pl ugs-platform/application 

# initialize and end
sleep 1
exit 0
