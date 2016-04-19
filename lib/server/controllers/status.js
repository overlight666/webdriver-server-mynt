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

const os = require('os');

const _ = require('../../common/helper');
const logger = require('../../common/logger');

const arch = os.arch();
const name = os.platform();
const version = '';

module.exports = function *getStatus(next) {
  this.state.value = {
    'build': {

    },
    'os': {
      arch,
      name,
      version
    }
  };
  yield next;
};
