// var SerialPort = require("serialport").SerialPort;
// var serialport = new SerialPort("/dev/cu.usbmodemFD121", {
//   baudrate: 9600,
// });


var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor

var sp = new SerialPort("/dev/cu.usbmodemFD121", {
   parser: serialport.parsers.readline("\n"),
   baudrate: 9600
});

sp.on("data", function (data) {
  console.log("here: "+data);
});


var obj = {x : 200, y : 100}

setTimeout(function(){
  sp.write(JSON.stringify(obj));
},2500);