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

function *getUrl(next) {
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
<<<<<<< HEAD
  getUrl,
=======
  get,
>>>>>>> 9beceb2f13369aa7a3ad43a2b23b35f7c0dec21f
  forward,
  back,
  refresh
};
