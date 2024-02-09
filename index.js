// dependency
const http = require('http');
const { handleReqRes } = require('./helper/handleReqRes');
const envSettings = require('./helper/envSettings');
const data = require('./lib/data');

// app object

const app = {};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);

    server.listen(envSettings.port, () => {
        console.log(`${envSettings.envName} server is running on ${envSettings.port} port`);
    });
};

app.handleReqRes = handleReqRes;

app.createServer();
