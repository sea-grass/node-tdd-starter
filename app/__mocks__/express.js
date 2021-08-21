const express = jest.fn();
const mockApp = {
    use: jest.fn(),
    listen: jest.fn().mockImplementation((_, callback) => callback()),
};
express.mockImplementation(() => mockApp);

const createMockRouter = () => ({
    get: jest.fn(),
});
express.Router = jest.fn().mockImplementation(createMockRouter);

module.exports = express;
module.exports.mockApp = mockApp;
module.exports.__createMockRouter = createMockRouter;
module.exports.__setMockRouter = (impl) => {
    // Allow testers to just use a default mock implementation
    if (impl === undefined) { impl = createMockRouter(); }
    express.Router.mockReturnValue(impl);
    // Returning their parameter allows testers to write e.g. `const router = __setMockRouter();`
    return impl;
};