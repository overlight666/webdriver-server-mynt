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

const chalk = require('chalk');
const errors = require('webdriver-dfn-error-code').errors;

const _ = require('../../common/helper');
const logger = require('../../common/logger');

function *createSession(next) {
  this.sessionId = _.uuid();
  logger.debug(`Creating session, sessionId: ${this.sessionId}.`);
  const body = this.request.body;
  const caps = body.desiredCapabilities;
  if (this.device) {
    yield device.stopDevice();
  }
  this.state.value = yield this.webdriverServer.start(caps);
  const device = this.webdriverServer.device;
  this.device = device;
  this.webdriverServer.sessions.set(this.sessionId, device);
  yield next;
}

function *getSessions(next) {
  this.state.value = this.webdriverServer.sessions;
  yield next;
}

function *delSession(next) {
  const sessionId = this.params.sessionId;
  this.sessionId = sessionId;
  const device = this.webdriverServer.sessions.get(sessionId);
  if (!device) {
    this.status = 200;
    yield next;
  } else {
    yield device.stopDevice();
    this.webdriverServer.sessions.delete(sessionId);
    logger.debug(`Delete session, sessionId: ${sessionId}`);
    this.device = null;
    this.status = 200;
    yield next;
  }
}

function *sessionAvailable(sessionId, next) {
  if (this.webdriverServer.sessions.has(sessionId)) {
    this.sessionId = sessionId;
    this.device = this.webdriverServer.sessions.get(sessionId);

    var hitProxy = () => {
      if (this.device) {
        return !this.device.whiteList(this) && this.webdriverServer.isProxy;
      }
    };

    if (hitProxy()) {
      const body = yield this.device.proxyCommand(this.url, this.method, this.request.body);
      this.body = body;

      const log = _.clone(body);

      if (log.value) {
        log.value = _.trunc(JSON.stringify(log.value), 400);
      }
      logger.debug(`${chalk.magenta('Send HTTP Respone to Client: ')}${JSON.stringify(log)}`);
    } else {
      yield next;
    }
  } else {
    throw new errors.NoSuchDriver();
  }
}

module.exports = {
  sessionAvailable,
  createSession,
  getSessions,
  delSession
};
