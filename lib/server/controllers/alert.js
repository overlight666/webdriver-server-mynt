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

function *acceptAlert(next) {
  this.state.value = yield this.device.acceptAlert();
  yield next;
}

function *dismissAlert(next) {
  this.state.value = yield this.device.dismissAlert();
  yield next;
}

function *alertText(next) {
  this.state.value = yield this.device.alertText(name);
  yield next;
}

function *alertKeys(next) {
  const body = this.request.body;
  const text = body.text;

  this.state.value = yield this.device.alertKeys(text);
  yield next;
}

module.exports = {
  acceptAlert,
  dismissAlert,
  alertText,
  alertKeys
};
