const { mockApp } = require('express');

jest.mock('./logger');

describe('server.js', () => {
    it('starts an express server', () => {
        const startServer = require('./server').start;

        return startServer().then(() => {
            expect(mockApp.listen).toHaveBeenCalledTimes(1);
        });
    });

    it('logs a message when the server has started', () => {
        const logger = require('./logger');
        const startServer = require('./server').start;

        return startServer().then(() => {
            expect(logger.info).toHaveBeenCalled();
        });
    })

    it.todo('mounts app\'s router onto the express server');
})