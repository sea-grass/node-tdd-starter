const server = require("./server");
const { initLogWriting } = require("./logger");
process.env.LOG_LEVEL = "info";
initLogWriting();
server.start();
