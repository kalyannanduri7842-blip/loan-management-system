import jwt from 'jsonwebtoken';
import { db } from '../data/db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'fintech_loan_mgmt_secret_2026';

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
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
      if (user.status === 'INACTIVE') {
        req.user = null;
        return res.status(403).json({ error: 'Your account has been deactivated. Please contact support.' });
      }
      req.user = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId,
        phone: user.phone,
        monthlyIncome: user.monthlyIncome,
        creditScore: user.creditScore,
        address: user.address,
        status: user.status || 'ACTIVE'
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

export function requireEmployee(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  if (req.user.role !== 'EMPLOYEE' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. Employee privileges required.' });
  }
  next();
}

export function requireManager(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  if (req.user.role !== 'MANAGER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. Manager privileges required.' });
  }
  next();
}
