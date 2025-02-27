// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

/**
 * Checks for a JWT in the Authorization header: "Bearer <token>"
 * If valid, attaches userId to req, else returns 401
 */
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // In production, use process.env.JWT_SECRET or similar
    const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
