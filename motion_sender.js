const readline = require('readline');
var Leap = require('leapjs');
var WebSocketClient = require('websocket').client; 
var client = new WebSocketClient();

var minSpeed = 60;
var maxSpeed = 128;
var minAngle = 0.5;

var ip = "";
var port = "";

function beginExchanges(){
	client.connect('ws://' + ip + ':' + port + '/', 'echo-protocol'); // 192.168.43.67:10001

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
}



const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


rl.question('Enter a IP address and port with format [ipaddress]:[port] : ', (answer) => {
	ip = answer.split(":")[0];
	port = answer.split(":")[1];
	rl.close();
	beginExchanges();
});








