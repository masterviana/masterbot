var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor
var evets = require('events');
var room = require('sockjs-rooms').client;
var roomClient = new room("http://localhost:3000/multiplex");
var debug = require('debug')('clientToArduino');
var arduinoDebug = require('debug')('arduino');

var sp = new SerialPort("/dev/cu.usbmodemFD121", {
   parser: serialport.parsers.readline("\n"),
   baudrate: 9600
});
// var sp = new evets();

var SPEED_MIN_PWM = 60;
var SPEED_MAX_PWM = 255;
var SPPED_DIFF_TOLERANCE = 0.1;

sp.on("data", function (data) {
  var NO_COMMAND = "ND";
  var COMMAND = "CM";
  console.log("1. FROM ARDUINO " , data);
   if(data.indexOf(COMMAND) > -1 ){
    //  arduinoDebug("FROM ARDUINO: ", data);
    //arduinoDebug("FROM ARDUINO " , data);
    console.log("2 .FROM ARDUINO " , data);
   }
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

  var speedCommands  = tankdrive(dataObject.x, dataObject.y );

  if(speedCommands.left != 0 && speedCommands.right != 0 ){
    var speedDiff =  Math.abs(speedCommands.left - speedCommands.right);
    if(speedDiff <= SPPED_DIFF_TOLERANCE){
      debug("bellow speed difference tolerence, same value L and R");
      speedCommands.right = speedCommands.left;
    }

  }

  var lMotor =  getSpeedAndDirectionFromRelative(speedCommands.left);
  var rMotor =  getSpeedAndDirectionFromRelative(speedCommands.right);

  console.log( "LEFT_MOTOR "+ JSON.stringify(lMotor), " RIGTH_MOTOR "+ JSON.stringify(rMotor)  );
  var commandsToSend = lMotor.speed+"/"+lMotor.dir+"|"+rMotor.speed+"/"+rMotor.dir+";";

   pendingCommand = commandsToSend;
  // console.log("cmd is ",commandsToSend );
  sp.write(commandsToSend);

});


// var speed = 110;
// var dir = 1;
// var state = -1;
// setInterval(function(){
//
//   // speed += 30;
//   // if(speed > 255){
//   //   dir = dir == 0 ? 1 : 0;
//   //   speed = 130 ;
//   // }
//   // state += 1;
//   //
//   // if(state == 0 ){
//   //   dir = 0;
//   // }else if(state == 1){
//   //   dir = 1;
//   // } else {
//   //   dir = 0;
//   //   speed = 0;
//   //   state = 0;
//   // }
//
//   dir = dir == 0 ? 1 : 0;
//   console.log("will send speed ", speed, ' dir ', dir);
//   var commandsToSend = speed+"/"+dir+"|"+speed+"/"+dir+";";
//
//   sp.write(commandsToSend);
//
// },1500);


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

    if(isNaN(left)){
        left = 0 ;
    }
    if(isNaN(right)){
        right = 0 ;
    }

    return { left : left , right :right  };
}

/*
   transform relative value on arduino values, for speed with direction
*/
function getSpeedAndDirectionFromRelative(value)
{

  var intervalDiff = SPEED_MAX_PWM - SPEED_MIN_PWM;
  var returnValues = {speed : 0 , dir : 0}
  if(value == 0 ){
    return returnValues;
  }else{
    //convert 0-255
    //give the direction forward
    if(value > 0 ){
      var relativeSpeed = Math.abs(value);
      returnValues.speed = (relativeSpeed * intervalDiff) + SPEED_MIN_PWM;
      returnValues.speed = Math.floor(returnValues.speed)
      returnValues.dir = 0;
    }
    //convert 0-255
    //give the direction backward
    else{
      var relativeSpeed = Math.abs(value);
      returnValues.speed = (relativeSpeed * intervalDiff) + SPEED_MIN_PWM;
      returnValues.speed = Math.floor(returnValues.speed)
      returnValues.dir = 1;
    }

  }
  return returnValues;
}
