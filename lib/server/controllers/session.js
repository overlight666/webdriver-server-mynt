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

const _ = require('../../common/helper');
const logger = require('../../common/logger');

function *createSession(next) {
  this.sessionId = _.uuid();
  logger.debug(`Creating session, sessionId: ${this.sessionId}.`);
  const body = this.request.body;
  const caps = body.desiredCapabilities;
  this.state.value = yield this.webdriverServer.start(caps);
  const device = this.webdriverServer.device;
  this.device = device;
  this.webdriverServer.sessions.set(this.sessionId, device);
  yield next;
}

function *getSession(next) {
  this.state.value = this.webdriverServer.sessions;
  yield next;
}

function *getSessions(next) {
  this.state.value = this.webdriverServer.sessions;
  yield next;
}

function *delSession(next) {
  const sessionId = this.params.sessionId;
  const device = this.webdriverServer.sessions.get(sessionId);
  yield device.stopDevice();
  this.webdriverServer.sessions.delete(sessionId);
  logger.debug(`Delete session, sessionId: ${sessionId}`);
  yield next;
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
      logger.debug(`Send HTTP Respone to Client ${JSON.stringify(body)}`);
      this.body = body;
    } else {
      yield next;
    }
  } else {
    this.throw(404, `Variable Resource Not Found. sessionId: ${sessionId}`);
  }
}

module.exports = {
  sessionAvailable,
  createSession,
  getSessions,
  getSession,
  delSession
};
