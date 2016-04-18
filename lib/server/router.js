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
    .get('/wd/hub/sessions', controllers.session.getSessions)
    .del('/wd/hub/session/:sessionId', controllers.session.delSession);

  sessionRouter
    // session related method
    .prefix('/wd/hub/session/:sessionId')
    .param('sessionId', controllers.session.sessionAvailable)
    .get('/', controllers.session.getSession)
    // context
    .get('/context', controllers.context.getContext)
    .post('/context', controllers.context.setContext)
    .get('/contexts', controllers.context.getContexts)
    // timeout
    .post('/timeouts/implicit_wait', controllers.timeouts.implicitWait)
    // screenshot
    .get('/screenshot', controllers.screenshot.getScreenshot)
    // source
    .get('/source', controllers.source)
    // element
    .post('/element', controllers.element.findElement)
    .post('/elements', controllers.element.findElements)
    .post('/element/:elementId/element', controllers.element.findElement)
    .post('/element/:elementId/element', controllers.element.findElements)
    .post('/element/:elementId/value', controllers.element.setValue)
    .post('/element/:elementId/click', controllers.element.click)
    .get('/element/:elementId/text', controllers.element.getText)
    .post('element/:elementId/clear', controllers.element.clearText)
    .post('/touch/click', controllers.element.tap)
    .post('/touch/flick', controllers.element.flick)
    // execute
    .post('/execute', controllers.execute)
    // title
    .get('/title', controllers.title)
    // alert
    .post('/accept_alert', controllers.alert.acceptAlert)
    .post('/dismiss_alert', controllers.alert.dismissAlert)
    .get('/alert_text', controllers.alert.alertText)
    .post('/alert_text', controllers.alert.alertKeys)
    //url
    .get('/url', controllers.url.url)
    .post('/url', controllers.url.getUrl)
    .post('/forward', controllers.url.forward)
    .post('/back', controllers.url.back)
    .post('/refresh', controllers.url.refresh)
    //window
    .get('/window_handle', controllers.window.getWindow)
    .get('/window_handles', controllers.window.getWindows)
    .post('/window', controllers.window.setWindow)
    .del('/window', controllers.window.deleteWindow);
  app
    .use(rootRouter.routes())
    .use(rootRouter.allowedMethods())
    .use(sessionRouter.routes())
    .use(sessionRouter.allowedMethods());

  logger.debug('router set');
};
