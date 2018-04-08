const roles = require('../config/user-roles');

// todo rework
const hasRoles = (user, expectedRoles) => {
  if (!user || !user.roles) {
    return false;
  }
  const userRoles = user.roles;
  const rolesIntersection = new Set(
    userRoles.filter(role => expectedRoles.includes(role))
  );
  return rolesIntersection.size > 0;
}

const isRootAdmin = (user) => {
  return hasRoles(user, [ roles.CARRIER_ADMIN, roles.SENDER_ADMIN ]);
}

module.exports = {
  hasRoles,
  isRootAdmin
};
