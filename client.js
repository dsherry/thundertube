Object.defineProperty(Array.prototype, 'chunk', {
  value: function(chunkSize) {
    var R = [];
    for (var i=0; i<this.length; i+=chunkSize)
      R.push(this.slice(i,i+chunkSize));
    return R;
  }
});

const socket = new WebSocket('ws://10.0.18.242');
//let defaultText = "// Define a function called draw that takes a timestampe (1)\nfunction draw(tick){\n  return Array(512).fill(127);\n}";
let defaultText = "function draw(tick){\n    var vals = Array(300).fill(0);\n\n    // create a control signal ranging from 0 to 1, based on the tick\n    var speedFactor = (2 * 3.14159) * 0.0001;\n    var controlSignal = (Math.sin(speedFactor * tick) + 1) / 2.0;\n    // scale that signal to range from 0 to 99 (because we have 100 LEDs)\n    controlSignal = Math.floor(controlSignal * 100.0);\n    // set RGB for one pixel to white, based on where the control signal is\n    vals[controlSignal * 3] = 255;\n    vals[controlSignal * 3 + 1] = 255;\n    vals[controlSignal * 3 + 2] = 255;\n    return vals;\n}";

var editor = CodeMirror(document.getElementById("mount"), {
  value: defaultText,
  mode:  "javascript",
});

var ledArray = [];
var lightObjectArray = [];
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
    let messageDiv = document.getElementById("message");
    let send = function() {
        try {
            if (codeChanged) {
                codeChanged = false;
            }
            eval(currentCode);
            let tick = Date.now();
            ledArray = eval("draw(tick)");
            ledArray = ledArray
                .map(function(num){ return Math.floor(num); })
                .map(function(num){
                    return num <= 0 ? 0 : num >= 255 ? 255 : num;
                })
                // .map(function(num){ return 127 });

            let buffer = new ArrayBuffer(512);

            for (let i = 0; i < ledArray.length; i++) {
              buffer[i] = ledArray[i];
            }

            // socket.send( buffer );
            messageDiv.innerHTML = "[" + ledArray.toString() + "]";
        } catch(err) {
            message.innerHTML = err;
        }
        requestAnimationFrame(send);
    }
    window.requestAnimationFrame(send);
};


var scene;
var renderer;
var camera;
function setupScene() {
  let canvas = document.getElementById("viz");
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000 );
  renderer = new THREE.WebGLRenderer();

  renderer.setSize( 800, 300 );
  camera.position.z = 50;

  canvas.appendChild( renderer.domElement );

  // Create all the initial objects
  for (let i = 0; i < 100; i++) {
    let circle = new THREE.SphereBufferGeometry( 1, 32, 32 );
    let material = new THREE.MeshBasicMaterial( {color: "rgb(255,255,255)"} );
    let object = new THREE.Mesh( circle , material );
    let ticks = 0.8;
    object.position.set( -i, Math.sin(i*ticks) * 20, Math.cos(i*ticks) * 20 );
    scene.add( object );
    lightObjectArray.push(object);
  }

}

const toRgb = ([r,g,b]) => {
  return new THREE.Color(r,g,b);
};

const updateLightObject = (lightObject, color) => {
  lightObject.material.color = color;
};

function animate() {
	requestAnimationFrame( animate );

  let newColors = ledArray.chunk(3).map(toRgb);
  newColors.forEach(function(color, index){
    updateLightObject(lightObjectArray[index], color);
  });

	renderer.render( scene, camera );
}

start();
setupScene();
animate();
