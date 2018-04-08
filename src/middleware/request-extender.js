const requestExtenderMiddleware = (req, res, next) => {
  const body = req.body;
  const headers = req.headers;
  const app = req.app;
  req.body = { body, headers, app };
  next();
}

module.exports = requestExtenderMiddleware;
