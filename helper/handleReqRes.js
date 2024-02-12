const { StringDecoder } = require('string_decoder');
const url = require('url');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeshandlers/notfoundHandler');
const utilities = require('./utilities');

const handler = {};
handler.handleReqRes = (req, res) => {
    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;
    const decoratedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();

    const queryStringObject = parseUrl.query;


    const headerObject = req.headers;
    const decoder = new StringDecoder('utf-8');

    const requestedProperties = {
        parseUrl,
        path,
        decoratedPath,
        method,
        queryStringObject,
        headerObject,
    };
    console.log(`Request path: ${decoratedPath} Method: ${method} ${headerObject}`);

    const respectiveHandler = routes[decoratedPath] ? routes[decoratedPath] : notFoundHandler;
    let realData = '';
    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });  
    req.on('end', () => {
        realData += decoder.end();
        requestedProperties.body = utilities.parseJSON(realData);
        respectiveHandler(requestedProperties, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};
            const payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
};

module.exports = handler;
