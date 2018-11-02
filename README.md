# ⚡ The ThunderTube ⚡

[![](./thumb.jpg)](https://www.youtube.com/watch?v=gyQX5rhEqEg)
[(watch it in action)](https://www.youtube.com/watch?v=gyQX5rhEqEg)

## Description
An application for live-coding some LEDs in the Recurse Center space.

The application has two components: a JS frontend, and [a backend hosted on a Teensy3.2 board](https://github.com/maxdee/ledriver), which powers the LEDs.

## Installation
### JS frontend
```
npm install serve
serve
```
 Now go to http://localhost:5000

### Programming the board
(Done on Mac v10.13.16)

Install the arduino editor. Then install the teensy extension

Go to Tools → Manage Libraries, then search for and install SSD1306Ascii
Then, in /Applications/Arduino.app/Contents/Java/libraries/, delete Ethernet/ and SD/

Install the following in ~/Documents/Arduino/libraries/:
* https://github.com/chrisstaite/TeensyDmx
* https://github.com/brandenhall/Arduino-Websocket
* https://github.com/bblanchon/ArduinoJson
* https://github.com/sstaub/TeensyID

Now open the Arduino IDE, and select Tools → Board → "Teensy 3.2"

## Plans
* Make UI look better
* Add a save/restore feature, and add a way to view others' saved code

