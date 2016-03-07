

var socketManager = function(){

}

socketManager.instance = null;

socketManager.getInstance = function() {
  if (this.instance === null) {
    this.instance = new socketManager();
  }
  return this.instance;
};

socketManager.prototype = {

}



exports = module.exports = socketManager.getInstance();
