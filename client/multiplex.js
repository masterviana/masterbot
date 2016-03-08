var websocket_multiplex = require('./multiplex-client-nodejs.js');
var sjsc = require('sockjs-client-ws');


var client = sjsc.create("http://localhost:3000/multiplex");

var multiplexer = new websocket_multiplex(client);
var ann = multiplexer.channel('ann');
var bob = multiplexer.channel('bob');
var carl = multiplexer.channel('carl');


function startChannels(ws,channel){
  // ws.connection    = function()  {console.log('[*] open', ws.protocol);};
  // ws.onmessage = function(e) {console.log('[.] message', e.data);};
  // ws.onclose   = function()  {console.log('[*] close');};

  // setInterval(function(){
  //   console.log("emit new message ", ws);
  //    ws.send("sent message from channel client nodejs"  );
  // },2000);

}

startChannels(ann,"ann");


console.log("hello");
