const express = require('express');

const defaultOptions = {
};

class App {
    constructor(options) {
        options = {
            ...defaultOptions,
            ...options
        };
        this.pathPrefix = options.pathPrefix;
    }
    registerRoutes(expressApp) {
        const router = express.Router();
        expressApp.use(this.pathPrefix, router);
    }
}

module.exports = App;