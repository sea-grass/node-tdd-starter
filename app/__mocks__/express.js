const express = jest.fn();
express.Router = jest.fn();
express.static = jest.fn();

const createMockApp = () => ({
  use: jest.fn(),
  listen: jest.fn().mockImplementation((_, callback) => callback()),
  engine: jest.fn(),
  set: jest.fn(),
});
express.mockImplementation(createMockApp);

const createMockRouter = () => ({
  get: jest.fn(),
  use: jest.fn(),
});
express.Router.mockImplementation(createMockRouter);

const createMockRes = () => ({
  status: jest.fn(),
  set: jest.fn(),
  send: jest.fn(),
  end: jest.fn(),
  render: jest.fn(),
});

module.exports = express;
module.exports.__createMockApp = createMockApp;
module.exports.__setMockApp = (impl) => {
  // Allow testers to just use a default mock implementation
  impl = {
    ...createMockApp(),
    ...impl,
  };
  express.mockReturnValue(impl);
  // Returning their parameter allows testers to write e.g. `const router = __setMockRouter();`
  return impl;
};

module.exports.__createMockRouter = createMockRouter;
module.exports.__setMockRouter = (impl) => {
  // Allow testers to just use a default mock implementation
  impl = {
    ...createMockRouter(),
    ...impl,
  };
  express.Router.mockReturnValue(impl);
  // Returning their parameter allows testers to write e.g. `const router = __setMockRouter();`
  return impl;
};

module.exports.__createMockRes = createMockRes;
