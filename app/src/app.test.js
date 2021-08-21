describe('App', () => {
    it('can be instantiated', () => {
        const App = require("./app");
        const instantiate = () => new App();
        expect(instantiate).not.toThrow();
    });

    describe('.registerRoutes()', () => {
        const App = require("./app");
        it('has the instance method', () => {
            const app = new App();
            
            expect(app.registerRoutes).toBeInstanceOf(Function);
        });

        it('calls `use` on its first argument', () => {
            const App = require("./app");
            const spy = jest.fn();

            const app = new App();
            app.registerRoutes({ use: spy });

            expect(spy).toHaveBeenCalledTimes(1);
        });

        it.each(['/', '/subpath', '/sub/subpath'])('calls use with the specified pathPrefix (%s)', (pathPrefix) => {
            const App = require("./app");
            const spy = jest.fn();

            const app = new App({ pathPrefix });
            app.registerRoutes({ use: spy });

            const [path] = spy.mock.calls[0];
            expect(path).toEqual(pathPrefix);
        });

        it('calls use with the express router', () => {
            const App = require("./app");
            const { __setMockRouter } = require('express');
            const router = __setMockRouter();
            const spy = jest.fn();

            const app = new App();
            app.registerRoutes({ use: spy });

            const [,fn] = spy.mock.calls[0];
            expect(fn).toBe(router);
        });

        it('adds `get` routes to the express router', () => {
            const App = require('./app');
            const { __setMockRouter } = require('express');
            const router =  __setMockRouter();
            
            const app = new App();
            app.registerRoutes({ use: jest.fn() });

            expect(router.get).toHaveBeenCalled();
        });

        it('its root route sets the `text/html` Content-Type header', () => {
            const App = require('./app');
            const { __setMockRouter } = require('express');
            const router =  __setMockRouter();
            const resSet = jest.fn();
            
            const app = new App();
            app.registerRoutes({ use: jest.fn() });
            
            const [,fn] = router.get.mock.calls.find(([path]) => path === '/');
            fn(null, { set: resSet, end: jest.fn() });
            
            expect(resSet).toHaveBeenCalledWith('Content-Type', 'text/html');
        });
    });
})