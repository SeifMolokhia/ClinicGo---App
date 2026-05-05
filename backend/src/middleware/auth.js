// ============================================================
// Authentication middleware
// - `protect`: requires a valid JWT, attaches req.user
// - `requireAdmin`: requires authenticated user to have admin role
// ============================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = header.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user (without password) to ensure account still exists
    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err); // delegate to errorHandler (handles JsonWebTokenError, etc.)
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = { protect, requireAdmin };
