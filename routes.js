const { sampleHandler } = require("./handlers/routeshandlers/samplehandler");
const { userHandler } = require("./handlers/routeshandlers/userHandler");
const { tokenHandler } = require("./handlers/routeshandlers/tokenHandler");
const { logoutHandler } = require("./handlers/routeshandlers/logoutHandler");

const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
  logout: logoutHandler,
};

module.exports = routes;
