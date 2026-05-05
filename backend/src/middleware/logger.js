// ============================================================
// Application request logger
// Adds a per-request timing log on top of morgan's HTTP log.
// Useful for spotting slow endpoints in development.
// ============================================================

function requestLogger(req, res, next) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    const tag = res.statusCode >= 500 ? '🔴'
              : res.statusCode >= 400 ? '🟡'
              : '🟢';
    console.log(`${tag} ${req.method.padEnd(6)} ${req.originalUrl} → ${res.statusCode} (${durationMs.toFixed(1)}ms)`);
  });

  next();
}

module.exports = requestLogger;
