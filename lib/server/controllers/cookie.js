'use strict';

function *getAllCookies(next) {
  this.state.value = yield this.device.getAllCookies();
  yield next;
}

function *addCookie(next) {
  this.state.value = yield this.device.addCookie();
  yield next;
}

function *deleteCookie(next) {
  const body = this.request.body;
  const name = body.name;

  this.state.value = yield this.device.deleteCookie(name);
  yield next;
}

function *deleteAllCookies(next) {
  this.state.value = yield this.device.deleteAllCookies();
  yield next;
}

module.exports = {
  getAllCookies,
  addCookie,
  deleteCookie,
  deleteAllCookies
};
