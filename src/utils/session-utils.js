const errors = require('@feathersjs/errors');

const config = require('../config/config');
const encodingService = require('../utils/encoding-utils');
const validator = require('../utils/validator');
const UserSession = require('../models/user-session');

const getSessionInfo = (user, requestHeaders) => {
  const requiredHeaders = {
    userAgent: requestHeaders[config.USER_AGENT_HEADER]
  }
  const validationError = validator.validateRequestHeaders(requiredHeaders);
  if (validationError) {
    return { error: validationError };
  }
  const session = {
    user: user._id,
    ...requiredHeaders,
    loggedAt: Date.now()
  }
  return { session };
}

const createSession = async (user, headers, privateKeyPath) => {
  const sessionInfo = getSessionInfo(user, headers);
  if (sessionInfo.error) {
    throw new errors.BadRequest(sessionInfo.error);
  }

  const tokenGenerationResult = await encodingService.generateToken(user, sessionInfo.session, privateKeyPath);
  if (tokenGenerationResult.error) {
    throw new errors.GeneralError(tokenGenerationResult.error);
  }

  sessionInfo.session.tokenHash = encodingService.hash(tokenGenerationResult.token);
  await UserSession.create(sessionInfo.session);

  return tokenGenerationResult.token;
}

module.exports = {
  createSession
};
