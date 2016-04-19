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

function *click(next) {
  const elementId = this.params.elementId;
  this.state.value = yield this.device.click(elementId);
  yield next;
}

function *tap(next) {
  const elementId = this.request.body.element;
  this.state.value = yield this.device.tap(elementId);
  yield next;
}

function *flick(next) {
  const body = this.request.body;
  const elementId = body.element;
  const xoffset = body.xoffset;
  const yoffset = body.yoffset;
  const speed = body.speed;

  this.state.value = yield this.device.flick(elementId, xoffset, yoffset, speed);
  yield next;
}

function *setValue(next) {
  const elementId = this.params.elementId;
  const body = this.request.body;
  const value = body.value;

  this.state.value = yield this.device.setValue(elementId, value);
  yield next;
}

function *getText(next) {
  const elementId = this.params.elementId;
  this.state.value = yield this.device.getText(elementId);
  yield next;
}

function *clearText(next) {
  const elementId = this.params.elementId;
  this.state.value = yield this.device.clearText(elementId);
  yield next;
}

function *findElement(next) {
  const elementId = this.params.elementId;
  const body = this.request.body;
  const strategy = body.using;
  const selector = body.value;

  this.state.value = yield this.device.findElement(strategy, selector, elementId);
  yield next;
}

function *findElements(next) {
  const elementId = this.params.elementId;
  const body = this.request.body;
  const strategy = body.using;
  const selector = body.value;

  this.state.value = yield this.device.findElements(strategy, selector, elementId);
  yield next;
}

function *isDisplayed(next) {
  const elementId = this.params.elementId;
  this.state.value = yield this.device.isDisplayed(elementId);
  yield next;
}

function *moveTo(next) {
  const body = this.request.body;
  const elementId = body.element;
  const xoffset = body.xoffset;
  const yoffset = body.yoffset;

  this.state.value = yield this.device.moveTo(elementId, xoffset, yoffset);
  yield next;
}

function *getAttribute(next) {
  const elementId = this.params.elementId;
  const name = this.params.name;

  this.state.value = yield this.device.getAttribute(elementId, name);
  yield next;
}

function *getComputedCss(next) {
  const elementId = this.params.elementId;
  const name = this.params.propertyName;

  this.state.value = yield this.device.getComputedCss(elementId, propertyName);
  yield next;
}

module.exports = {
  click,
  flick,
  tap,
  getText,
  clearText,
  setValue,
  findElement,
  findElements,
  getAttribute,
  getComputedCss,
  isDisplayed,
  moveTo
};
