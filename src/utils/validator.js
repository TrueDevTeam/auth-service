const joi = require('joi');
const config = require('../config/config');
const userRoles = require('../config/user-roles');

const authCredentialsSchema = joi.object().keys({
  email: joi.string().required(),
  password: joi.string().required()
});

const userSchema = joi.object().keys({
  email: joi.string().required(),
  password: joi.string().required(),
  fullName: joi.string().required(),
  phoneNumber: joi.string().required(),
  avatarUrl: joi.string().required(),
  company: joi.object().keys({
    type: joi.string().required(),
    name: joi.string().required()
  }).required()
});

const requestHeadersSchema = joi.object().keys({
  userAgent: joi.string().required()
    .error(new Error(`Header '${config.USER_AGENT_HEADER}' is required`))
});

const rolesSchema = joi.object().keys({
  roles: joi.array().items(joi.string().valid(
    userRoles.CARRIER_ADMIN,
    userRoles.CARRIER_REGULAR,
    userRoles.SENDER_ADMIN,
    userRoles.SENDER_REGULAR
  ))
});

const validateAuthCredentials = user => {
  return joi.validate(user, authCredentialsSchema).error;
}

const validateUser = user => {
  return joi.validate(user, userSchema).error;
}

const validateRequestHeaders = requestHeaders => {
  return joi.validate(requestHeaders, requestHeadersSchema).error;
}

const validateRolesRequest = roles => {
  return joi.validate(roles, rolesSchema).error;
}

module.exports = {
  validateAuthCredentials,
  validateUser,
  validateRequestHeaders,
  validateRolesRequest
};
