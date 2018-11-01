var options = {
    host: '10.0.18.242'
}
const artnet = require('artnet')(options);
const io = require('socket.io');
const socket_server = io();

function sendData(data) {
    artnet.set(1, 0, data,
               function (err, res) {
                   console.log('sending artnet message');
                   if (err) { console.log('Error is ' + err); }
                   if (res) { console.log('Response is ' + res); }
                   artnet.close();
               });
}

// Array.apply(null, new Array(512)).map(function () { return 255; }, 0)

socket_server.on('connection', function(socket){
    console.log('Socket received conenction');
    socket.on('data', function(msg){
        console.log('Message received by socket is: ' + msg);
        sendData(msg);
    });
});
socket_server.listen(1337);

// for testing
const io_client = require('socket.io-client');
const socket_client = io_client('http://localhost:1337');
socket_client.emit('data', 'test');
socket_client.emit('data', [255, 255]);
