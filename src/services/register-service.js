const errors = require('@feathersjs/errors');

const User = require('../models/user');
const Company = require('../models/company');
const CompanySender = require('../models/sender/company-sender');
const CompanyCarrier = require('../models/carrier/company-carrier');
const encodingService = require('../utils/encoding-utils');
const sessionUtils = require('../utils/session-utils');
const validator = require('../utils/validator');
const responseMessages = require('../config/response-messages');
const config = require('../config/config');
const userRoles = require('../config/user-roles');

const { companyTypes } = config;

// todo add sentry everywhere
// TODO rework docs
const registerService = {
  create (data, params) {
    return new Promise(async (resolve, reject) => {
      const userInfo = {
        ...data.body
      };
      const userValidationError = validator.validateUser(userInfo);
      if (userValidationError) {
        return reject(new errors.BadRequest(userValidationError));
      }
      const headers = {
        userAgent: data.headers[config.USER_AGENT_HEADER]
      }
      const headersValidationError = validator.validateRequestHeaders(headers);
      if (headersValidationError) {
        return reject(new errors.BadRequest(headersValidationError));
      }
      const existingUser = await User.findOne({ where: { email: userInfo.email } });
      if (existingUser) {
        return reject(new errors.BadRequest(responseMessages.USER_ALREADY_EXISTS));
      }
      let company;
      try {
        company = await Company.create(userInfo.company);
        const parentId = company.dataValues.id;
        if (company.dataValues.type === companyTypes.COMPANY_SENDER) {
          await CompanySender.create({ parentId });
          userInfo.role = userRoles.SENDER_ADMIN;
        } else {
          await CompanyCarrier.create({ parentId });
          userInfo.role = userRoles.CARRIER_ADMIN;
        }
      } catch (error) {
        return reject(new errors.GeneralError(error));
      }
      let user;
      try {
        userInfo.hashPassword = encodingService.hash(userInfo.password);
        delete userInfo.password;
        user = await User.create(userInfo);
      } catch (error) {
        return reject(new errors.GeneralError(error));
      }

      try {
        const privateKeyPath = data.app.get('privateKey');
        const token = await sessionUtils.createSession(user.dataValues, data.headers, privateKeyPath);
        const tokenResponse = { token };
        return resolve(tokenResponse);
      } catch (err) {
        return reject(err);
      }
    });
  }
}

module.exports = registerService;
