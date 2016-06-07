'use strict';

var os = require('os');

var _ = require('./common/helper');
var startServer = require('./server').init;

var defaultOpt = {
  port: 3456
};

function Webdriver(options) {
  this.options = _.merge(defaultOpt, options || {});
  this.init();
}

Webdriver.prototype.init = function() {
  this.options.ip = _.ipv4;
  this.options.host = os.hostname();
  this.options.loaded_time = _.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
};

Webdriver.prototype.start = function() {
  return startServer(this.options);
};

module.exports = Webdriver;
