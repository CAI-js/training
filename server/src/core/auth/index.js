const configurePassport = require('./passport-config');
const ensureAuthenticated = require('./ensure-authenticated');

module.exports = {
  configurePassport,
  ensureAuthenticated,
};
