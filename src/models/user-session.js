const Sequelize = require('sequelize');

const sequelizeInstance = require('./sequalize');
const User = require('./user');

const UserSession = sequelizeInstance.define('userSession', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user: {
    type: Sequelize.INTEGER,
    required: true,
    references: {
      model: User,
      key: 'id',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  },
  userAgent: {
    type: Sequelize.STRING,
    allowNull: false
  },
  loggedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Date.now()
  },
  isBlocked: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  tokenHash: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = UserSession;
