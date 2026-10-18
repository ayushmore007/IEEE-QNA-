const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 24 || JWT_SECRET.startsWith('CHANGE_ME')) {
  console.error('FATAL: set JWT_SECRET (24+ random chars) in the environment.');
  process.exit(1);
}

const protect = async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select('-password');
      if (!req.admin) {
        return res.status(401).json({ success: false, message: 'Admin account not found' });
      }
      return next();
    } catch (err) {
      console.error('[Auth Error] Token verification failed:', err.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, missing token' });
  }
};

module.exports = { protect, JWT_SECRET };
