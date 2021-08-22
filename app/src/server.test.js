jest.mock("./app");

describe("server.js", () => {
  it("starts an express server", () => {
    const { __setMockApp } = require("express");
    const startServer = require("./server").start;

    const mockApp = __setMockApp();

    return startServer().then(() => {
      expect(mockApp.listen).toHaveBeenCalledTimes(1);
    });
  });

  it("resolves when the server has started", () => {
    const startServer = require("./server").start;

    return startServer().then(() => expect(true));
  });

  it("mounts app's router onto the express server", () => {
    const { mockInstance } = require("./app");
    const startServer = require("./server").start;

    return startServer().then(() => {
      expect(mockInstance.registerRoutes).toHaveBeenCalledTimes(1);
    });
  });
});
