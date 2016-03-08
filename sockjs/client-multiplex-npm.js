var WebSocketMultiplex = function(ws) {

   var that = this;
   this.ws = ws;
   this.channels = {};

  this.ws.on('data', function (msg) {
    console.log("this data came from server ", msg);
  });


    // that.ws.on('data', function(e) {
    //   console.log("messgae income ", e);
    //
    //     var t = e.data.split(',');
    //     var type = t.shift(), name = t.shift(),  payload = t.join();
    //     if(!(name in that.channels)) {
    //         return;
    //     }
    //     var sub = that.channels[name];
    //
    //     switch(type) {
    //     case 'uns':
    //         delete that.channels[name];
    //         sub.emit('close', {});
    //         break;
    //     case 'msg':
    //         sub.emit('message', {data: payload});
    //         break;
    //     }
    // });


};

WebSocketMultiplex.prototype.channel = function(raw_name) {
   return this.channels[escape(raw_name)] =
       new Channel(this.ws, escape(raw_name), this.channels);
};

exports = module.exports = WebSocketMultiplex;
