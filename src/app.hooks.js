const logger = require('./hooks/logger');

const local = require('@feathersjs/authentication-local');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      local.hooks.protect('password'),
      local.hooks.protect('pin'),
      local.hooks.protect('__v'),
      local.hooks.protect('loginAttempts'),
      logger()
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
