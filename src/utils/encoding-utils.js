const Promise = require('bluebird');
const jwt = Promise.promisifyAll(require('jsonwebtoken'));
const fs = Promise.promisifyAll(require('fs'));
const crypto = require('crypto');
const os = require('os');

const config = require('../config/config');
const logger = require('./logger');

const generateToken = (user, sessionInfo, privateKeyPath) => {
  return new Promise(async (resolve, reject) => {
    const cert = await fs.readFileAsync(os.homedir() + privateKeyPath);
    const dataToEncode = {
      email: user.email,
      userAgent: sessionInfo.userAgent,
      loggedAt: sessionInfo.loggedAt
    };
    const result = {};
    try {
      result.token = await jwt.signAsync(dataToEncode, cert, {algorithm: config.JWT_ENCODING_ALGORITHM});
      return resolve(result);
    } catch (error) {
      result.error = error;
      return reject(result);
    }
  });
};

const verify = (token, publicKeyPath) => {
  return new Promise(async (resolve, reject) => {
    let cert;
    try {
      cert = await fs.readFileAsync(os.homedir() + publicKeyPath);
    } catch (error) {
      logger.log(error)
      return reject({});
    }
    try {
      const decoded = await jwt.verifyAsync(token, cert);
      return resolve(decoded);
    } catch (error) {
      return reject(error);
    }
  });
}

const hash = (item) => {
  const hash = crypto.createHash(config.HASH_ALGORITHM);
  hash.update(item);
  return hash.digest(config.HASH_ENCODING);
};

module.exports = {
  generateToken,
  verify,
  hash
};
