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

const fs = require('fs');
const path = require('path');
const Boom = require('boom');
const Router = require('koa-router');

const logger = require('../common/logger');

const rootRouter = new Router();
const sessionRouter = new Router();

const getControllers = function() {
  const res = {};
  const controllersDir = path.join(__dirname, 'controllers');
  try {
    const list = fs.readdirSync(controllersDir);
    list.forEach(file => {
      if (path.extname(file) === '.js') {
        res[path.basename(file, '.js')] = require(path.join(controllersDir, file));
      }
    });
  } catch (e) {
  }
  return res;
};

// W3C: https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol
module.exports = function(app) {
  let controllers = getControllers();
  // Server status
  rootRouter
    // .get('/status', controllers.status.getStatus)
    .post('/wd/hub/session', controllers.session.createSession)
    .get('/wd/hub/sessions', controllers.session.getSessions);

  sessionRouter
    .prefix('/wd/hub/session/:sessionId')
    .param('sessionId', controllers.session.sessionAvailable)
    .get('/', controllers.session.getSession)
    .del('/', controllers.session.delSession)

    .get('/context', controllers.context.getContext)
    .post('/context', controllers.context.setContext)
    .get('/contexts', controllers.context.getContexts)
    .post('/timeouts/implicit_wait', controllers.timeouts.implicitWait)

    .get('/screenshot', controllers.screenshot.getScreenshot)
    .post('/element', controllers.element.findElement)
    .post('/elements', controllers.element.findElements)
    .post('/element/:elementId/element', controllers.element.findElement)
    .post('/element/:elementId/element', controllers.element.findElements)
    .post('/element/:elementId/value', controllers.element.setValue)
    .post('/element/:elementId/click', controllers.element.click)
    .get('/element/:elementId/text', controllers.element.getText)
    .post('/touch/click', controllers.element.click)

    .post('/execute', controllers.execute)
    .get('/title', controllers.title)

  app
    .use(rootRouter.routes())
    .use(rootRouter.allowedMethods())
    .use(sessionRouter.routes())
    .use(sessionRouter.allowedMethods());

  logger.debug('router set');
};
