const handler = {};

handler.notFoundHandler = (requestedProperties, callback) => {
    callback(404, {
        message: 'Your requested URL was not found',
    });
};
module.exports = handler;
