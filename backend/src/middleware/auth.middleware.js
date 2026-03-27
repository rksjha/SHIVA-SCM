const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
};

const managerMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (!['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Manager access required' });
    }
    next();
  });
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  managerMiddleware,
};
