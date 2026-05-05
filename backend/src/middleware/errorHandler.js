// ============================================================
// Centralized error handler
// Catches errors thrown anywhere in the request pipeline and
// returns consistent JSON. Must be the LAST app.use() call.
// ============================================================

function errorHandler(err, req, res, next) {
  // Default
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details;

  // Mongoose validation error → 400 with field-level details
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation failed';
    details = Object.fromEntries(
      Object.entries(err.errors).map(([k, v]) => [k, v.message])
    );
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value for ${field}`;
    details = err.keyValue;
  }

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired';
  }

  // Log server-side errors (5xx) — don't leak stack to client
  if (status >= 500) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);
  }

  const body = { error: message };
  if (details) body.details = details;
  // Only include stack in dev mode
  if (process.env.NODE_ENV !== 'production' && status >= 500) {
    body.stack = err.stack;
  }

  res.status(status).json(body);
}

module.exports = errorHandler;
