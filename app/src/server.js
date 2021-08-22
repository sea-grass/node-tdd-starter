const express = require('express');
const App = require('./app');
const log = require('log');

const logger = log.get('server');

function start() {
    return new Promise((resolve) => {
        const server = express();
        const app = new App({
            pathPrefix: '/',
        });
        app.registerRoutes(server);
        
        server.listen(8080, () => {
            logger.info("server is now listening on port 8080");
            resolve(server);
        });
    });
}

module.exports = { start };