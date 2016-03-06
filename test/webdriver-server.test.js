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

var Webdriver = require('..');

describe('lib/index.js', function() {
  describe('constructor', function() {
    var webdriver = new Webdriver();

    it('should has property options', function() {
      webdriver.should.have.ownProperty('options');
    });

    it('should has property pid', function(done) {
      webdriver.start(function() {
        webdriver.restart(function() {
          webdriver.options.should.have.ownProperty('pid');
          webdriver.stop();
          done();
        });
      });
    });
  });
});
