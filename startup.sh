cd /home/pi/thundertube
node server/index.js &

# Ensures the server has enough time to start up
sleep 6

# kiosk mode gives a great fullscreen experience
chromium-browser --kiosk http://localhost:5000
