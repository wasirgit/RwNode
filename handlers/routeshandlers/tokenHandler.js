const data = require('../../lib/data');
const { hash, parseJSON, createRandomString } = require('../../helper/utilities');

const handler = {};

handler.tokenHandler = (requestedProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestedProperties.method) > -1) {
        handler.token[requestedProperties.method](requestedProperties, callback);
    } else {
        callback(405);
    }
};

handler.token = {};

handler.token.post = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.body.phone === 'string'
        && requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const password =
        typeof requestProperties.body.password === 'string'
        && requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;

    if (phone && password) {
        data.read('users', phone, (error, userData) => {
            if (!error && userData) {
                const user = parseJSON(userData);
                const hashedPassFromUser = hash(password);
                const hashedpassFromDb = user.password;
                if (hashedPassFromUser === hashedpassFromDb) {
                    const tokenId = createRandomString(20);
                    const expires = Date.now() + 60 * 60 * 1000;
                    const tokenObject = {
                        phone,
                        tokenId,
                        expires
                    };
                    data.create('tokens', tokenId, tokenObject, (err) => {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {
                                error: 'There was a problem in the server side!',
                            });
                        }
                    });
                }else {
                    callback(400, {
                        error: 'Password is not correct',
                    });
                }
            } 
        });
    } else {
        callback(400, {
            error: 'Please check your request. ',
        });
    }
};
handler.token.get = (requestedProperties, callback) => {};
handler.token.put = (requestedProperties, callback) => {};
handler.token.delete = (requestedProperties, callback) => {};

module.exports = handler;
