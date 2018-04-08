const authService = require('./auth-service');
const blacklistService = require('./blacklist-service');
const userBlacklistAddingService = require('./user-blacklist-adding-service');
const userBlacklistRemovingService = require('./user-blacklist-removing-service');
const registerService = require('./register-service');
const rolesService = require('./roles-service');

const restApi = {
  title: 'Authorization SSO service',
  description: 'This API provides login/sign-up functionality'
};

module.exports = {
  authService,
  blacklistService,
  userBlacklistAddingService,
  userBlacklistRemovingService,
  registerService,
  rolesService,
  restApi
};
