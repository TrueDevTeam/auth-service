const Sequelize = require('sequelize');

const sequelizeInstance = require('../sequalize');
const Company = require('../company');

const CompanyCarrier = sequelizeInstance.define('company_carrier', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  parentId: {
    type: Sequelize.INTEGER,
    required: true,
    references: {
      model: Company,
      key: 'id',
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  }
});

module.exports = CompanyCarrier;
