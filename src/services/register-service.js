const errors = require('@feathersjs/errors');

const User = require('../models/user');
const encodingService = require('../utils/encoding-utils');
const sessionUtils = require('../utils/session-utils');
const validator = require('../utils/validator');
const responseMessages = require('../config/response-messages');
const config = require('../config/config');

// todo add sentry everywhere
// todo keys in home dir
// rework docs
const registerService = {
  create (data, params) {
    return new Promise(async (resolve, reject) => {
      const userInfo = {
        ...data.body
      };
      const userValidationError = validator.validateUser(userInfo);
      if (userValidationError) {
        return reject(new errors.BadRequest(userValidationError));
      }
      const headers = {
        userAgent: data.headers[config.USER_AGENT_HEADER]
      }
      const headersValidationError = validator.validateRequestHeaders(headers);
      if (headersValidationError) {
        return reject(new errors.BadRequest(headersValidationError));
      }
      const existingUser = await User.findOne({ where: { email: userInfo.email } });
      if (existingUser) {
        return reject(new errors.BadRequest(responseMessages.USER_ALREADY_EXISTS));
      }
      let user;
      try {
        userInfo.hashPassword = encodingService.hash(userInfo.password);
        delete userInfo.password;
        user = await User.create(userInfo);
      } catch (error) {
        return reject(new errors.GeneralError(error));
      }

      try {
        const privateKeyPath = data.app.get('privateKey');
        const token = await sessionUtils.createSession(user, data.headers, privateKeyPath);
        const tokenResponse = { token };
        return resolve(tokenResponse);
      } catch (err) {
        return reject(err);
      }
    });
  }
}

module.exports = registerService;
