import jwt from 'jsonwebtoken';
import { db } from '../data/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fintech_loan_mgmt_secret_2026';

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.data.users.find(u => u.id === decoded.id || u.email === decoded.email);
    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone
      };
    } else {
      req.user = decoded;
    }
    next();
  } catch (err) {
    req.user = null;
    next();
  }
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }
  next();
}

export function requireCustomer(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  if (req.user.role !== 'CUSTOMER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. Customer privileges required.' });
  }
  next();
}
