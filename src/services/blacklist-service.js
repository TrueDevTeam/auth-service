const errors = require('@feathersjs/errors');

const blacklist = require('../models/blacklist');
const UserSession = require('../models/user-session');
const responseMessages = require('../config/response-messages');

const blackListService = {
  create (data, params) {
    return new Promise(async (resolve, reject) => {
      const tokenHash = data.body.tokenHash;
      const session = await UserSession.findOne({ tokenHash });
      if (!session) {
        return reject(new errors.NotFound(responseMessages.NO_TOKEN_SESSION));
      }
      await blacklist.add(tokenHash);
      session.isBlocked = true;
      await session.save();
      return resolve({deactivated: tokenHash});
    });
  },
  update (id, data, params) {
    return new Promise(async (resolve, reject) => {
      const tokenHash = data.body.tokenHash;
      const session = await UserSession.findOne({ tokenHash });
      if (!session) {
        return reject(new errors.NotFound(responseMessages.NO_TOKEN_SESSION));
      }
      await blacklist.remove(tokenHash);
      session.isBlocked = false;
      await session.save();
      return resolve({activated: tokenHash});
    });
  }
}

module.exports = blackListService;
