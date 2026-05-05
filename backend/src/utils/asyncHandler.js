// ============================================================
// asyncHandler — wraps async route handlers to forward
// rejected promises to Express's error middleware automatically.
// Saves us from writing try/catch in every controller.
// ============================================================

module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
