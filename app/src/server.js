const express = require('express');
const App = require('./app');
const logger = require('./logger');

function start() {
    return new Promise((resolve) => {
        const server = express();
        const app = new App();
        server.use('/', app.router);
        
        server.listen(8080, () => {
            logger.info("server is now listening on port 8080");
            resolve(server);
        });
    });
}

module.exports = { start };