var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor
var room = require('sockjs-rooms').client;
var roomClient = new room("http://localhost:3000/multiplex");
var debug = require('debug')('clientToArduino');

var sp = new SerialPort("/dev/cu.usbmodemFD121", {
   parser: serialport.parsers.readline("\n"),
   baudrate: 9600
});

sp.on("data", function (data) {
   console.log("data from ardunio : ", data);
});

var serialIsBusy = false;
var lastSpeedSent;
var objectToSent ;

function sendToArduino(objectToArduino){
  if(serialIsBusy){
    console.log("serial is busy!")
  }else{
    lastSpeedSent = objectToArduino;
    serialIsBusy = false;
    console.log('send data to arduino ', objectToArduino)
    debug('will send data now ');
    sp.write(JSON.stringify(objectToArduino));
  }
}

var self = this;
var socketCounts = 0 ;

// var interval = setInterval(function(){
//   console.log('total calls is ',socketCounts );
//
//   socketCounts = 0;
//   if(objectToSent){
//
//   }
//
// },800);

var latency = roomClient.channel("DIRECTIONAL_COMMANDS");
latency.on("message",function(message){
  if(message.data == 'was connected' ) return;

  socketCounts = socketCounts +1;
  var dataObject = JSON.parse(message.data);
  var y  = dataObject.y;
  var direction = 0;
  var speed = 0;

  if(y == 0){
    direction = 0;
    speed = 0;
  }else{
    //go forward
    if(y > 0 ){
      direction = 0;
      var relativeSpeed = Math.abs(y);
      speed = relativeSpeed * 255
      speed = Math.floor(speed)
    }
    //go back
    else{
        direction = 1;
        var relativeSpeed = Math.abs(y);
        speed = relativeSpeed * 255
        speed =  Math.floor(speed)
    }
  }
  var objectToArduino = {
    direction  : direction,
    speed : speed
  }
  objectToSent = objectToArduino;

  console.log('send data to arduino ', objectToArduino);
  sp.write("hello world");

});
