const Sequelize = require('sequelize');

const sequelizeInstance = require('../sequalize');
const Company = require('../company');

const CompanySender = sequelizeInstance.define('company_sender', {
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

module.exports = CompanySender;
