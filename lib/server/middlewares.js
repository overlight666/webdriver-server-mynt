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

const os = require('os');

const pkg = require('../../package');
const logger = require('../common/logger');

module.exports = function(app) {
  const string = `${pkg.name}/${pkg.version} node/${process.version}(${os.platform()})`;

  app.use(function *powerby(next) {
    yield next;
    this.set('X-Powered-By', string);
  });

  app.use(logger.middleware);
  logger.debug('base middlewares attached');
};
