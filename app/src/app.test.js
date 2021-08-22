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

    it.each(["/", "/subpath", "/sub/subpath"])(
      "calls use with the specified pathPrefix (%s)",
      (pathPrefix) => {
        const App = require("./app");
        const { __setMockApp } = require("express");
        const mockApp = __setMockApp();

        const app = new App({ pathPrefix });
        app.registerRoutes(mockApp);

        expect(
          mockApp.use.mock.calls.find(([arg0]) => arg0 === pathPrefix)
        ).toBeTruthy();
      }
    );

    it("calls use with the express router", () => {
      const App = require("./app");
      const { __setMockRouter, __setMockApp } = require("express");
      const router = __setMockRouter();
      const mockApp = __setMockApp();

      const app = new App();
      app.registerRoutes(mockApp);

      expect(
        mockApp.use.mock.calls.find(([, arg1]) => arg1 === router)
      ).toBeTruthy();
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
            __createMockReq,
            __createMockRes,
          } = require("express");
          const router = __setMockRouter();
          const mockApp = __setMockApp();
          const App = require("./app");
          const mockReq = __createMockReq();
          const mockRes = __createMockRes();

          const app = new App();
          app.registerRoutes(mockApp);

          const [, routeFn] = router.get.mock.calls.find(
            ([path]) => path === "/"
          );
          routeFn(mockReq, mockRes);

          expect(mockRes.set).toHaveBeenCalledWith("Content-Type", "text/html");
        });

        it("returns a 500 if there's a render error", () => {
          const {
            __setMockRouter,
            __setMockApp,
            __createMockReq,
            __createMockRes,
          } = require("express");
          const router = __setMockRouter();
          const mockApp = __setMockApp();
          const App = require("./app");
          const mockReq = __createMockReq();
          const mockRes = __createMockRes();

          const app = new App();
          app.registerRoutes(mockApp);

          const [, routeFn] = router.get.mock.calls.find(
            ([path]) => path === "/"
          );
          routeFn(mockReq, mockRes);

          const [, , callbackFn] = mockRes.render.mock.calls[0];
          callbackFn(new Error(), null);

          expect(mockRes.status).toHaveBeenCalledWith(500);
        });

        it("returns a 200", () => {
          const {
            __setMockRouter,
            __setMockApp,
            __createMockReq,
            __createMockRes,
          } = require("express");
          const router = __setMockRouter();
          const mockApp = __setMockApp();
          const App = require("./app");
          const mockReq = __createMockReq();
          const mockRes = __createMockRes();

          const app = new App();
          app.registerRoutes(mockApp);

          const [, routeFn] = router.get.mock.calls.find(
            ([path]) => path === "/"
          );
          routeFn(mockReq, mockRes);

          const [, , callbackFn] = mockRes.render.mock.calls[0];
          callbackFn(null, "some html");

          expect(mockRes.status).toHaveBeenCalledWith(200);
        });

        it("gracefully handles a minification error", () => {
          const {
            __setMockRouter,
            __setMockApp,
            __createMockReq,
            __createMockRes,
          } = require("express");
          const { __setMockMinify } = require("html-minifier");
          const router = __setMockRouter();
          const mockApp = __setMockApp();
          const minify = jest.fn().mockImplementation(() => {
            throw new Error("Some minifier error");
          });
          __setMockMinify(minify);
          const App = require("./app");
          const mockReq = __createMockReq();
          const mockRes = __createMockRes();

          const app = new App();
          app.registerRoutes(mockApp);

          const [, routeFn] = router.get.mock.calls.find(
            ([path]) => path === "/"
          );
          routeFn(mockReq, mockRes);

          const [, , callbackFn] = mockRes.render.mock.calls[0];
          callbackFn(null, "some html");

          expect(mockRes.status).toHaveBeenCalledWith(200);
        });
      });
      describe("/products", () => {
        it("sets the `text/html` Content-Type header", () => {
          const {
            __setMockRouter,
            __setMockApp,
            __createMockReq,
            __createMockRes,
          } = require("express");
          const router = __setMockRouter();
          const mockApp = __setMockApp();
          const App = require("./app");
          const mockReq = __createMockReq();
          const mockRes = __createMockRes();

          const app = new App();
          app.registerRoutes(mockApp);

          const [, fn] = router.get.mock.calls.find(
            ([path]) => path === "/products"
          );
          fn(mockReq, mockRes);

          expect(mockRes.set).toHaveBeenCalledWith("Content-Type", "text/html");
        });
      });
      describe("/cart/add", () => {
        it("renders the cart template", () => {
          const {
            __setMockRouter,
            __setMockApp,
            __createMockReq,
            __createMockRes,
          } = require("express");
          const router = __setMockRouter();
          const mockApp = __setMockApp();
          const App = require("./app");
          const mockReq = __createMockReq({
            params: {
              productId: "foo",
            },
          });
          const mockRes = __createMockRes();

          const app = new App();
          app.registerRoutes(mockApp);

          const [, fn] = router.post.mock.calls.find(([path]) =>
            path.startsWith("/cart/add")
          );
          fn(mockReq, mockRes);

          expect(mockRes.render).toHaveBeenCalledTimes(1);
          expect(mockRes.render.mock.calls[0][0]).toBe("cart");
        });

        it("adds the productId to the cart", () => {
          const productId = "foo";
          const {
            __setMockRouter,
            __setMockApp,
            __createMockReq,
            __createMockRes,
          } = require("express");
          const router = __setMockRouter();
          const mockApp = __setMockApp();
          const App = require("./app");
          const mockReq = __createMockReq({
            params: {
              productId,
            },
            session: { cart: undefined },
          });
          const mockRes = __createMockRes();

          const app = new App();
          app.registerRoutes(mockApp);

          const [, fn] = router.post.mock.calls.find(([path]) =>
            path.startsWith("/cart/add")
          );
          fn(mockReq, mockRes);

          expect(mockReq.session.cart).toHaveProperty(productId);
        });
      });

      describe("/cart/remove", () => {
        it("renders the cart template", () => {
          const {
            __setMockRouter,
            __setMockApp,
            __createMockReq,
            __createMockRes,
          } = require("express");
          const router = __setMockRouter();
          const mockApp = __setMockApp();
          const App = require("./app");
          const mockReq = __createMockReq({
            params: {
              productId: "foo",
            },
          });
          const mockRes = __createMockRes();

          const app = new App();
          app.registerRoutes(mockApp);

          const [, fn] = router.post.mock.calls.find(([path]) =>
            path.startsWith("/cart/remove")
          );
          fn(mockReq, mockRes);

          expect(mockRes.render).toHaveBeenCalledTimes(1);
          expect(mockRes.render.mock.calls[0][0]).toBe("cart");
        });
      });
    });
  });
});
