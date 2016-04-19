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

function *getContext(next) {
  this.state.value = yield this.device.getContext();
  yield next;
}

function *getContexts(next) {
  this.state.value = yield this.device.getContexts();
  yield next;
}

function *setContext(next) {
  const body = this.request.body;
  const name = body.name;
  yield this.device.setContext(name);
  this.state.value = null;
  yield next;
}

module.exports = {
  getContext,
  getContexts,
  setContext
};
