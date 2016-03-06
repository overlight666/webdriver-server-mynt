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
const temp = require('temp');
const _ = require('macaca-utils');
const AdmZip = require('adm-zip');
const childProcess = require('child_process');

const logger = require('./logger');

_.sleep = function(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
};

_.retry = function(func, interval, num) {
  return new Promise((resolve, reject) => {
    func().then(resolve, err => {
      if (num > 0 || typeof num === 'undefined') {
        _.sleep(interval).then(() => {
          resolve(_.retry(func, interval, num - 1));
        });
      } else {
        reject(err);
      }
    });
  });
};

_.waitForCondition = function(func, wait/*ms*/, interval/*ms*/) {
  wait = wait || 5000;
  interval = interval || 500;
  let start = Date.now();
  let end = start + wait;
  const fn = function() {
    return new Promise((resolve, reject) => {
      const continuation = (res, rej) => {
        let now = Date.now();
        if (now < end) {
          console.log(`start next Condition test........`);
          res(_.sleep(interval).then(fn));
        } else {
          rej(`Wait For Condition timeout ${wait}`);
        }
      }
      func().then(isOk => {
        if (!!isOk) {
          resolve();
        } else {
          continuation(resolve, reject);
        }
      }).catch(e => {
        continuation(resolve, reject);
      });
    });
  };
  return fn();
};

_.escapeString = function(str) {
  return str
    .replace(/[\\]/g, '\\\\')
    .replace(/[\/]/g, '\\/')
    .replace(/[\b]/g, '\\b')
    .replace(/[\f]/g, '\\f')
    .replace(/[\n]/g, '\\n')
    .replace(/[\r]/g, '\\r')
    .replace(/[\t]/g, '\\t')
    .replace(/[\"]/g, '\\"')
    .replace(/\\'/g, "\\'");
};

_.exec = function(cmd, opts) {
  return new Promise((resolve, reject) => {
    childProcess.exec(cmd, _.merge({
      maxBuffer: 1024 * 512,
      wrapArgs: false
    }, opts || {}), (err, stdout) => {
      if (err) {
        return reject(err);
      }
      resolve(_.trim(stdout));
    });
  });
};

_.spawn = function() {
  var args = Array.prototype.slice.call(arguments);

  return new Promise((resolve, reject) => {
    var stdout = '';
    var stderr = '';
    var child = childProcess.spawn.apply(childProcess, args);

    child.on('error', error => {
      reject(error);
    });

    child.stdout.on('data', data => {
      stdout += data;
    });

    child.stderr.on('data', data => {
      stderr += data;
    });

    child.on('close', code => {
      var error;
      if (code) {
        error = new Error(stderr);
        error.code = code;
        return reject(error);
      }
      resolve([stdout, stderr]);
    });
  });
};

_.configApp = function(app) {
  if (app.substring(0, 4).toLowerCase() === 'http') {
    // TODO
  } else {
    let appPath = path.resolve(app);
    try {
      fs.accessSync(appPath);
    } catch (e) {
      logger.debug(`App path ${appPath} does not exist!`);
      throw new Error(`App path ${appPath} does not exist!`);
    }
    let extension = appPath.substring(appPath.length - 4).toLowerCase();
    if (extension === '.app') {
      logger.debug(`Using local app form ${path}`);
      return appPath;
    } else if (extension === ".zip") {
      logger.debug(`Unzipping local app form ${appPath}`);
      const newApp = temp.openSync({
        prefix: 'macaca-app',
        suffix: '.zip'
      });
      const newAppPath = newApp.path;
      fs.writeFileSync(newAppPath, fs.readFileSync(appPath));
      const zip = AdmZip(newAppPath);
      const zipEntries = zip.getEntries();
      const appName = zipEntries[0].entryName;
      const appDirname = path.dirname(newAppPath)
      zip.extractAllTo(appDirname, true);
      return path.join(appDirname, appName);
    }
  }
};

module.exports = _;
