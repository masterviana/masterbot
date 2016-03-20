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
   console.log("FROM ARDUINO: ", data);
});


var self = this;
var socketCounts = 0 ;
var pendingCommand = "";

var interval = setInterval(function(){
  //console.log('total calls during interval ',socketCounts , " command length ", pendingCommand.length);
  if(pendingCommand.length > 0 ){
    //console.log("cmd is ",pendingCommand );
    socketCounts = 0;
    sp.write(pendingCommand);
  }

},250);

var latency = roomClient.channel("DIRECTIONAL_COMMANDS");
latency.on("message",function(message){
  if(message.data == 'was connected' ) return;

  socketCounts = socketCounts +1 ;

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
  var commandsToSend = speed+"/"+direction+"|"+speed+"/"+direction+";";
  //pendingCommand = commandsToSend;
  console.log("cmd is ",commandsToSend );
  sp.write(commandsToSend);

});
