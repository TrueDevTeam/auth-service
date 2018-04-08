const errors = require('@feathersjs/errors');

const encodingService = require('../utils/encoding-utils');
const aclUtils = require('../utils/acl');
const blacklist = require('../models/blacklist');
const User = require('../models/user');
const config = require('../config/config');
const responseMessages = require('../config/response-messages');

const rootAdminAccessMiddleware = async (req, res, next) => {
  const authHeaderContent = req.headers[config.AUTHORIZATION_HEADER];
  if (!authHeaderContent) {
    return res.status(config.FORBIDDEN_STATUS)
      .json(new errors.Forbidden(responseMessages.FORBIDDEN));
  }
  const token = authHeaderContent.replace(/^JWT /, '');

  let tokenPayload;
  try {
    const publicKeyPath = req.app.get('publicKey');
    tokenPayload = await encodingService.verify(token, publicKeyPath);
  } catch (err) {
    return res.status(config.FORBIDDEN_STATUS)
      .json(new errors.Forbidden(err));
  }
  const activationState = await blacklist.get(encodingService.hash(token));
  if (activationState !== null) {
    return res.status(config.FORBIDDEN_STATUS)
      .json(new errors.Forbidden(responseMessages.FORBIDDEN));
  }

  const user = await User.findOne({ email: tokenPayload.email });
  // todo rework
  if (!aclUtils.isRootAdmin(user)) {
    return res.status(config.FORBIDDEN_STATUS)
      .json(new errors.Forbidden(responseMessages.FORBIDDEN));
  }
  next();
}

module.exports = rootAdminAccessMiddleware;
