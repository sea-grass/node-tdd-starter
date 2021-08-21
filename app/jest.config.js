// jest.config.js

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
    verbose: true,
    // By default, don't output coverage info. Can be overridden by the `--coverage` CLI flag
    collectCoverage: false,
    collectCoverageFrom: [
        "src/**/*.js",
        "!**/node_modules/**",
        "!src/**/*.test.js",
    ],
  };
  
module.exports = config;