var sjsc = require('sockjs-client-ws');

var client = sjsc.create("http://localhost:9999/multiplex");
client.on('connection', function() {
  console.log("connected");
});

client.on("data", function(msg) {
  console.log("message received ", msg);
});


// client.on('data', function (msg) { console.log("message received ",msg); });
client.on('error', function(e) {
  console.log("error ", e);
});

// var _client = new multiplexClient(client)


client.write("sub,ann");

setInterval(function() {
  client.write("msg,ann,hello this is message");
}, 500);
