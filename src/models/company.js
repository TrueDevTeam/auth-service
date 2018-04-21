const Sequelize = require('sequelize');

const config = require('../config/config');
const sequelizeInstance = require('./sequalize');

const { companyTypes } = config;

const Company = sequelizeInstance.define('company', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    isIn: [companyTypes.COMPANY_SENDER, companyTypes.COMPANY_CARRIER]
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Company;
