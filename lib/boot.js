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

var fs = require('fs');

var _ = require('./common/helper');
var logger = require('./common/logger');

var main = require('./server').init;

module.exports = function(options, callback) {
  global.__webdriver = main(options, function() {
    logger.info('webdriver start with options:\n%j', options);
    callback && callback();
  }, function() {
    logger.info('WebdriverSDK stoped at %s', _.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'));
  }).catch(e => {
    logger.debug(`webdriver server error happened ${e}`);
  });
};
