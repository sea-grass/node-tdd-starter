const server = require('./server');
const { initLogWriting } = require('./logger');
process.env.LOG_LEVEL = 'debug';
initLogWriting();
server.start();