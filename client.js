var socket = io("http://localhost:1337");

let defaultText = "// Define a function called draw that takes a timestampe (1)\nfunction draw(tick){\n  return Array(512).fill(127);\n}";

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
    let send = function() {
        try {
            if (codeChanged) {
                codeChanged = false;
                eval(currentCode);
            }
            let tick = Date.now();
            let array = eval("draw(tick)");
            console.log("sending");
            socket.emit("data", array);
            messageDiv.innerHTML = "[" + array.toString() + "]";
        } catch(err) {
            message.innerHTML = err;
        }
        requestAnimationFrame(send);
    }
    window.requestAnimationFrame(send);
};
start();
