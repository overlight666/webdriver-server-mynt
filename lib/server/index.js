/* ================================================================
 * webdriver-server by xdf(xudafeng[at]126.com)
 
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

const koa = require('koa');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const errors = require('webdriver-dfn-error-code').errors;

const router = require('./router');
const _ = require('../common/helper');
const logger = require('../common/logger');
const middlewares = require('./middlewares');
const responseHandler = require('./responseHandler');

function WebdriverServer(options) {
  this.options = options;
  this.desiredCapabilities = null;
  this.sessions = new Map();
  this.device = null;
  this.isProxy = false;
}

WebdriverServer.prototype.start = function *(caps) {
  this.desiredCapabilities = caps;
  this.isProxy = false;
  // inject device
  this.device = this.detectDevice();
  if (caps.app) {
    caps.app = _.configApp(caps.app);
  }

  caps.window = this.options.window;

  yield this.device.startDevice(caps);
  return this.desiredCapabilities;
};

WebdriverServer.prototype.detectDevice = function() {

  let platformName = this.desiredCapabilities.platformName && this.desiredCapabilities.platformName.toLowerCase();

  if (platformName === 'desktop') {
    let browserName = this.desiredCapabilities.browserName &&  this.desiredCapabilities.browserName.toLowerCase();
    try {
      return new require(`macaca-${browserName}`);
    } catch (e) {
      logger.warn(e);
      logger.info(`please run: \`macaca install ${browserName}\``);
    }
  } else {
    try {
      return new require(`macaca-${platformName}`);
    } catch (e) {
      logger.warn(e);
      logger.info(`please run: \`macaca install ${browserName}\``);
    }
  }
};

exports.init = (options) => {

  return new Promise((resolve, reject) => {
    logger.debug('webdriver server start with config:\n %j', options);

    try {
      const app = koa();

      var webdriverServer = new WebdriverServer(options);

      app.use(function *(next) {
        this.webdriverServer = webdriverServer;
        yield next;
      });

      app.use(bodyParser());

      middlewares(app);

      app.use(responseHandler);

      router(app);

      app.listen(options.port, resolve);
    } catch (e) {
      logger.debug(`webdriver server failed to start: ${e.stack}`);
      reject(e);
    }
  });
};
