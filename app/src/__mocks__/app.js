let mockInstance = {
    registerRoutes: jest.fn()
};

module.exports = jest.fn().mockReturnValue(mockInstance);
module.exports.mockInstance = mockInstance;