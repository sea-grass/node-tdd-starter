describe("App", () => {
  it("can be instantiated", () => {
    const App = require("./app");
    const instantiate = () => new App();
    expect(instantiate).not.toThrow();
  });

  describe(".registerRoutes()", () => {
    const App = require("./app");
    it("has the instance method", () => {
      const app = new App();

      expect(app.registerRoutes).toBeInstanceOf(Function);
    });

    it("calls `use` on its first argument", () => {
      const App = require("./app");
      const { __setMockApp } = require("express");
      const mockApp = __setMockApp();

      const app = new App();
      app.registerRoutes(mockApp);

      expect(mockApp.use).toHaveBeenCalledTimes(1);
    });

    it.each(["/", "/subpath", "/sub/subpath"])(
      "calls use with the specified pathPrefix (%s)",
      (pathPrefix) => {
        const App = require("./app");
        const { __setMockApp } = require("express");
        const mockApp = __setMockApp();

        const app = new App({ pathPrefix });
        app.registerRoutes(mockApp);

        const [path] = mockApp.use.mock.calls[0];
        expect(path).toEqual(pathPrefix);
      }
    );

    it("calls use with the express router", () => {
      const App = require("./app");
      const { __setMockRouter, __setMockApp } = require("express");
      const router = __setMockRouter();
      const mockApp = __setMockApp();

      const app = new App();
      app.registerRoutes(mockApp);

      const [, fn] = mockApp.use.mock.calls[0];
      expect(fn).toBe(router);
    });

    it("adds `get` routes to the express router", () => {
      const App = require("./app");
      const { __setMockRouter, __setMockApp } = require("express");
      const router = __setMockRouter();
      const mockApp = __setMockApp();

      const app = new App();
      app.registerRoutes(mockApp);

      expect(router.get).toHaveBeenCalled();
    });

    describe("routes", () => {
      describe("/", () => {
        it("sets the `text/html` Content-Type header", () => {
          const {
            __setMockRouter,
            __setMockApp,
            __createMockRes,
          } = require("express");
          const router = __setMockRouter();
          const mockApp = __setMockApp();
          const App = require("./app");
          const mockRes = __createMockRes();

          const app = new App();
          app.registerRoutes(mockApp);

          const [, fn] = router.get.mock.calls.find(([path]) => path === "/");
          fn(null, mockRes);

          expect(mockRes.set).toHaveBeenCalledWith("Content-Type", "text/html");
        });

        it("returns a 500 if there's a render error", () => {
          const {
            __setMockRouter,
            __setMockApp,
            __createMockRes,
          } = require("express");
          const router = __setMockRouter();
          const mockApp = __setMockApp();
          const App = require("./app");
          const mockRes = __createMockRes();

          const app = new App();
          app.registerRoutes(mockApp);

          const [, routeFn] = router.get.mock.calls.find(
            ([path]) => path === "/"
          );
          routeFn(null, mockRes);

          console.log(mockRes.render.mock.calls);
          const [, , callbackFn] = mockRes.render.mock.calls[0];
          callbackFn(new Error(), null);

          expect(mockRes.status).toHaveBeenCalledWith(500);
        });

        it("returns a 200", () => {
          const {
            __setMockRouter,
            __setMockApp,
            __createMockRes,
          } = require("express");
          const router = __setMockRouter();
          const mockApp = __setMockApp();
          const App = require("./app");
          const mockRes = __createMockRes();

          const app = new App();
          app.registerRoutes(mockApp);

          const [, routeFn] = router.get.mock.calls.find(
            ([path]) => path === "/"
          );
          routeFn(null, mockRes);

          console.log(mockRes.render.mock.calls);
          const [, , callbackFn] = mockRes.render.mock.calls[0];
          callbackFn(null, "some html");

          expect(mockRes.status).toHaveBeenCalledWith(200);
        });
      });
    });
  });
});
