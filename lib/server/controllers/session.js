'use strict';

const {
  drivers
} = require('macaca-cli');
const chalk = require('chalk');
const errors = require('webdriver-dfn-error-code').errors;

const _ = require('../../common/helper');
const logger = require('../../common/logger');

const detectDevice = function(desiredCapabilities) {
  const platformName = desiredCapabilities.platformName && desiredCapabilities.platformName.toLowerCase();

  if (platformName === 'desktop') {
    const browserName = desiredCapabilities.browserName && desiredCapabilities.browserName.toLowerCase();

    try {
      const Driver = require(`macaca-${browserName}`);
      return new Driver();
    } catch (e) {
      if (!drivers.includes(browserName)) {
        logger.error(`Browser must in (${drivers.join(', ')})`);
      } else {
        logger.info(`please run: \`npm install macaca-${browserName} -g\``);
        logger.error(e);
      }
    }
  } else {
    try {
      const Driver = require(`macaca-${platformName}`);
      return new Driver();
    } catch (e) {
      if (!drivers.includes(platformName)) {
        logger.error(`Platform must in (${drivers.join(', ')})`);
      } else {
        logger.info(`please run: \`npm install macaca-${platformName} -g\``);
        logger.error(e);
      }
    }
  }
};

const createDevice = function *(caps) {
  const device = detectDevice(caps);

  if (caps.app) {
    caps.app = yield _.configApp(caps.app);
  }
  caps.show = this._options.window;
  device.proxyMode = false;
  yield device.startDevice(caps);
  return device;
};

function *createSession(next) {
  this.sessionId = _.uuid();
  logger.debug(`Creating session, sessionId: ${this.sessionId}.`);
  const body = this.request.body;
  const caps = body.desiredCapabilities;
  const device = yield createDevice.call(this, caps);
  this.device = device;
  this.devices.set(this.sessionId, device);
  this.state.value = caps;
  yield next;
}

function *getSessions(next) {
  this.state.value = Array.from(this.devices.entries()).map(device => {
    const id = device[0];
    const deviceInstances = device[1];
    const capabilities = deviceInstances.getCaps && deviceInstances.getCaps();
    return {
      id,
      capabilities
    };
  });
  yield next;
}

function *delSession(next) {
  const sessionId = this.params.sessionId;
  this.sessionId = sessionId;
  const device = this.devices.get(sessionId);
  if (!device) {
    this.status = 200;
    yield next;
  } else {
    yield device.stopDevice();
    this.devices.delete(sessionId);
    logger.debug(`Delete session, sessionId: ${sessionId}`);
    this.device = null;
    this.status = 200;
    yield next;
  }
}

function *sessionAvailable(sessionId, next) {
  if (this.devices.has(sessionId)) {
    this.sessionId = sessionId;
    this.device = this.devices.get(sessionId);

    const hitProxy = () => {
      if (this.device) {
        return !this.device.whiteList(this) && this.device.proxyMode;
      }
    };

    if (hitProxy()) {
      const body = yield this.device.proxyCommand(this.url, this.method, this.request.body);
      this.body = body;

      const log = _.clone(body);

      if (log.value) {
        log.value = _.truncate(JSON.stringify(log.value), {
          length: 400
        });
      }
      logger.debug(`${chalk.magenta('Send HTTP Respone to Client')}[${_.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}]: ${JSON.stringify(log)}`);
    } else {
      yield next;
    }
  } else {
    throw new errors.NoSuchDriver();
  }
}

module.exports = {
  sessionAvailable,
  createSession,
  getSessions,
  delSession
};
