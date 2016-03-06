/* ================================================================
 * webdriver-server by xdf(xudafeng[at]126.com)
 *
 * first created at : Tue Mar 17 2015 00:16:10 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

var os = require('os');

var boot = require('./boot');
var quit = require('./quit');
var server = require('./server');
var _ = require('./common/helper');

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

Webdriver.prototype.start = function(callback) {
  boot(this.options, callback);
};

Webdriver.prototype.restart = function(callback) {
  quit(() => boot(this.options, callback));
};

Webdriver.prototype.stop = function(callback) {
  quit(callback);
};

Webdriver.server = server;

module.exports = Webdriver;
