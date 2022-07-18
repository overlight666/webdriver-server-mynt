'use strict';

module.exports = async function(next) {
  const body = this.request.body;
  const value = Object.assign({}, body);
  this.state.value = await this.device.keyboard(value);
  await next;
};
