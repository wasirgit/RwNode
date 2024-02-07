const handler = {};

handler.sampleHandler = (requestedProperties, callback) => {
    callback(200, {
        message: 'this is a sample url',
    });
};
module.exports = handler;
