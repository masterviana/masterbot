var sjsc = require('sockjs-client-ws');


var client = sjsc.create("http://localhost:3000/echo");
client.on('connection', function() {
  console.log("connection is established")
});
client.on('data', function(msg) {
  console.log("received some data : ", msg);
});
client.on('error', function(e) {
  console.log("something went wrong")
});
client.write("Have some text you mighty SockJS server!");
