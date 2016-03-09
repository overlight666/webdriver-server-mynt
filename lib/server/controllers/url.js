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

function *url(next) {
  this.state.value = yield this.device.url();
  yield next;
}

function *get(next) {
  const body = this.request.body;
  const url = body.url;

  this.state.value = yield this.device.get(url);
  yield next;
}

function *forward(next) {
  this.state.value = yield this.device.forward();
  yield next;
}

function *back(next) {
  this.state.value = yield this.device.back();
  yield next;
}

function *refresh(next) {
  this.state.value = yield this.device.refresh();
  yield next;
}

module.exports = {
  url,
  get,
  forward,
  back,
  refresh
};
