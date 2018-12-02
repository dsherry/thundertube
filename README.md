# ⚡ The ThunderTube ⚡

[![](./thumb.jpg)](https://www.youtube.com/watch?v=gyQX5rhEqEg)
[(watch it in action)](https://www.youtube.com/watch?v=gyQX5rhEqEg)

# Overview
An application for live-coding some LEDs in the Recurse Center space.

The application has three components:
 - Javascript client: for sending websocket data for lights
 - A server on a teensy board for handling websocket connection and powering lights
 - A Node.js server for persisting user code to a MongoDB database
 
There is an additional branch called `simulator` which has a 3D simulator written in THREE.js that you can access online at `thundertube.now.sh`.
(Maintained by @strickinato)

It's all run on a raspberry pi on the Recurse LAN. (pi@thundertube.local)

## Run it locally
_This can be done either on your own machine or on the raspberry pi. Note that if you run it on your own machine, the UI may complain about not being able to connect to the web socket._
### Option 1: Run with a local database (preferred)
1. Follow instructions at https://docs.mongodb.com to install MongoDB.
2. Run the following to start a local MongoDB instance on port `39700`, storing data in `~/data/thunderbird/db`:
```
$ mkdir -p ~/data/thundertube/db
$ mongod --port 39700 --dbpath ~/data/thunderbird/db
```
3. In this project repository, add the file `server/databaseconfig.js` with the following contents:
```js
exports.DatabaseConfig = {PATH: 'mongodb://127.0.0.1:39700'};
```
Then follow the instructions below to run the server.

### Option 2: Run with the live database (dangerous)
_WARNING: If you do this, changes you make (and bugs you introduce) in your local server will reflect on the raspberry pi._
1. Follow instructions at https://docs.mongodb.com to install MongoDB.
2. If necessary, copy the `server/databaseconfig.js` file from the raspberry pi to your version of the repository. Ensure that this file is not checked into source control since it contains the username/password of the live database.

Then follow the instructions below to run the server.

### Run the server
Once the `server/databaseconfig.js` file exists and points to a MongoDB database, you can run the server:

```shell
$ npm start
Listening on port 5000...
Attempting to connect to database at: mongodb://127.0.0.1:39700
Successfully connected to database.
```

Then you can access the UI at http://localhost:5000.

# The Client

## Dependencies

The client uses [code mirror](https://codemirror.net/) for the editor. For the client dependencies, we don't use a build script and instead they're directly referenced from the the source code in client/lib directory. See the `index.html` for how they're included.
  
  
# The Teensy Board  

## About

The hardware is a prototype of Max D's (F2'18) [LEDRiver](https://github.com/maxdee/ledriver) project - which is based around a Teensy3.2 board.

## Programming the board
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

## Troubleshooting

* There are many modes. A button on the side controls what mode we're in. Thundertube expects "websocket control mode"!
* Try unplugging and plugging back in!
* Make sure the Node.js server is talking to the database you think it's talking to.

# The Node.js server
The server exposes two HTTP POST endpoints:
- `/loadallcodes` which queries the database for all user codes and returns them as JSON in the response.
- `/saveallcodes` which receives all user codes as JSON in the request and writes them to the database. The response contains whether the write was successful.

# The Raspberry Pi

The raspberry pi by default has [LXDE](http://lxde.org), a linux distro that is heavily built around the Desktop Manager [Open Box](http://openbox.org/wiki/Main_Page). In order to set it up to launch our page right away, we took some of the following common raspberry pi steps.

## Useful shortcuts provided by openbox

* `alt+f4` - close window
* `alt+ctrl+f1` - jump out of Desktop Manager to TTY
* Right click on things - the context menus are great

## Setup Hostname:
You should be able to find this Raspberry Pi on the Recurse Network. It's called `thundertube` This is done by simply editing `/etc/hostname`.

## Enable SSH
This means you can SSH into the pi if you're on the Recurse Center network. Use `ssh pi@thundertube.local` The password for the pi user is the same as the password for the Recurse Center network.

Enabling SSH on raspberry pi's can be done by adding a file named `ssh` to the root directory.

## Boot without login
As soon as the raspberry pi boots, it should launch our page. This is accomplished by running our startup script

1. `sudo raspi-config` > Boot Options > Desktop / CLI > Desktop AutoLogin
2. Edit `~/.config/lxsession/LXDE/autostart`

```
# These prevent screen from turning off
@xset s off
@xset -dpms
@xset s noblank
/home/pi/thundertube/startup.sh
```