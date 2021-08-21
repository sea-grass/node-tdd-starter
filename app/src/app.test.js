const App = require("./app");

describe('App', () => {
    it('can be instantiated', () => {
        const instantiate = () => new App();
        expect(instantiate).not.toThrow();
    });

    describe('.registerRoutes()', () => {
        it('has the instance method', () => {
            const app = new App();
            
            expect(app.registerRoutes).toBeInstanceOf(Function);
        });

        it('calls `use` on its first argument', () => {
            const spy = jest.fn();

            const app = new App();
            app.registerRoutes({ use: spy });

            expect(spy).toHaveBeenCalledTimes(1);
        });

        it.each(['/', '/subpath', '/sub/subpath'])('calls use with the specified pathPrefix (%s)', (pathPrefix) => {
            const spy = jest.fn();

            const app = new App({ pathPrefix });
            app.registerRoutes({ use: spy });

            const [path] = spy.mock.calls[0];
            expect(path).toEqual(pathPrefix);
        });

        it('calls use with a function', () => {
            const spy = jest.fn();

            const app = new App();
            app.registerRoutes({ use: spy });

            const [,fn] = spy.mock.calls[0];
            expect(fn).toBeInstanceOf(Function);
        });
    });
})