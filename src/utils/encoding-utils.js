const jwt = require('jsonwebtoken');
const fs = require('fs');
const crypto = require('crypto');

const config = require('../config/config');

const generateToken = (user, sessionInfo, privateKeyPath) => {
  return new Promise((resolve, reject) => {
    const cert = fs.readFileSync(privateKeyPath);
    const dataToEncode = {
      email: user.email,
      userAgent: sessionInfo.userAgent,
      loggedAt: sessionInfo.loggedAt
    };
    jwt.sign(dataToEncode, cert, {algorithm: config.JWT_ENCODING_ALGORITHM}, (err, token) => {
      const result = {};
      if (err) {
        result.error = err;
        return reject(result);
      }
      result.token = token;
      return resolve(result);
    });
  });
};

const verify = (token, publicKeyPath) => {
  return new Promise((resolve, reject) => {
    const cert = fs.readFileSync(publicKeyPath);
    jwt.verify(token, cert, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      return resolve(decoded);
    });
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
