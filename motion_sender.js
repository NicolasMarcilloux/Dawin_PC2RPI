/*const Leap = require('leapjs');

let newDirection = '';
let previousDirection, controller;

const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const UP = 'UP';
const DOWN = 'DOWN';
const FORWARD = 'FORWARD';
const BACKWARD = 'BACKWARD';

controller = Leap.loop({frameEventName:'deviceFrame', enableGestures:true});
console.log("Waiting for leap Motion connection...");

controller.connect();

controller.on('connect', () => {
    console.log('connected to leap motion');
  });

controller.on('ready', () => {
  console.log('ready');
});

controller.on('deviceFrame', function(frame) {
  if(frame.hands[0]){
            var g = frame.hands[0];
            handleSwipe(g);
          }
});

var handleSwipe = function(g) {
            var previousFrame = controller.frame(1);
            var movement = g.translation(previousFrame);
            previousDirection = newDirection;
            console.log(movement);

            if(movement[0] > 4){
              newDirection = 'RIGHT'
            } else if(movement[0] < -4){  
              newDirection = 'LEFT'             
            }             

            if(movement[1] > 4){
              newDirection = 'UP'
            } else if(movement[1] < -4){               
              newDirection = 'DOWN'             
            }             

            if(movement[2] > 4){
              newDirection = 'REVERSE'
            } else if(movement[2] < -4){
              newDirection = 'FORWARD'
            }
      	console.log('Direction: ', newDirection);
      }*/

var Leap = require('leapjs');
var WebSocketClient = require('websocket').client; 
var client = new WebSocketClient();
client.connect('ws://192.168.43.67:10001/', 'echo-protocol');

var minSpeed = 60;
var maxSpeed = 128;
var minAngle = 0.5;

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });

    var controller = new Leap.Controller({
      frameEventName: 'deviceFrame',
      enableGestures:true
    });

    controller.on('deviceFrame', function(frame) {
      if (frame.pointables.length === 1 && frame.gestures.length && frame.gestures[0].type == 'circle') {
        //setHeading(frame.gestures[0]);
        //console.log("test1");
      } else if (frame.pointables.length > 3) {
        move(frame);
        //console.log("test2");
      } else if (frame.pointables.length === 0){
        //stopSphero(sphero);
        //console.log("test3");
      }
    });

    var move = function(frame) {
      if (frame.hands.length && frame.hands[0]) {
        var hand = frame.hands[0];

        var roll  = hand.roll(); // 0 < left & 0 > right
        var pitch = hand.pitch(); // 0 < forward & 0 > back

        if (pitch > minAngle) {
            //send(getSpeed(pitch), 180, 1);
            console.log("back");
            connection.sendUTF("back");
        } else if (pitch < (0 - minAngle)) {
            //send(getSpeed(pitch), 0, 1);
            console.log("front");
            connection.sendUTF("front");
        } else if (roll > minAngle) {
            //send(getSpeed(roll), 270, 1);
            console.log("left");
            connection.sendUTF("left");
        } else if (roll < (0 - minAngle)) {
            //send(getSpeed(roll), 90, 1);
            console.log("right");
            connection.sendUTF("right");
        } else {
            //stopSphero();
            console.log("stop");
            connection.sendUTF("stop");
        }
      }
    };

    controller.connect();
});






