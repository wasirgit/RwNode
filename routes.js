const { sampleHandler } = require('./handlers/routeshandlers/samplehandler');
const { userHandler } = require('./handlers/routeshandlers/userHandler');

const routes = {
    sample: sampleHandler,
    user: userHandler,
};

module.exports = routes;
