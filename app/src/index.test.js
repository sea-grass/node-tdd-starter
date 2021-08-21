describe('index.js', () => {
    it('starts the server', () => {
        jest.mock('./server');
        const { start } = require('./server');
        const run = () => require('./index');

        run();
        expect(start).toHaveBeenCalledTimes(1);
    });
})