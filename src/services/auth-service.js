const errors = require('@feathersjs/errors');

const statuses = require('../config/statuses');
const responseMessages = require('../config/response-messages');
const validator = require('../utils/validator');
const sessionUtils = require('../utils/session-utils');
const User = require('../models/user');

const updateLogonData = async (user) => {
  user.lastLogonAt = Date.now()
  await user.save(); // todo
}

const checkStatus = async (user) => {
  return user.status !== statuses.ACTIVE;
}

const tokenService = {
  create (data, params) {
    return new Promise(async (resolve, reject) => {
      const userInfo = {
        email: data.body.email,
        hashPassword: data.body.hashPassword
      };
      const validationError = validator.validateAuthCredentials(userInfo);
      if (validationError) {
        return reject(new errors.BadRequest(validationError));
      }
      const user = await User.findOne({ email: userInfo.email }); // todo
      if (!user) {
        return reject(new errors.Forbidden(responseMessages.NO_USER_ERROR_MESSAGE));
      }
      if (user.isLocked()) {
        return reject(new errors.Forbidden(responseMessages.TOO_MANY_LOGIN_ATTEMPTS));
      }
      const isPasswordCorrect = await user.checkLoginAttempt(userInfo.hashPassword);
      if (!isPasswordCorrect) {
        return reject(new errors.Forbidden(responseMessages.NO_USER_ERROR_MESSAGE));
      }
      const isActive = await checkStatus(user);
      if (!isActive) {
        return reject(new errors.Forbidden(responseMessages.FORBIDDEN));
      }
      try {
        const privateKeyPath = data.app.get('privateKey');
        const token = await sessionUtils.createSession(user, data.headers, privateKeyPath);
        const tokenResponse = { token };
        await updateLogonData(user);
        return resolve(tokenResponse);
      } catch (err) {
        return reject(err);
      }
    });
  }
}

module.exports = tokenService;
