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
npm start
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


## The Raspberry Pi

The raspberry pi by default has [LXDE](http://lxde.org), a linux distro that is heavily built around the Desktop Manager [Open Box](http://openbox.org/wiki/Main_Page). In order to set it up to launch our page right away, we took some of the following common raspberry pi steps.

### Useful shortcuts provided by openbox

* `alt+f4` - close window
* `alt+ctrl+f1` - jump out of Desktop Manager to TTY
* Right click on things - the context menus are great

### Setup Hostname:
You should be able to find this Raspberry Pi on the Recurse Network. It's called `thundertube` This is done by simply editing `/etc/hostname`.

### Enable SSH
This means you can SSH into the pi if you're on the Recurse Center network. Use `ssh pi@thundertube.local` The password for the pi user is the same as the password for the Recurse Center network.

Enabling SSH on raspberry pi's can be done by adding a file named `ssh` to the root directory.

### Boot without login
As soon as the raspberry pi boots, it should launch our page. This is accomplished by:

1. `sudo raspi-config` > Boot Options > Desktop / CLI > Desktop AutoLogin
2. Edit `~/.config/lxsession/LXDE/autostart`

```
# These prevent screen from turning off
@xset s off
@xset -dpms
@xset s noblank
@chromium-browser --kiosk file:///home/pi/thundertube/index.html
```

## Dependencies

This relies on some code checked into `/vendor` that comes from [code mirror](https://codemirror.net/) and [THREE.js](https://threejs.org/) including:

  * `codemirror.css` --> Code mirror styling
  * `codemirror.js`  --> Code mirror main
  * `javascript-mode.js` --> Code mirror plugin for js highlighting
  * `liquibyte.css` --> Code mirror theme
  * `three.js` --> All of the THREE.js
  
## Plans
* Make UI look better
* Add a save/restore feature, and add a way to view others' saved code

