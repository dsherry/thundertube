cd /home/pi/thundertube

# The aptitude repos didn't have a compatible node so we installed
# node on this device with nvm, but something weird happens on launch
# with the PATHS, so we reference directly on the pi
/home/pi/.nvm/versions/node/v11.1.0/bin/node server.js &

# Ensures the server has enough time to start up
sleep 6

# kiosk mode gives a great fullscreen experience
chromium-browser --kiosk http://localhost:5000
