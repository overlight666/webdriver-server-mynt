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

function *getWindow(next) {
  this.state.value = yield this.device.getWindow();
  yield next;
}

function *getWindows(next) {
  this.state.value = yield this.device.getWindows();
  yield next;
}

function *setWindow(next) {
  const body = this.request.body;
  const name = body.name;

  this.state.value = yield this.device.setWindow(name);
  yield next;
}

function *deleteWindow(next) {
  this.state.value = yield this.device.deleteWindow();
  yield next;
}

module.exports = {
  getWindow,
  getWindows,
  setWindow,
  deleteWindow
};
