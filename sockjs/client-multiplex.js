var multiplexClient = require('./client-multiplex-npm');
var sjsc = require('sockjs-client-ws');

var client = sjsc.create("http://localhost:9999/multiplex");

// client.write("sub,ann");
// client.on('data', function (msg) { console.log("client data ",msg); });

var multiple = new multiplexClient(client);

var channel = multiple.channel("ann");

channel.on("open",function(){
    console.log("OPEN CHANNEL ann");
});

channel.on("close",function(){
  console.log("CLOSE CHANNEL ann");
});


channel.on("message",function(message){
    console.log("DATA  ",message);
});

var i = 0;

// setInterval(function() {
//   channel.send("helllo from multi-channel");
//   i = i+1;
//   if( i > 20){
//       channel.close();
//   }
//
// }, 500);
