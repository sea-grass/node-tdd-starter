const express = require("express");
const bodyParser = require("body-parser");
const cons = require("consolidate");
const path = require("path");
const { minify } = require("html-minifier");
const logger = require("log").get("app");
const sqlite = require("better-sqlite3");
const session = require("express-session");
const SqliteStore = require("better-sqlite3-session-store")(session);
const db = new sqlite(
  path.resolve(__dirname, "../__app_data__", "sessions.db"),
  { verbose: logger.get("sqlite").get("sessions").debug }
);

const defaultOptions = {};
let error;

const products = [
  { id: "foo", name: "Foo" },
  { id: "bar", name: "Bar" },
  { id: "baz", name: "Baz" },
];

const getCart = (session) => {
  let { cart = {} } = session;

  return cart;
};

const handleRenderResponse = (res) => (renderError, html) => {
  if (renderError) {
    const meaningfulSourceErrorStack = renderError.stack.substr(
      0,
      renderError.stack.indexOf("at eval (eval")
    );
    error.stack = meaningfulSourceErrorStack;
    error.message = renderError.message;
    logger.get("handlerenderresponse").error(error);
    res.status(500);
    res.end("oop");
  } else {
    let minifiedHtml;
    try {
      minifiedHtml = minify(html, {
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
      });
    } catch (minifyError) {
      logger.error(minifyError);
      error.message = minifyError.message;
      logger.error(error);
      minifiedHtml = html;
    }
    res.status(200);
    res.send(minifiedHtml);
    res.end();
  }
};

class App {
  constructor(options) {
    options = {
      ...defaultOptions,
      ...options,
    };
    this.pathPrefix = options.pathPrefix;
  }
  registerRoutes(expressApp) {
    expressApp.engine("html", cons.qejs);
    expressApp.set("view engine", "html");
    expressApp.set("views", path.resolve(__dirname, "app/views"));
    const router = express.Router();
    router.use("/", express.static(path.resolve(__dirname, "../public")));

    expressApp.use(
      session({
        store: new SqliteStore({
          client: db,
          expired: {
            clear: true,
            intervalMs: 900_000,
          },
        }),
        secret: "so so soooo secret",
        resave: false,
      })
    );

    expressApp.use(bodyParser.urlencoded({ extended: true }));

    router.get("/", (req, res) => {
      error = new Error();
      const cart = getCart(req.session);
      const cartItems = Object.keys(cart);
      res.set("Content-Type", "text/html");
      res.render(
        "index",
        { title: "App Title", cart: cartItems },
        handleRenderResponse(res)
      );
    });

    router.get("/products", (_, res) => {
      res.status(200);
      res.set("Content-Type", "text/html");
      res.render("products", { products }, handleRenderResponse(res));
    });

    router.post("/cart/add/:productId", (req, res) => {
      const cart = getCart(req.session);
      const cartItems = Object.keys(cart);

      const { productId } = req.params;
      cart[productId] = "true";
      req.session.cart = cart;
      logger.info("rendering cart with cart", cart);
      res.render("cart", { cart: cartItems }, handleRenderResponse(res));
    });

    router.post("/cart/remove/:productId", (req, res) => {
      const cart = getCart(req.session);
      const cartItems = Object.keys(cart);

      const { productId } = req.params;
      delete cart[productId];
      req.session.cart = cart;
      res.render("cart", { cart: cartItems }, handleRenderResponse(res));
    });

    expressApp.use(this.pathPrefix, router);
  }
}

module.exports = App;
