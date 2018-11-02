var options = {
    host: '10.0.18.242',
    port: 6454
}
const dgram = require('dgram');
const artnet = require('artnet')(options);
const io = require('socket.io');
const socket_server = io();

// for sending artnet
var socket = dgram.createSocket({type: 'udp4', reuseAddr: true});
socket.on('error', function (err) {
    that.emit('error', err);
});
socket.bind(options['port'], function () {
    socket.setBroadcast(true);
});
var artdmxPackage = function (universe, length, sequence, data) {
    length = parseInt(length, 10) || 2;
    if (length % 2) {
        length += 1;
    }

    /* eslint-disable unicorn/number-literal-case */
    var hUni = (universe >> 8) & 0xff;
    var lUni = universe & 0xff;

    var hLen = (length >> 8) & 0xff;
    var lLen = (length & 0xff);

    var header = [65, 114, 116, 45, 78, 101, 116, 0, 0, 80, 0, 14, sequence, 0, lUni, hUni, hLen, lLen];

    // eslint-disable-next-line unicorn/no-new-buffer
    return new Buffer(header.concat(data.slice(0, (hLen * 256) + lLen)));
};
function sendDMX(universe, sequence, data, callback) {
    var buf = artdmxPackage(universe, 512, sequence, data);
    socket.send(buf, 0, buf.length, options['port'], options['host'], callback);
}


function sendData(data, sequence) {
  console.log(sequence);
    sendDMX(0, sequence, data,
            function (err, res) {
                console.log('sending artnet message');
                if (err) { console.log('Error is ' + err); }
                if (res) { console.log('Response is ' + res); }
            });
}

const dmxDataLength = 512;

function validateData(data) {
  return (data instanceof Array && data.length === dmxDataLength);
}

socket_server.on('connection', function(socket){
    console.log('Socket received conenction');
    socket.on('data', function(msg){
      console.log("about to validate");
        if (validateData(msg)) {
            console.log('Message received by socket is: ');
            sendData(msg, Math.floor(Math.random() * 10e10));
        };
    });
});
socket_server.listen(1337);

// for testing
const io_client = require('socket.io-client');
const socket_client = io_client('http://localhost:1337');
//socket_client.emit('data', 'test');
//socket_client.emit('data', [1,2,3]);
//socket_client.emit('data', testArray());

function testArray() {
  return Array.apply(null, new Array(512)).map(function () { return 255; }, 0);
}
