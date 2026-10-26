const express = require("express");

/**
 * Express 4 doesn't catch rejected promises from async handlers: the request hangs until the
 * function times out. Wrapping every handler sends those errors to the app's error middleware.
 */
function catchAsync(handler) {
  if (typeof handler !== "function" || handler.length === 4) return handler;
  return function wrapped(req, res, next) {
    try {
      const result = handler(req, res, next);
      if (result && typeof result.catch === "function") result.catch(next);
      return result;
    } catch (err) {
      return next(err);
    }
  };
}

const METHODS = ["get", "post", "put", "patch", "delete", "all", "use"];

/** express.Router() whose route handlers (including middleware) report async errors. */
function asyncRouter() {
  const router = express.Router();
  METHODS.forEach((method) => {
    const original = router[method].bind(router);
    router[method] = (...args) =>
      original(...args.map((arg) => (Array.isArray(arg) ? arg.map(catchAsync) : catchAsync(arg))));
  });
  return router;
}

module.exports = asyncRouter;
