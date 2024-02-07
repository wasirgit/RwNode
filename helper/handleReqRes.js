const { StringDecoder } = require('string_decoder');
const url = require('url');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeshandlers/notfoundHandler');

const handler = {};
handler.handleReqRes = (req, res) => {
    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;
    const decoratedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();

    const queryStringObject = parseUrl.query;
    console.log(`${decoratedPath}${method} `);

    const headerObject = req.headers;
    console.log(headerObject);
    const decoder = new StringDecoder('utf-8');

    const requestedProperties = {
        parseUrl,
        path,
        decoratedPath,
        method,
        queryStringObject,
        headerObject,
    };
    const respectiveHandler = routes[decoratedPath] ? routes[decoratedPath] : notFoundHandler;
    let realData = '';
    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });
    req.on('end', () => {
        realData += decoder.end();
        respectiveHandler(requestedProperties, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};
            const payloadString = JSON.stringify(payload);

            res.writeHead(statusCode);
            res.end(payloadString);
        });
        res.end('Hello World');
    });
};

module.exports = handler;
