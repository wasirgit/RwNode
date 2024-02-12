const { sampleHandler } = require('./handlers/routeshandlers/samplehandler');
const { userHandler } = require('./handlers/routeshandlers/userHandler');
const { tokenHandler } = require('./handlers/routeshandlers/tokenHandler');

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
};

module.exports = routes;
