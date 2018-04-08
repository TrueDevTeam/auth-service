const NO_USER_ERROR_MESSAGE = 'No such user';
const USER_ALREADY_EXISTS = 'User with such email already exists';
const TOKEN_ALREADY_IN_BLACKLIST = 'Token is already in blacklist';
const NO_TOKEN_SESSION = 'No such token session';
const ONLY_ADMIN_ROLE = 'Only admin have access to this functionality';
const TOO_MANY_LOGIN_ATTEMPTS = 'You tried to login too many times';
const FORBIDDEN = 'This resource forbidden';

module.exports = {
  NO_USER_ERROR_MESSAGE,
  USER_ALREADY_EXISTS,
  TOKEN_ALREADY_IN_BLACKLIST,
  NO_TOKEN_SESSION,
  ONLY_ADMIN_ROLE,
  TOO_MANY_LOGIN_ATTEMPTS,
  FORBIDDEN
};
