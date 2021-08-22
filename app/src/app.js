const express = require("express");
const cons = require("consolidate");
const path = require("path");
const { minify } = require("html-minifier");
const logger = require("log").get("app");

const defaultOptions = {};

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
    router.get("/", (_, res) => {
      const error = new Error();
      res.set("Content-Type", "text/html");
      res.render("index", { title: "App Title" }, (renderError, html) => {
        if (renderError) {
          const meaningfulSourceErrorStack = renderError.stack.substr(
            0,
            renderError.stack.indexOf("at eval (eval")
          );
          error.stack = meaningfulSourceErrorStack;
          logger.error(error);
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
            error.message = minifyError.message;
            logger.error(error);
            minifiedHtml = html;
          }
          res.status(200);
          res.send(minifiedHtml);
          res.end();
        }
      });
    });
    expressApp.use(this.pathPrefix, router);
  }
}

module.exports = App;
