const assert = require('assert');

const User = require('../src/models/user');
const encodingUtils = require('../src/utils/encoding-utils');
const lockingConfig = require('../src/config/locking-config');

describe('User model', () => {
  describe('Checking login attempt', () => {
    it('user with login attempts less or equal than max allowed number and correct password should be passed', () => {
      const candidatePassword = 'any string';
      const user = new User({
        hashPassword: encodingUtils.hash(candidatePassword),
        loginAttempts: lockingConfig.MAX_LOGIN_ATTEMPTS - 1
      });
      assert.ok(user.checkLoginAttempt(candidatePassword));
    })
    it(`user with login attempts becoming greater than max should be locked`, () => {
      const candidatePassword = 'any string';
      const user = new User({
        hashPassword: encodingUtils.hash(candidatePassword),
        loginAttempts: lockingConfig.MAX_LOGIN_ATTEMPTS
      });
      user.checkLoginAttempt('wrong password');
      assert.ok(Date.now() < +user.lockedUntil);
    })
    it(`user's loginAttempts should be cleared while
     login attempts > 0 and <=  max allowed number and password is correct`,
      () => {
        const candidatePassword = 'any string';
        const user = new User({
          hashPassword: encodingUtils.hash(candidatePassword),
          loginAttempts: lockingConfig.MAX_LOGIN_ATTEMPTS
        });
        user.checkLoginAttempt(candidatePassword);
        assert.equal(user.loginAttempts, 0);
      })
  });
});
