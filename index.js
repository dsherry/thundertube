var options = {
    host: '10.0.18.242'
}
const artnet = require('artnet')(options);



function sendData(data) {
    artnet.set(1, 0, data,
               function (err, res) {
                   console.log('sending');
                   console.log(err);
                   if (err) { console.log(err); }
                   if (res) { console.log(res); }
                   artnet.close();
               });
}

function 

Array.apply(null, new Array(512)).map(function () { return 255; }, 0)
