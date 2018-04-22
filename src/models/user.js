const Sequelize = require('sequelize');

const sequelizeInstance = require('./sequalize');
const encodingUtils = require('../utils/encoding-utils');
const lockingConfig = require('../config/locking-config');
const statuses = require('../config/statuses');
const userRoles = require('../config/user-roles');
const Company = require('./company');

const User = sequelizeInstance.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  fullName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  hashPassword: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: Sequelize.STRING,
    allowNull: false
  },
  avatarUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lockUntil: {
    type: Sequelize.INTEGER
  },
  role: {
    type: Sequelize.ENUM(
      userRoles.CARRIER_ADMIN,
      userRoles.CARRIER_REGULAR,
      userRoles.SENDER_ADMIN,
      userRoles.SENDER_REGULAR
    ),
    allowNull: false
  },
  lastLogonAt: {
    type: Sequelize.DATE
  },
  status: {
    type: Sequelize.ENUM(
      statuses.ACTIVE,
      statuses.PENDING,
      statuses.BLOCKED
    ),
    defaultValue: statuses.PENDING
  },
  loginAttempts: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  company: {
    type: Sequelize.INTEGER,
    required: true,
    references: {
      model: Company,
      key: 'id',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  },
  lockedUntil: {
    type: Sequelize.DATE
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Date.now()
  }
});

User.prototype.isLocked = function () {
  return this.lockedUntil && Date.now() < this.lockedUntil;
};

User.prototype.checkLoginAttempt = async function (candidatePassword) {
  const candidatePasswordHash = encodingUtils.hash(candidatePassword);
  const isPasswordCorrect = candidatePasswordHash === this.hashPassword;
  if (!isPasswordCorrect) {
    this.loginAttempts++;
    if (this.loginAttempts >= lockingConfig.MAX_LOGIN_ATTEMPTS) {
      const now = new Date();
      this.lockedUntil = now.setMinutes(now.getMinutes() + lockingConfig.LOCK_TIME_MINUTES);
      this.loginAttempts = 0;
    }
  } else {
    this.loginAttempts = 0;
  }
  await this.save();
  return isPasswordCorrect;
};

module.exports = User;
