const express = jest.fn();
const mockApp = {
    use: jest.fn(),
    listen: jest.fn().mockImplementation((port, callback) => callback()),
};
express.mockImplementation(() => mockApp);

module.exports = express;
module.exports.mockApp = mockApp;