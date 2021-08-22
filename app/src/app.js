const express = require("express");
const cons = require("consolidate");
const path = require("path");
const { minify } = require("html-minifier");
const logger = require("log").get("app");

const defaultOptions = {};
let error;

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
    router.get("/", (_, res) => {
      error = new Error();
      res.set("Content-Type", "text/html");
      res.render("index", { title: "App Title" }, handleRenderResponse(res));
    });
    router.get("/clicked", (_, res) => {
      res.status(200);
      res.set("Content-Type", "text/html");
      res.render("clicked", {}, handleRenderResponse(res));
    });
    expressApp.use(this.pathPrefix, router);
  }
}

module.exports = App;
