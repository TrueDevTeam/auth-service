const assert = require('assert');

const encodingUtils = require('../src/utils/encoding-utils');

describe('Encoding utils', () => {
  const privateKeyPath = '/.ssh/jwtRS256.key';
  const publicKeyPath = '/.ssh/jwtRS256.key.pub';
  const user = {
    email: 'h@a.com',
    company: 'Google'
  };
  const sessionInfo = {
    userAgent: 'Chrome',
    loggedAt: `2015-03-25`
  };
  const decodedToken = {
    email: 'h@a.com',
    company: 'Google',
    userAgent: 'Chrome',
    loggedAt: `2015-03-25`,
    companyId: 'Google'
  }

  describe('Token generation', () => {
    it('should generate token without errors', async () => {
      await encodingUtils.generateToken(user, sessionInfo, privateKeyPath);
    });
    it('should generate token which type is String', async () => {
      const { token } = await encodingUtils.generateToken(user, sessionInfo, privateKeyPath);
      assert.ok(typeof token === 'string');
    });
  });

  describe('Token verification', () => {
    it('should generate token without errors', async () => {
      const { token } = await encodingUtils.generateToken(user, sessionInfo, privateKeyPath);
      await encodingUtils.verify(token, publicKeyPath);
    });
    it('decoded data should be correct', async () => {
      const { token } = await encodingUtils.generateToken(user, sessionInfo, privateKeyPath);
      const actualDecodedData = await encodingUtils.verify(token, publicKeyPath);
      assert.equal(actualDecodedData.email, decodedToken.email);
      assert.equal(actualDecodedData.userAgent, decodedToken.userAgent);
      assert.equal(actualDecodedData.loggedAt, decodedToken.loggedAt);
      assert.equal(actualDecodedData.companyId, decodedToken.companyId);
      // As suggested in the JWT spec, a timestamp called iat (issued at) is installed.
      assert.ok(!!actualDecodedData.iat);
      assert.equal(Object.keys(actualDecodedData).length, 5);
    });
  });
  describe('String hashing', () => {
    it('should hash string without errors', async () => {
      encodingUtils.hash('any string');
    });
    it('should hash string correctly (sha512 algorithm)', async () => {
      const expectedHashedString =
        'eAOxU8elfcuVTS5wjuNQKsxWpPjp9yP8eVe2037/CygRklmBliUqMx2lg2mN+EI1ef0MdELPDmgLgZk4OfCthQ==';
      assert.equal(encodingUtils.hash('any string'), expectedHashedString);
    });
  });
});
