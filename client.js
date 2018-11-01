var socket = io("http://localhost:1337");

var editor = CodeMirror(document.getElementById("mount"), {
  value: "// Define a function called draw that takes a timestampe (1)\nfunction draw(tick){\n  return Array(512).fill(127);\n}",
  mode:  "javascript",
});


let shouldRepeat = true;

editor.on("changes", function(){
  let text = editor.getValue();
  let messageDiv = document.getElementById("message");
  shouldRepeat = false;

  try {
    eval(text);
    messageDiv.innerHTML = "\n";

    try {
      let send = function() {
        let tick = Date.now();
        let array = eval("draw(tick)");

        console.log("sending");
        socket.emit("data", array);
        messageDiv.innerHTML = "[" + array.toString() + "]";
        requestAnimationFrame(send);
      }

      window.requestAnimationFrame(send);

    } catch(err) {
      message.innerHTML = err;
    }

  } catch(err) {
    message.innerHTML = err;
  }
});
