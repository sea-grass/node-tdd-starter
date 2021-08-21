describe('logger.js', () => {
    it('exports an `info` logging function', () => {
        const { info } = require('./logger');

        expect(() => info()).not.toThrow();
    });
})