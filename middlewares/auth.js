const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    if (!token) return res.status(401).json({error: 'Authentication token is required'});
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {id: decoded.userId, role: decoded.role};
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({error: 'Token has expired'});
    }
    return res.status(401).json({error: 'Invalid or malformed token'});
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({error: 'Authentication Required'});
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({error: 'You don\'t have Permission.'});
    }
    next();
  };
};

module.exports = {verifyToken, authorize};
