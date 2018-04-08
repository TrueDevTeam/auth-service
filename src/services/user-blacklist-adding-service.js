const errors = require('@feathersjs/errors');

const blacklist = require('../models/blacklist');
const UserSession = require('../models/user-session');
const User = require('../models/user');
const responseMessages = require('../config/response-messages');
const statuses = require('../config/statuses');

//todo add code docs
const userBlacklistService = {
  update (id, data, params) {
    return new Promise(async (resolve, reject) => {
      const user = await User.findOne({ _id: id });
      if (!user) {
        return reject(new errors.NotFound(responseMessages.NO_USER_ERROR_MESSAGE));
      }
      user.status = statuses.BLOCKED;
      await user.save();
      await UserSession.update({
        user: user._id
      }, {
        $set: { isBlocked: true }
      }, {
        multi: true
      });
      const userSessions = await UserSession.find({ user: user._id });
      userSessions.forEach(async session => {
        await blacklist.add(session.tokenHash);
      });
      resolve(user.toObject());
    });
  }
}

module.exports = userBlacklistService;
