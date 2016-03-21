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
   //console.log("FROM ARDUINO: ", data);
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

  var y_commands  = getSpeedAndDirection(dataObject.y);
  var x_commands  = getSpeedAndDirection(dataObject.x);

  //console.log("y commands ", y_commands);
  //console.log("x commands ", x_commands);

  var commandsToSend = y_commands.speed+"/"+y_commands.direction+"|"+x_commands.speed+"/"+x_commands.direction+";";
  //pendingCommand = commandsToSend;
  // console.log("cmd is ",commandsToSend );
  //sp.write(commandsToSend);

});




// Tankdrive function, that converts the x and y values
// to store as left/right
//  http://www.goodrobot.com/en/2009/09/tank-drive-via-joystick-control/
function tankdrive(x, y) {
    // first Compute the angle in deg

    // First hypotenuse
    var z = Math.sqrt(x*x + y*y);
    // angle in radians
    rad = Math.acos(Math.abs(x)/z);
    // and in degrees
    angle = rad*180/Math.PI;

    // Now angle indicates the measure of turn
    // Along a straight line, with an angle o, the turn co-efficient is same
    // this applies for angles between 0-90, with angle 0 the co-eff is -1
    // with angle 45, the co-efficient is 0 and with angle 90, it is 1
    var tcoeff = -1 + (angle/90)*2;
    var turn = tcoeff * Math.abs(Math.abs(y) - Math.abs(x));
    turn = Math.round(turn*100)/100;

    // And max of y or x is the movement
    var move = Math.max(Math.abs(y),Math.abs(x));

    // First and third quadrant
    if( (x >= 0 && y >= 0) || (x < 0 &&  y < 0) ) {
        left = move;
        right = turn;
    } else {
        right = move;
        left = turn;
    }

    // Reverse polarity
    if(y < 0) {
        left = 0 - left;
        right = 0 - right;
    }

    return { left : left , right :right  };
}





// //grap y speed and direction
// var y  = dataObject.y;
// var y_direction = 0;
// var y_speed = 0;
//
// if(y == 0){
//   y_direction = 0;
//   y_speed = 0;
// }else{
//   //go forward
//   if(y > 0 ){
//     y_direction = 0;
//     var relativeSpeed = Math.abs(y);
//     y_speed = relativeSpeed * 255
//     y_speed = Math.floor(y_speed)
//   }
//   //go back
//   else{
//       y_direction = 1;
//       var relativeSpeed = Math.abs(y);
//       y_speed = relativeSpeed * 255
//       y_speed =  Math.floor(y_speed)
//   }
// }
//
// //grap y speed and direction
// var x  = dataObject.x;
// var x_direction = 0;
// var x_speed = 0;
//
// if(x == 0){
//   x_direction = 0;
//   x_speed = 0;
// }else{
//   //go forward
//   if(x > 0 ){
//     x_direction = 0;
//     var relativeSpeed = Math.abs(x);
//     x_speed = relativeSpeed * 255
//     x_speed = Math.floor(x_speed)
//   }
//   //go back
//   else{
//       x_direction = 1;
//       var relativeSpeed = Math.abs(x);
//       x_speed = relativeSpeed * 255
//       x_speed =  Math.floor(x_speed)
//   }
// }
