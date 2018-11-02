var socket = io("http://localhost:1337");

//let defaultText = "// Define a function called draw that takes a timestampe (1)\nfunction draw(tick){\n  return Array(512).fill(127);\n}";
let defaultText = "function draw(tick){\n    var vals = Array(512).fill(0);\n\n    // create a control signal ranging from 0 to 1, based on the tick\n    var speedFactor = (2 * 3.14159) * 0.0001;\n    var controlSignal = (Math.sin(speedFactor * tick) + 1) / 2.0;\n    // scale that signal to range from 0 to 99 (because we have 100 LEDs)\n    controlSignal = Math.floor(controlSignal * 100.0);\n    // set RGB for one pixel to white, based on where the control signal is\n    vals[controlSignal * 3] = 255;\n    vals[controlSignal * 3 + 1] = 255;\n    vals[controlSignal * 3 + 2] = 255;\n    return vals;\n}";

var editor = CodeMirror(document.getElementById("mount"), {
  value: defaultText,
  mode:  "javascript",
});


let currentCode = defaultText;
let codeChanged = false;

editor.on("changes", function(){
  let userCode = editor.getValue();
  let messageDiv = document.getElementById("message");

  try {
    eval(userCode);
      currentCode = userCode;
      codeChanged = true;
      messageDiv.innerHTML = "\n";


  } catch(err) {
    message.innerHTML = err;
  }
});

function start() {
    console.log('Start invoked');
    let messageDiv = document.getElementById("message");
    let send = function() {
        //console.log('Send invoked');
        try {
            if (codeChanged) {
                codeChanged = false;
            }
            eval(currentCode);
            let tick = Date.now();
            let array = eval("draw(tick)");
            console.log("Send: sending data");
            socket.emit("data", array);
            messageDiv.innerHTML = "[" + array.toString() + "]";
        } catch(err) {
            //console.log('Send caught error: ' + err);
            message.innerHTML = err;
        }
        //console.log("Send: requesting next animation frame");
        requestAnimationFrame(send);
    }
    window.requestAnimationFrame(send);
};
start();
