/* ================================================================
 * webdriver-server by ziczhu(zic.zhu[at]gmail.com)
 *
 * first created at : Tue Mar 17 2015 00:16:10 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright ziczhu
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

const chalk = require('chalk');
const codes = require('webdriver-dfn-error-code').codes;

const _ = require('../common/helper');
const logger = require('../common/logger');

module.exports = function *(next) {
  try {
    logger.debug(`${chalk.green('Recieve HTTP Request from Client')}: method: ${this.method} url: ${this.url}, jsonBody: ${JSON.stringify(this.request.body)}`);

    yield next;

    var hitNoProxy = () => {
      if (this.device) {
        return this.device.whiteList(this) || !this.device.isProxy() || !this.webdriverServer.isProxy;
      } else {
        return true;
      }
    };

    if (hitNoProxy()) {
      const result = {
        sessionId: this.sessionId || '',
        status: 0,
        value: this.state.value
      };
      this.body = result;
      var log = _.clone(result);

      if (log.value) {
        log.value = _.trunc(JSON.stringify(log.value), 400);
      }
      logger.debug(`${chalk.red('Send HTTP Respone to Client')}: ${JSON.stringify(log)}`);
    }

    if (this.device) {

      this.webdriverServer.isProxy = this.device.isProxy();
    }
  } catch (e) {
    logger.debug(`Send Error Respone to Client ${e}`);

    if (!(e instanceof Error)) {
      this.throw(500);
    }
    if (e.stack) {
      logger.debug(e.stack);
    }
    const errorName = e.name;
    const errorMsg = e.message;
    const errorNames = Object.keys(codes);

    if (_.includes(errorNames, errorName)) {
      const error = codes[errorName];
      const errorCode = error.code;
      const badResult = {
        sessionId: this.sessionId || '',
        status: errorCode,
        value: {
          message: errorMsg
        }
      };
      logger.debug(`Send Bad HTTP Respone to Client: ${JSON.stringify(badResult)}`);
      this.body = badResult;
    } else {
      logger.debug(`Unexcepted error ${errorName}`);
      this.throw(500);
    }
  }
};
