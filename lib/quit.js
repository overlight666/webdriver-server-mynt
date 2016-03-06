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

var _ = require('./common/helper');
var logger = require('./common/logger');

module.exports = function(callback) {
  if (global.__webdriver) {
    global.__webdriver.stop(function() {
      global.__webdriver = null;
      logger.info('WebdriverSDK stoped at %s', _.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'));
      callback && callback();
    });
  } else {
    logger.warn('WebdriverSDK not found, stop failed.');
  }
};
