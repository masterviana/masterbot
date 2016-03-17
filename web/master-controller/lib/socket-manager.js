var sockjs = require('sockjs');
var RoomServer = require('sockjs-rooms').server;
var debug      = require('debug')('bootControl_server');

var options = {
  sockjs_url: 'http://cdn.sockjs.org/sockjs-0.3.min.js'
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
      this.configuration = GLOBAL.service.configuration;
      var self = this;

      var sockjs_opts = {
        sockjs_url: options.sockjs_url
      };
      this.service = sockjs.createServer(sockjs_opts);
      debug('sockjs service was created with url ' );
      this.roomServer = new RoomServer(this.service);
      debug('room server was created ');
      this.service.installHandlers(httpServer, {
        prefix: self.configuration.prefix
      });
      debug('install headers on httpserver prefix ' + self.configuration.prefix);
      console.log('will register channels ', GLOBAL.service.configuration);
      for(channel in self.configuration.channels){

        this.registerChannel(self.configuration.channels[channel]);
      }
      callback(null,null);
    },
    registerChannel : function(channel){
      var self = this;
      debug('will register channel ' + channel);
      self.channels[channel] = self.roomServer.registerChannel(channel);
      debug('have registerd channel ' + channel);
      self.channels[channel].on('connection', function(conn) {
        debug('Client connect on server ' + channel);
        conn.write("was connected");
        conn.on('data', function(data) {
          conn.write(data);
        });
      });
    }
}


exports = module.exports = socketManager.getInstance();
