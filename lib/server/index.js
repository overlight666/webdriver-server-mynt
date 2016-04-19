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
const installer = require('node-installer');
const bodyParser = require('koa-bodyparser');
const errors = require('webdriver-dfn-error-code').errors;

const router = require('./router');
const _ = require('../common/helper');
const logger = require('../common/logger');
const middlewares = require('./middlewares');
const responseHandler = require('./responseHandler');

function WebdriverServer() {
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
  yield this.device.startDevice(caps);
  return this.desiredCapabilities;
};

WebdriverServer.prototype.detectDevice = function() {

  let platformName = this.desiredCapabilities.platformName && this.desiredCapabilities.platformName.toLowerCase();

  switch (platformName) {
    case 'ios':
      var IOS = installer('macaca-ios')
      return new IOS();
      break;
    case 'android':
      var Android = installer('macaca-android');
      return new Android();
      break;
    case 'desktop':
      break;
    default:
      logger.debug(`platformName: ${platformName} is not available!`);
      break;
  }

  let browserName = this.desiredCapabilities.browserName &&  this.desiredCapabilities.browserName.toLowerCase();

  switch (browserName) {
    case 'chrome':
      var Chrome = installer('macaca-chrome');
      return new Chrome();
      break;
    case 'electron':
      var Electron = installer('macaca-electron');
      return new Electron();
      break;
    default:
      logger.debug(`browserName: ${browserName} is not available!`);
      break;
  }

  throw new errors.NoSuchDriver(`platformName: ${platformName} or browserName: ${browserName} is not available!`);
};

exports.init = (options) => {

  return new Promise((resolve, reject) => {
    logger.debug('webdriver server start with config:\n %j', options);

    try {
      const app = koa();

      var webdriverServer = new WebdriverServer();

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
