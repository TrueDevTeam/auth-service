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
    user: user.id,
    ...requiredHeaders,
    loggedAt: Date.now()
  }
  return { session };
}

const createSession = async (userData, headers, privateKeyPath) => {
  const sessionInfo = getSessionInfo(userData, headers);
  if (sessionInfo.error) {
    throw new errors.BadRequest(sessionInfo.error);
  }

  const tokenGenerationResult = await encodingService.generateToken(userData, sessionInfo.session, privateKeyPath);
  if (tokenGenerationResult.error) {
    throw new errors.GeneralError(tokenGenerationResult.error);
  }

  sessionInfo.session.tokenHash = encodingService.hash(tokenGenerationResult.token);
  sessionInfo.session.user = userData.id;
  await UserSession.create(sessionInfo.session);

  return tokenGenerationResult.token;
}

module.exports = {
  createSession
};
