var sockjs = require('sockjs');
var RoomServer = require('sockjs-rooms').server;
var debug      = require('debug')('roomServer');

var options = {
  sockjs_url: 'http://cdn.sockjs.org/sockjs-0.3.min.js',
  socketPrefix : '/multiplex',
  channels : [ '_LATENCY' , 'DIRECTIONAL_COMMANDS' ]
}

var socketManager = function(){
  this.channels = {};
}

socketManager.instance = null;

socketManager.getInstance = function() {
  if (this.instance === null) {
    this.instance = new socketManager();
  }
  return this.instance;
};

socketManager.prototype = {
    initialize : function(httpServer, callback)
    {
      var sockjs_opts = {
        sockjs_url: options.sockjs_url
      };
      this.service = sockjs.createServer(sockjs_opts);
      debug('sockjs service was created with url ' );
      console.log(sockjs_opts)
      this.roomServer = new RoomServer(this.service);
      debug('room server was created ');
      this.service.installHandlers(httpServer, {
        prefix: '/multiplex'
      });
      debug('install headers on httpserver prefix ' + options.prefix);

      for(channel in options.channels){
        this.registerChannel(channel);
      }
      callback(null,null);
    },
    registerChannel : function(channel){
      var self = this;
      debug('will register channel ' + channel);
      self.channels[channel] = self.roomServer.registerChannel(channel);
      debug('have registerd channel ' + channel);
      self.channels[channel].on('connection', function(conn) {
        conn.write('Channel ['+channel+'] was connected');
        debug('one connection on channel ' + channel);
        conn.on('data', function(data) {
          conn.write(data);
        });
      });
    }

}



exports = module.exports = socketManager.getInstance();
