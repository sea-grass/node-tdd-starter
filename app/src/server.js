const express = require('express');
const App = require('./app');

const server = express();
const app = new App();
server.use('/', app.router);

server.listen(8080, () => {
    console.log("server is now listening on port 8080");
});