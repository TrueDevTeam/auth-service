const errors = require('@feathersjs/errors');

const statuses = require('../config/statuses');
const responseMessages = require('../config/response-messages');
const validator = require('../utils/validator');
const sessionUtils = require('../utils/session-utils');
const User = require('../models/user');

const updateLogonData = async (user) => {
  user.dataValues.lastLogonAt = Date.now()
  await user.save();
}

const checkStatus = async (user) => {
  return user.status !== statuses.ACTIVE;
}

const tokenService = {
  create (data, params) {
    return new Promise(async (resolve, reject) => {
      const requestUserInfo = {
        email: data.body.email,
        password: data.body.password
      };
      const validationError = validator.validateAuthCredentials(requestUserInfo);
      if (validationError) {
        return reject(new errors.BadRequest(validationError));
      }
      const user = await User.findOne({where: { email: requestUserInfo.email }});
      if (!user) {
        return reject(new errors.Forbidden(responseMessages.NO_USER_ERROR_MESSAGE));
      }
      if (user.isLocked()) {
        return reject(new errors.Forbidden(responseMessages.TOO_MANY_LOGIN_ATTEMPTS));
      }
      const isPasswordCorrect = await user.checkLoginAttempt(requestUserInfo.password);
      if (!isPasswordCorrect) {
        return reject(new errors.Forbidden(responseMessages.NO_USER_ERROR_MESSAGE));
      }
      const userData = user.dataValues;
      const isActive = await checkStatus(userData);
      if (!isActive) {
        return reject(new errors.Forbidden(responseMessages.FORBIDDEN));
      }
      try {
        const privateKeyPath = data.app.get('privateKey');
        const token = await sessionUtils.createSession(userData, data.headers, privateKeyPath);
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
