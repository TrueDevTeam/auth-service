const errors = require('@feathersjs/errors');

const User = require('../models/user');
const responseMessages = require('../config/response-messages');
const validator = require('../utils/validator');

const rolesService = {
  update (id, data, params) {
    return new Promise(async (resolve, reject) => {
      const user = await User.findOne({ _id: id });
      if (!user) {
        return reject(new errors.BadRequest(responseMessages.NO_USER_ERROR_MESSAGE));
      }
      const validationError = validator.validateRolesRequest(data.body);
      if (validationError) {
        return reject(new errors.BadRequest(validationError));
      }
      user.roles = data.body.roles;
      await user.save();
      return resolve(user.toObject());
    });
  }
}

module.exports = rolesService;
