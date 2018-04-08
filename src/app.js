const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const rest = require('@feathersjs/express/rest');
const cors = require('cors');
const configuration = require('@feathersjs/configuration');
const handler = require('@feathersjs/errors/handler');
const notFound = require('@feathersjs/errors/not-found');
const swagger = require('feathers-swagger');

const sequelizeInstance = require('./models/sequalize');
const appHooks = require('./app.hooks');
const authService = require('./services/auth-service');
const registerService = require('./services/register-service');
const blacklistService = require('./services/blacklist-service');
const rolesService = require('./services/roles-service');
const userBlacklistAddingService = require('./services/user-blacklist-adding-service');
const userBlacklistRemovingService = require('./services/user-blacklist-removing-service');
const requestExtenderMiddleware = require('./middleware/request-extender');
const rootAdminAccess = require('./middleware/root-admin-access');
const servicesDocs = require('./docs');

sequelizeInstance.sync();
const app = express(feathers());

app.configure(configuration());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.configure(rest());

authService.docs = servicesDocs.authService;
blacklistService.docs = servicesDocs.blacklistService;
userBlacklistAddingService.docs = servicesDocs.userBlacklistAddingService;
userBlacklistRemovingService.docs = servicesDocs.userBlacklistRemovingService;
registerService.docs = servicesDocs.registerService;
rolesService.docs = servicesDocs.rolesService;

app.configure(swagger({
  docsPath: '/docs',
  uiIndex: true,
  info: servicesDocs.restApi
}));

app.use(requestExtenderMiddleware);
app.use('/blacklist/users/add', rootAdminAccess);
app.use('/blacklist/users/remove', rootAdminAccess);
app.use('/blacklist', rootAdminAccess);
app.use('/roles', rootAdminAccess);

app.use('/login', authService);
app.use('/register', registerService);
app.use('/blacklist/users/add', userBlacklistAddingService);
app.use('/blacklist/users/remove', userBlacklistRemovingService);
app.use('/blacklist', blacklistService);
app.use('/roles', rolesService);

app.use(notFound());
app.use(handler());

app.hooks(appHooks);

module.exports = app;
