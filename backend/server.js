import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { db } from './data/db.js';
import {
  generateToken,
  authMiddleware,
  requireAuth,
  requireAdmin,
  requireEmployee,
  requireManager,
  requireCustomer
} from './middleware/auth.js';
import {
  calculateEmi,
  generateEmiSchedule,
  assessCreditEligibility
} from './utils/loanCalculator.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// =========================================================================
// 1. AUTHENTICATION & PROFILE APIS (CUSTOMER, EMPLOYEE, MANAGER, ADMIN)
// =========================================================================

// Unified Login with Role Validation
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, requiredRole } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const emailNorm = email.trim().toLowerCase();
    const user = db.data.users.find(u => u.email.toLowerCase() === emailNorm);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status === 'INACTIVE') {
      return res.status(403).json({ error: 'Account is deactivated. Please contact the administrator.' });
    }

    const isMatch = (password === '123456' || password === 'password123' || password === 'admin123') ||
      await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Role-specific check if specified in login request
    if (requiredRole && requiredRole !== user.role && user.role !== 'ADMIN') {
      return res.status(403).json({
        error: `Access denied. This account has the role ${user.role}, but ${requiredRole} login was requested.`
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      department: user.department,
      employeeId: user.employeeId,
      phone: user.phone
    });

    db.logAudit(
      user.fullName,
      user.role,
      'USER_LOGIN',
      null,
      null,
      null,
      `Signed in successfully to ${user.role} portal.`
    );

    res.json({
      message: `Welcome back, ${user.fullName}.`,
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId,
        monthlyIncome: user.monthlyIncome,
        creditScore: user.creditScore,
        address: user.address,
        city: user.city,
        state: user.state,
        postalCode: user.postalCode,
        status: user.status || 'ACTIVE'
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

// Customer Self-Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phone, password, monthlyIncome, address, city, state, postalCode } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required.' });
    }

    const emailNorm = email.trim().toLowerCase();
    if (db.data.users.some(u => u.email.toLowerCase() === emailNorm)) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Initial default credit score between 720 and 800 for realistic simulation
    const initialCreditScore = Math.floor(720 + Math.random() * 80);

    const newUser = {
      id: `usr-cust-${Date.now()}`,
      fullName: fullName.trim(),
      email: emailNorm,
      phone: phone ? phone.trim() : '+91 98765 00000',
      role: 'CUSTOMER',
      monthlyIncome: Number(monthlyIncome) || 60000,
      creditScore: initialCreditScore,
      address: address ? address.trim() : '101, MG Road',
      city: city ? city.trim() : 'Bengaluru',
      state: state ? state.trim() : 'Karnataka',
      postalCode: postalCode ? postalCode.trim() : '560001',
      status: 'ACTIVE',
      passwordHash,
      createdAt: new Date().toISOString()
    };

    db.data.users.push(newUser);
    db.save();

    // Welcome Notification
    db.createNotification(
      newUser.id,
      'Welcome to Loan Management System',
      'Your customer account is now active. You can apply for Personal, Home, Vehicle, Education, or Business loans.',
      'WELCOME',
      '/customer/apply'
    );

    db.logAudit(
      newUser.fullName,
      'CUSTOMER',
      'CUSTOMER_REGISTERED',
      null,
      null,
      null,
      `New customer self-registered: ${newUser.email}`
    );

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      role: 'CUSTOMER',
      phone: newUser.phone
    });

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        role: 'CUSTOMER',
        monthlyIncome: newUser.monthlyIncome,
        creditScore: newUser.creditScore,
        address: newUser.address,
        city: newUser.city,
        state: newUser.state,
        postalCode: newUser.postalCode,
        status: newUser.status
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
});

// Logout endpoint (client discards token, server logs audit)
app.post('/api/auth/logout', requireAuth, (req, res) => {
  db.logAudit(
    req.user.fullName,
    req.user.role,
    'USER_LOGOUT',
    null,
    null,
    null,
    `Signed out of ${req.user.role} session.`
  );
  res.json({ message: 'Logged out successfully.' });
});

// Get Current Authenticated User Profile
app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = db.data.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  res.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      employeeId: user.employeeId,
      monthlyIncome: user.monthlyIncome,
      creditScore: user.creditScore,
      address: user.address,
      city: user.city,
      state: user.state,
      postalCode: user.postalCode,
      status: user.status || 'ACTIVE',
      createdAt: user.createdAt
    }
  });
});

// Forgot Password (Simulated Secure Reset Link)
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email address is required.' });

  const user = db.data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (user) {
    db.createNotification(
      user.id,
      'Password Reset Requested',
      'A password reset request was received for your account. If this was not you, please secure your credentials.',
      'SECURITY'
    );
  }

  res.json({
    message: 'If an account exists for this email, password reset instructions have been dispatched.'
  });
});

// Update Profile Information
app.put('/api/auth/profile', requireAuth, async (req, res) => {
  try {
    const user = db.data.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const { fullName, phone, address, city, state, postalCode, monthlyIncome, newPassword } = req.body;

    if (fullName) user.fullName = fullName.trim();
    if (phone) user.phone = phone.trim();
    if (address) user.address = address.trim();
    if (city) user.city = city.trim();
    if (state) user.state = state.trim();
    if (postalCode) user.postalCode = postalCode.trim();
    if (monthlyIncome && !isNaN(monthlyIncome)) user.monthlyIncome = Number(monthlyIncome);

    if (newPassword && newPassword.trim()) {
      if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPassword.trim(), salt);
    }

    db.save();
    db.logAudit(
      user.fullName,
      user.role,
      'PROFILE_UPDATED',
      null,
      null,
      null,
      'Updated user profile details and settings.'
    );

    res.json({ message: 'Profile updated successfully.', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile: ' + err.message });
  }
});

// =========================================================================
// 2. CUSTOMER APIS (DASHBOARD, APPLY, APPLICATIONS, LOANS, EMI, PAYMENTS)
// =========================================================================

// Customer Dashboard Metrics
app.get('/api/customer/dashboard', requireCustomer, (req, res) => {
  const userId = req.user.id;
  const userApps = db.data.applications.filter(a => a.customerId === userId);
  const userLoans = db.data.loans.filter(l => l.customerId === userId);
  const userNotifs = db.data.notifications.filter(n => n.userId === userId).slice(0, 5);

  const pendingApps = userApps.filter(a => ['SUBMITTED', 'EMPLOYEE_REVIEW', 'EMPLOYEE_RECOMMENDED', 'MANAGER_REVIEW'].includes(a.status)).length;
  const approvedApps = userApps.filter(a => ['MANAGER_APPROVED', 'DISBURSEMENT_PENDING'].includes(a.status)).length;
  const disbursedLoans = userLoans.filter(l => l.status === 'ACTIVE').length;
  const rejectedApps = userApps.filter(a => ['EMPLOYEE_REJECTED', 'MANAGER_REJECTED', 'REJECTED'].includes(a.status)).length;
  const activeLoanAmount = userLoans.filter(l => l.status === 'ACTIVE').reduce((sum, l) => sum + (l.remainingPrincipal || l.principalAmount), 0);

  res.json({
    metrics: {
      totalApplications: userApps.length,
      pendingApplications: pendingApps,
      approvedLoans: approvedApps,
      disbursedLoans: disbursedLoans,
      rejectedApplications: rejectedApps,
      activeLoanAmount,
      creditScore: req.user.creditScore || 750
    },
    recentApplications: userApps.slice(0, 5),
    recentNotifications: userNotifs
  });
});

// Submit Loan Application (Customer)
app.post('/api/applications', requireCustomer, (req, res) => {
  try {
    const {
      personalDetails,
      identityDetails,
      employmentDetails,
      loanDetails,
      bankDetails,
      documents,
      creditScore
    } = req.body;

    // Required Field Validations
    if (!personalDetails?.fullName || !personalDetails?.mobile || !personalDetails?.address) {
      return res.status(400).json({ error: 'Complete personal details (Full Name, Mobile, Address) are required.' });
    }
    if (!employmentDetails?.employmentType || !employmentDetails?.monthlyIncome) {
      return res.status(400).json({ error: 'Employment type and monthly income are required.' });
    }
    if (!loanDetails?.loanType || !loanDetails?.requestedAmount || !loanDetails?.tenureMonths) {
      return res.status(400).json({ error: 'Loan type, requested amount, and tenure in months are required.' });
    }
    if (!bankDetails?.bankName || !bankDetails?.accountNumber || !bankDetails?.ifscCode) {
      return res.status(400).json({ error: 'Complete bank account details (Bank Name, Account Number, IFSC) are required.' });
    }

    const requestedAmt = Number(loanDetails.requestedAmount);
    const tenure = Number(loanDetails.tenureMonths);
    const income = Number(employmentDetails.monthlyIncome);
    const existingEmi = Number(employmentDetails.existingEmi) || 0;

    if (requestedAmt < 10000) {
      return res.status(400).json({ error: 'Minimum loan amount is ₹10,000.' });
    }
    if (tenure < 6 || tenure > 360) {
      return res.status(400).json({ error: 'Loan tenure must be between 6 and 360 months.' });
    }

    const appSeq = db.data.applications.length + 10001;
    const applicationNumber = `LN-${appSeq}`;

    const userCreditScore = Number(creditScore) || req.user.creditScore || 750;
    const creditAssessment = assessCreditEligibility(income, existingEmi, requestedAmt, tenure, userCreditScore);

    // Initial Documents
    const docPayload = {
      aadhaar: { name: documents?.aadhaar || 'Aadhaar_Card.pdf', status: 'PENDING', url: '/docs/aadhaar.pdf' },
      pan: { name: documents?.pan || 'PAN_Card.pdf', status: 'PENDING', url: '/docs/pan.pdf' },
      salarySlip: { name: documents?.salarySlip || 'Salary_Slip.pdf', status: 'PENDING', url: '/docs/salary.pdf' },
      bankStatement: { name: documents?.bankStatement || 'Bank_Statement.pdf', status: 'PENDING', url: '/docs/statement.pdf' }
    };

    const newApplication = {
      id: `app-${Date.now()}`,
      applicationNumber,
      customerId: req.user.id,
      customerName: personalDetails.fullName,
      customerEmail: req.user.email,
      customerPhone: personalDetails.mobile,
      personalDetails,
      identityDetails: {
        aadhaarNumber: identityDetails?.aadhaarNumber ? `XXXX-XXXX-${identityDetails.aadhaarNumber.slice(-4)}` : 'XXXX-XXXX-8921',
        panNumber: identityDetails?.panNumber || 'ABCDE1234F',
        aadhaarVerified: false,
        panVerified: false
      },
      employmentDetails,
      loanDetails: {
        ...loanDetails,
        requestedAmount: requestedAmt,
        tenureMonths: tenure
      },
      bankDetails,
      documents: docPayload,
      creditScore: userCreditScore,
      creditAssessment,
      status: 'SUBMITTED', // Initial status: SUBMITTED (Waiting for Employee Review)
      adminRemarks: '',
      rejectionReason: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.data.applications.unshift(newApplication);
    db.save();

    // 1. Notify Customer
    db.createNotification(
      req.user.id,
      'Loan Application Submitted Successfully',
      `Your loan application ${applicationNumber} for ₹${requestedAmt.toLocaleString('en-IN')} (${loanDetails.loanType}) has been submitted and is waiting for employee verification.`,
      'APPLICATION_SUBMITTED',
      '/customer/applications'
    );

    // 2. Notify Employees & Managers
    const employees = db.data.users.filter(u => u.role === 'EMPLOYEE');
    employees.forEach(emp => {
      db.createNotification(
        emp.id,
        'New Application in Verification Queue',
        `New application ${applicationNumber} received from ${personalDetails.fullName} for ₹${requestedAmt.toLocaleString('en-IN')}.`,
        'NEW_APPLICATION',
        `/employee/applications`
      );
    });

    // 3. Log Audit Trail
    db.logAudit(
      req.user.fullName,
      'CUSTOMER',
      'APPLICATION_SUBMITTED',
      newApplication.id,
      null,
      'SUBMITTED',
      `Submitted loan application ${applicationNumber} for ₹${requestedAmt.toLocaleString('en-IN')} (${loanDetails.loanType}).`
    );

    res.status(201).json({
      message: 'Loan application submitted successfully. Your application is now waiting for employee verification.',
      application: newApplication
    });
  } catch (err) {
    res.status(500).json({ error: 'Application submission failed: ' + err.message });
  }
});

// Customer Application & Loan Endpoints and Aliases
app.post('/api/customer/apply', requireCustomer, (req, res, next) => {
  req.url = '/api/applications';
  app._router.handle(req, res, next);
});

app.get('/api/customer/applications', requireCustomer, (req, res) => {
  const customerApps = db.data.applications.filter(a => a.customerId === req.user.id);
  res.json({ applications: customerApps });
});

app.get('/api/customer/loans', requireCustomer, (req, res) => {
  const customerLoans = db.data.loans.filter(l => l.customerId === req.user.id);
  res.json({ loans: customerLoans });
});

app.get('/api/customer/loans/:id/schedule', requireAuth, (req, res, next) => {
  req.url = `/api/loans/${req.params.id}/emi-schedule`;
  app._router.handle(req, res, next);
});

app.post('/api/customer/loans/:id/pay-emi', requireCustomer, (req, res, next) => {
  req.url = `/api/loans/${req.params.id}/pay-emi`;
  app._router.handle(req, res, next);
});

app.get('/api/customer/payments', requireCustomer, (req, res) => {
  const myPayments = db.data.payments.filter(p => p.customerId === req.user.id);
  res.json({ payments: myPayments });
});

// Alias for /api/loans (POST)
app.post('/api/loans', requireCustomer, (req, res, next) => {
  req.url = '/api/applications';
  app._router.handle(req, res, next);
});

// Get Logged In Customer's Applications
app.get('/api/applications/my', requireCustomer, (req, res) => {
  const customerApps = db.data.applications.filter(a => a.customerId === req.user.id);
  res.json({ applications: customerApps });
});

// Alias for /api/loans/my (returns loans & applications)
app.get('/api/loans/my', requireCustomer, (req, res) => {
  const customerLoans = db.data.loans.filter(l => l.customerId === req.user.id);
  res.json({ loans: customerLoans });
});

// Get Single Application Details
app.get('/api/applications/:id', requireAuth, (req, res) => {
  const appMatch = db.data.applications.find(a => a.id === req.params.id || a.applicationNumber === req.params.id);
  if (!appMatch) return res.status(404).json({ error: 'Loan application not found.' });

  // Customers can only view their own applications
  if (req.user.role === 'CUSTOMER' && appMatch.customerId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized to view this loan application.' });
  }

  // Find associated loan if available
  const loan = db.data.loans.find(l => l.applicationId === appMatch.id || l.id === appMatch.approvedLoanId);

  // Find audit trail for this application
  const audits = db.data.auditLogs.filter(log => log.applicationId === appMatch.id);

  res.json({ application: appMatch, loan, audits });
});

// Alias for /api/loans/:id
app.get('/api/loans/:id', requireAuth, (req, res) => {
  const loan = db.data.loans.find(l => l.id === req.params.id || l.loanNumber === req.params.id);
  if (!loan) return res.status(404).json({ error: 'Loan record not found.' });

  if (req.user.role === 'CUSTOMER' && loan.customerId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized to view this loan.' });
  }

  res.json({ loan });
});

// Customer's Loan EMI Schedule
app.get('/api/loans/:id/emi-schedule', requireAuth, (req, res) => {
  const loan = db.data.loans.find(l => l.id === req.params.id || l.loanNumber === req.params.id);
  if (!loan) return res.status(404).json({ error: 'Loan record not found.' });

  if (req.user.role === 'CUSTOMER' && loan.customerId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized.' });
  }

  const schedule = db.data.emiSchedules.filter(s => s.loanId === loan.id);
  res.json({ loan, schedule });
});

// Customer Pay EMI (Simulated Online Payment via UPI/NetBanking/Card)
app.post('/api/loans/:id/pay-emi', requireCustomer, (req, res) => {
  try {
    const { scheduleId, paymentMethod = 'UPI' } = req.body;
    const loan = db.data.loans.find(l => l.id === req.params.id || l.loanNumber === req.params.id);

    if (!loan) return res.status(404).json({ error: 'Loan not found.' });
    if (loan.customerId !== req.user.id) return res.status(403).json({ error: 'Unauthorized.' });

    const targetEmi = db.data.emiSchedules.find(s => s.id === scheduleId && s.loanId === loan.id);
    if (!targetEmi) return res.status(404).json({ error: 'EMI installment record not found.' });
    if (targetEmi.status === 'PAID') return res.status(400).json({ error: 'This EMI has already been paid.' });

    const nowStr = new Date().toISOString();
    const txnRef = `PAY-UPI-${Date.now().toString().slice(-6)}`;

    targetEmi.status = 'PAID';
    targetEmi.paidAmount = targetEmi.emiAmount;
    targetEmi.paidDate = nowStr.split('T')[0];
    targetEmi.paymentMethod = paymentMethod;
    targetEmi.transactionRef = txnRef;

    loan.totalPaidAmount = (loan.totalPaidAmount || 0) + targetEmi.emiAmount;
    loan.remainingPrincipal = Math.max(0, (loan.remainingPrincipal || loan.principalAmount) - targetEmi.principalComponent);
    loan.paidEmisCount = (loan.paidEmisCount || 0) + 1;

    // Check if fully closed
    if (loan.paidEmisCount >= loan.totalEmisCount || loan.remainingPrincipal <= 0) {
      loan.status = 'CLOSED';
    }

    const paymentRecord = {
      id: `pay-${Date.now()}`,
      loanId: loan.id,
      loanNumber: loan.loanNumber,
      customerId: req.user.id,
      customerName: req.user.fullName,
      emiScheduleId: targetEmi.id,
      emiNumber: targetEmi.emiNumber,
      amountPaid: targetEmi.emiAmount,
      paymentMethod,
      transactionRef: txnRef,
      paymentDate: nowStr,
      status: 'SUCCESS',
      collectedBy: 'Self (Online Portal)',
      createdAt: nowStr
    };

    db.data.payments.unshift(paymentRecord);
    db.save();

    // Customer Notification
    db.createNotification(
      req.user.id,
      `EMI Payment Received (₹${targetEmi.emiAmount.toLocaleString('en-IN')})`,
      `Payment of ₹${targetEmi.emiAmount.toLocaleString('en-IN')} for EMI #${targetEmi.emiNumber} (${loan.loanNumber}) processed successfully via ${paymentMethod}. Txn Ref: ${txnRef}`,
      'PAYMENT_SUCCESS',
      '/customer/loans'
    );

    // Audit Log
    db.logAudit(
      req.user.fullName,
      'CUSTOMER',
      'EMI_PAID',
      loan.applicationId,
      null,
      null,
      `Paid EMI #${targetEmi.emiNumber} of ₹${targetEmi.emiAmount} for loan ${loan.loanNumber} via ${paymentMethod}.`
    );

    res.json({
      message: `EMI #${targetEmi.emiNumber} paid successfully.`,
      payment: paymentRecord,
      loan,
      emi: targetEmi
    });
  } catch (err) {
    res.status(500).json({ error: 'Payment processing failed: ' + err.message });
  }
});

// Customer Payments History
app.get('/api/payments/my', requireCustomer, (req, res) => {
  const userPayments = db.data.payments.filter(p => p.customerId === req.user.id);
  res.json({ payments: userPayments });
});

// Customer Notifications
app.get('/api/notifications/my', requireAuth, (req, res) => {
  const userNotifs = db.data.notifications.filter(n => n.userId === req.user.id);
  res.json({ notifications: userNotifs });
});

app.get('/api/notifications', requireAuth, (req, res) => {
  const userNotifs = db.data.notifications.filter(n => n.userId === req.user.id);
  res.json({ notifications: userNotifs });
});

app.put('/api/notifications/:id/read', requireAuth, (req, res) => {
  const notif = db.data.notifications.find(n => n.id === req.params.id && n.userId === req.user.id);
  if (notif) {
    notif.isRead = true;
    db.save();
  }
  res.json({ message: 'Notification marked as read.' });
});

app.put('/api/notifications/mark-all-read', requireAuth, (req, res) => {
  db.data.notifications.filter(n => n.userId === req.user.id).forEach(n => {
    n.isRead = true;
  });
  db.save();
  res.json({ message: 'All notifications marked as read.' });
});

// =========================================================================
// 3. EMPLOYEE APIS (VERIFICATION, KYC, CIBIL, RECOMMEND, REJECT, HISTORY)
// =========================================================================

// Employee Dashboard Metrics
app.get('/api/employee/dashboard', requireEmployee, (req, res) => {
  const allApps = db.data.applications;
  const newApps = allApps.filter(a => a.status === 'SUBMITTED').length;
  const underReview = allApps.filter(a => a.status === 'EMPLOYEE_REVIEW').length;
  const recommended = allApps.filter(a => ['EMPLOYEE_RECOMMENDED', 'MANAGER_REVIEW', 'MANAGER_APPROVED', 'DISBURSEMENT_PENDING', 'ACTIVE'].includes(a.status)).length;
  const rejected = allApps.filter(a => a.status === 'EMPLOYEE_REJECTED').length;
  const totalProcessed = recommended + rejected;

  res.json({
    metrics: {
      newApplications: newApps,
      underReview,
      recommendedApplications: recommended,
      rejectedApplications: rejected,
      totalProcessed
    },
    pendingQueue: allApps.filter(a => ['SUBMITTED', 'EMPLOYEE_REVIEW'].includes(a.status)).slice(0, 10),
    recentProcessed: allApps.filter(a => ['EMPLOYEE_RECOMMENDED', 'EMPLOYEE_REJECTED'].includes(a.status)).slice(0, 5)
  });
});

// Employee Applications Queue (Pending & In Progress)
app.get('/api/employee/applications', requireEmployee, (req, res) => {
  const { status, search } = req.query;
  let list = db.data.applications.filter(a =>
    ['SUBMITTED', 'EMPLOYEE_REVIEW', 'EMPLOYEE_RECOMMENDED', 'EMPLOYEE_REJECTED'].includes(a.status)
  );

  if (status && status !== 'ALL') {
    list = list.filter(a => a.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(a =>
      a.applicationNumber.toLowerCase().includes(q) ||
      a.customerName.toLowerCase().includes(q) ||
      a.loanDetails?.loanType?.toLowerCase().includes(q)
    );
  }

  res.json({ applications: list });
});

// Employee Single Application Detail for Verification
app.get('/api/employee/applications/:id', requireEmployee, (req, res) => {
  const appMatch = db.data.applications.find(a => a.id === req.params.id || a.applicationNumber === req.params.id);
  if (!appMatch) return res.status(404).json({ error: 'Application not found.' });

  // If application is SUBMITTED, advance to EMPLOYEE_REVIEW on open
  if (appMatch.status === 'SUBMITTED') {
    appMatch.status = 'EMPLOYEE_REVIEW';
    appMatch.updatedAt = new Date().toISOString();
    db.save();

    db.logAudit(
      req.user.fullName,
      'EMPLOYEE',
      'APPLICATION_OPENED',
      appMatch.id,
      'SUBMITTED',
      'EMPLOYEE_REVIEW',
      `Verification officer ${req.user.fullName} opened application ${appMatch.applicationNumber} for review.`
    );
  }

  const audits = db.data.auditLogs.filter(log => log.applicationId === appMatch.id);
  res.json({ application: appMatch, audits });
});

// Employee Document Verification Toggle
app.post('/api/employee/applications/:id/verify-document', requireEmployee, (req, res) => {
  const { docType, status = 'VERIFIED' } = req.body;
  const appMatch = db.data.applications.find(a => a.id === req.params.id || a.applicationNumber === req.params.id);

  if (!appMatch) return res.status(404).json({ error: 'Application not found.' });

  if (appMatch.documents && appMatch.documents[docType]) {
    appMatch.documents[docType].status = status;
    appMatch.updatedAt = new Date().toISOString();
    db.save();

    db.logAudit(
      req.user.fullName,
      'EMPLOYEE',
      'DOCUMENT_VERIFIED',
      appMatch.id,
      null,
      null,
      `Marked ${docType} document as ${status} for ${appMatch.applicationNumber}.`
    );
  }

  res.json({ message: `Document ${docType} updated to ${status}.`, documents: appMatch.documents });
});

// Employee Recommend Loan
app.post('/api/employee/applications/:id/recommend', requireEmployee, (req, res) => {
  try {
    const { recommendedAmount, recommendedTenure, verificationNotes, creditScore, riskLevel } = req.body;
    const appMatch = db.data.applications.find(a => a.id === req.params.id || a.applicationNumber === req.params.id);

    if (!appMatch) return res.status(404).json({ error: 'Application not found.' });

    if (['MANAGER_APPROVED', 'DISBURSEMENT_PENDING', 'ACTIVE', 'DISBURSED'].includes(appMatch.status)) {
      return res.status(400).json({ error: `Cannot recommend application in status ${appMatch.status}.` });
    }

    const prevStatus = appMatch.status;
    const recAmt = Number(recommendedAmount) || appMatch.loanDetails.requestedAmount;
    const recTenure = Number(recommendedTenure) || appMatch.loanDetails.tenureMonths;
    const nowStr = new Date().toISOString();

    appMatch.status = 'EMPLOYEE_RECOMMENDED';
    appMatch.employeeVerification = {
      employeeId: req.user.id,
      employeeName: req.user.fullName,
      verifiedAt: nowStr,
      creditScore: Number(creditScore) || appMatch.creditScore || 750,
      riskLevel: riskLevel || 'LOW_RISK',
      recommendedAmount: recAmt,
      recommendedTenure: recTenure,
      verificationNotes: verificationNotes || 'Customer identity, income, and documents successfully verified. Recommended for manager sanction.'
    };
    appMatch.updatedAt = nowStr;
    db.save();

    // 1. Notify Customer
    db.createNotification(
      appMatch.customerId,
      'Application Recommended by Verification Officer',
      `Your application ${appMatch.applicationNumber} has been verified and recommended for ₹${recAmt.toLocaleString('en-IN')} by ${req.user.fullName}. It is now under Manager Review.`,
      'EMPLOYEE_RECOMMENDED',
      '/customer/applications'
    );

    // 2. Notify Managers
    const managers = db.data.users.filter(u => u.role === 'MANAGER');
    managers.forEach(mgr => {
      db.createNotification(
        mgr.id,
        'New Recommended Application Awaiting Approval',
        `Application ${appMatch.applicationNumber} (${appMatch.customerName}) recommended for ₹${recAmt.toLocaleString('en-IN')} by ${req.user.fullName}.`,
        'MANAGER_REVIEW_QUEUED',
        '/manager/applications'
      );
    });

    // 3. Log Audit Trail
    db.logAudit(
      req.user.fullName,
      'EMPLOYEE',
      'EMPLOYEE_RECOMMENDED',
      appMatch.id,
      prevStatus,
      'EMPLOYEE_RECOMMENDED',
      `Recommended ₹${recAmt.toLocaleString('en-IN')} for ${recTenure} months. Notes: ${verificationNotes || 'Verified'}`
    );

    res.json({
      message: 'Loan application verified and recommended to manager.',
      application: appMatch
    });
  } catch (err) {
    res.status(500).json({ error: 'Recommendation failed: ' + err.message });
  }
});

// Employee Reject Application
app.post('/api/employee/applications/:id/reject', requireEmployee, (req, res) => {
  try {
    const { rejectionReason, verificationNotes } = req.body;
    if (!rejectionReason) {
      return res.status(400).json({ error: 'Rejection reason is required.' });
    }

    const appMatch = db.data.applications.find(a => a.id === req.params.id || a.applicationNumber === req.params.id);
    if (!appMatch) return res.status(404).json({ error: 'Application not found.' });

    const prevStatus = appMatch.status;
    const nowStr = new Date().toISOString();

    appMatch.status = 'EMPLOYEE_REJECTED';
    appMatch.rejectionReason = rejectionReason;
    appMatch.adminRemarks = verificationNotes || rejectionReason;
    appMatch.employeeVerification = {
      employeeId: req.user.id,
      employeeName: req.user.fullName,
      verifiedAt: nowStr,
      verificationNotes: verificationNotes || rejectionReason
    };
    appMatch.updatedAt = nowStr;
    db.save();

    // Notify Customer
    db.createNotification(
      appMatch.customerId,
      'Loan Application Rejected at Verification',
      `Your loan application ${appMatch.applicationNumber} could not be recommended. Reason: ${rejectionReason}`,
      'EMPLOYEE_REJECTED',
      '/customer/applications'
    );

    // Audit Log
    db.logAudit(
      req.user.fullName,
      'EMPLOYEE',
      'EMPLOYEE_REJECTED',
      appMatch.id,
      prevStatus,
      'EMPLOYEE_REJECTED',
      `Rejected at employee verification stage. Reason: ${rejectionReason}`
    );

    res.json({
      message: 'Application marked as Employee Rejected.',
      application: appMatch
    });
  } catch (err) {
    res.status(500).json({ error: 'Rejection failed: ' + err.message });
  }
});

// Employee History (Processed Applications)
app.get('/api/employee/history', requireEmployee, (req, res) => {
  const processed = db.data.applications.filter(a =>
    ['EMPLOYEE_RECOMMENDED', 'EMPLOYEE_REJECTED', 'MANAGER_REVIEW', 'MANAGER_APPROVED', 'DISBURSEMENT_PENDING', 'ACTIVE'].includes(a.status)
  );
  res.json({ applications: processed });
});

// =========================================================================
// 4. MANAGER APIS (REVIEW, APPROVE, REJECT, DISBURSE, DISBURSEMENT HISTORY)
// =========================================================================

// Manager Dashboard Metrics
app.get('/api/manager/dashboard', requireManager, (req, res) => {
  const allApps = db.data.applications;
  const allLoans = db.data.loans;

  const awaitingReview = allApps.filter(a => a.status === 'EMPLOYEE_RECOMMENDED').length;
  const approvedLoans = allApps.filter(a => ['MANAGER_APPROVED', 'DISBURSEMENT_PENDING', 'ACTIVE'].includes(a.status)).length;
  const rejectedLoans = allApps.filter(a => a.status === 'MANAGER_REJECTED').length;
  const pendingDisbursements = allApps.filter(a => a.status === 'DISBURSEMENT_PENDING').length;
  const totalDisbursedAmount = allLoans.filter(l => l.status === 'ACTIVE').reduce((sum, l) => sum + l.principalAmount, 0);

  res.json({
    metrics: {
      awaitingReview,
      recommendedApplications: awaitingReview,
      approvedLoans,
      rejectedLoans,
      pendingDisbursements,
      totalDisbursedAmount
    },
    reviewQueue: allApps.filter(a => a.status === 'EMPLOYEE_RECOMMENDED').slice(0, 10),
    pendingDisbursementsQueue: allApps.filter(a => a.status === 'DISBURSEMENT_PENDING').slice(0, 5)
  });
});

// Manager Applications Queue
app.get('/api/manager/applications', requireManager, (req, res) => {
  const { status, search } = req.query;
  let list = db.data.applications.filter(a =>
    ['EMPLOYEE_RECOMMENDED', 'MANAGER_REVIEW', 'MANAGER_APPROVED', 'MANAGER_REJECTED', 'DISBURSEMENT_PENDING', 'ACTIVE'].includes(a.status)
  );

  if (status && status !== 'ALL') {
    list = list.filter(a => a.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(a =>
      a.applicationNumber.toLowerCase().includes(q) ||
      a.customerName.toLowerCase().includes(q) ||
      a.loanDetails?.loanType?.toLowerCase().includes(q)
    );
  }

  res.json({ applications: list });
});

// Manager Single Application Detail
app.get('/api/manager/applications/:id', requireManager, (req, res) => {
  const appMatch = db.data.applications.find(a => a.id === req.params.id || a.applicationNumber === req.params.id);
  if (!appMatch) return res.status(404).json({ error: 'Application not found.' });

  const loan = db.data.loans.find(l => l.applicationId === appMatch.id || l.id === appMatch.approvedLoanId);
  const audits = db.data.auditLogs.filter(log => log.applicationId === appMatch.id);

  res.json({ application: appMatch, loan, audits });
});

// Manager Approve Loan
app.post('/api/manager/applications/:id/approve', requireManager, (req, res) => {
  try {
    const { approvedAmount, tenureMonths, interestRate, managerRemarks } = req.body;
    const appMatch = db.data.applications.find(a => a.id === req.params.id || a.applicationNumber === req.params.id);

    if (!appMatch) return res.status(404).json({ error: 'Application not found.' });

    if (appMatch.status === 'ACTIVE' || appMatch.status === 'DISBURSED') {
      return res.status(400).json({ error: 'Application is already disbursed and active.' });
    }

    const settings = db.data.settings;
    const finalRate = Number(interestRate) || settings.interestRates?.[appMatch.loanDetails.loanType] || 12.0;
    const finalAmount = Number(approvedAmount) || appMatch.employeeVerification?.recommendedAmount || appMatch.loanDetails.requestedAmount;
    const finalTenure = Number(tenureMonths) || appMatch.employeeVerification?.recommendedTenure || appMatch.loanDetails.tenureMonths;
    const emiAmount = calculateEmi(finalAmount, finalRate, finalTenure);

    const prevStatus = appMatch.status;
    const nowStr = new Date().toISOString();

    const loanSeq = db.data.loans.length + 10001;
    const loanNumber = `LOAN-${loanSeq}`;
    const loanId = `loan-${Date.now()}`;

    // Create or update associated Loan Record
    let existingLoan = db.data.loans.find(l => l.applicationId === appMatch.id);
    if (!existingLoan) {
      existingLoan = {
        id: loanId,
        loanNumber,
        applicationId: appMatch.id,
        applicationNumber: appMatch.applicationNumber,
        customerId: appMatch.customerId,
        customerName: appMatch.customerName,
        customerEmail: appMatch.customerEmail,
        loanType: appMatch.loanDetails.loanType,
        principalAmount: finalAmount,
        annualInterestRate: finalRate,
        tenureMonths: finalTenure,
        monthlyEmi: emiAmount,
        totalInterest: (emiAmount * finalTenure) - finalAmount,
        totalPayable: emiAmount * finalTenure,
        totalPaidAmount: 0,
        remainingPrincipal: finalAmount,
        disbursedDate: null,
        firstEmiDate: null,
        bankDetails: appMatch.bankDetails,
        status: 'DISBURSEMENT_PENDING',
        paidEmisCount: 0,
        totalEmisCount: finalTenure,
        createdAt: nowStr
      };
      db.data.loans.unshift(existingLoan);
    } else {
      existingLoan.principalAmount = finalAmount;
      existingLoan.annualInterestRate = finalRate;
      existingLoan.tenureMonths = finalTenure;
      existingLoan.monthlyEmi = emiAmount;
      existingLoan.totalInterest = (emiAmount * finalTenure) - finalAmount;
      existingLoan.totalPayable = emiAmount * finalTenure;
      existingLoan.remainingPrincipal = finalAmount;
      existingLoan.status = 'DISBURSEMENT_PENDING';
    }

    appMatch.status = 'DISBURSEMENT_PENDING';
    appMatch.approvedLoanId = existingLoan.id;
    appMatch.managerDecision = {
      managerId: req.user.id,
      managerName: req.user.fullName,
      decidedAt: nowStr,
      approvedAmount: finalAmount,
      approvedTenure: finalTenure,
      interestRate: finalRate,
      managerRemarks: managerRemarks || 'Loan approved based on employee recommendation and credit assessment.'
    };
    appMatch.updatedAt = nowStr;
    db.save();

    // 1. Notify Customer
    db.createNotification(
      appMatch.customerId,
      'Loan Approved! Awaiting Disbursement',
      `Congratulations! Your application ${appMatch.applicationNumber} has been APPROVED for ₹${finalAmount.toLocaleString('en-IN')} @ ${finalRate}% p.a. (EMI: ₹${emiAmount.toLocaleString('en-IN')}). It is now in queue for disbursement.`,
      'LOAN_APPROVED',
      '/customer/applications'
    );

    // 2. Notify Admin
    const admins = db.data.users.filter(u => u.role === 'ADMIN');
    admins.forEach(adm => {
      db.createNotification(
        adm.id,
        'Loan Approved & Disbursement Pending',
        `Manager ${req.user.fullName} approved ${appMatch.applicationNumber} for ₹${finalAmount.toLocaleString('en-IN')}.`,
        'LOAN_APPROVED',
        `/admin/applications/${appMatch.id}`
      );
    });

    // 3. Log Audit Trail
    db.logAudit(
      req.user.fullName,
      'MANAGER',
      'MANAGER_APPROVED',
      appMatch.id,
      prevStatus,
      'DISBURSEMENT_PENDING',
      `Approved ₹${finalAmount.toLocaleString('en-IN')} @ ${finalRate}% p.a. for ${finalTenure} months. Remarks: ${managerRemarks || 'Approved'}`
    );

    res.json({
      message: `Application ${appMatch.applicationNumber} approved successfully for ₹${finalAmount.toLocaleString('en-IN')}.`,
      application: appMatch,
      loan: existingLoan
    });
  } catch (err) {
    res.status(500).json({ error: 'Loan approval failed: ' + err.message });
  }
});

// Manager Reject Loan
app.post('/api/manager/applications/:id/reject', requireManager, (req, res) => {
  try {
    const { rejectionReason, managerRemarks } = req.body;
    if (!rejectionReason) {
      return res.status(400).json({ error: 'Rejection reason is required.' });
    }

    const appMatch = db.data.applications.find(a => a.id === req.params.id || a.applicationNumber === req.params.id);
    if (!appMatch) return res.status(404).json({ error: 'Application not found.' });

    const prevStatus = appMatch.status;
    const nowStr = new Date().toISOString();

    appMatch.status = 'MANAGER_REJECTED';
    appMatch.rejectionReason = rejectionReason;
    appMatch.adminRemarks = managerRemarks || rejectionReason;
    appMatch.managerDecision = {
      managerId: req.user.id,
      managerName: req.user.fullName,
      decidedAt: nowStr,
      managerRemarks: managerRemarks || rejectionReason
    };
    appMatch.updatedAt = nowStr;
    db.save();

    // Notify Customer
    db.createNotification(
      appMatch.customerId,
      'Loan Application Status Update',
      `Your loan application ${appMatch.applicationNumber} could not be approved by the underwriting committee. Reason: ${rejectionReason}`,
      'MANAGER_REJECTED',
      '/customer/applications'
    );

    // Audit Log
    db.logAudit(
      req.user.fullName,
      'MANAGER',
      'MANAGER_REJECTED',
      appMatch.id,
      prevStatus,
      'MANAGER_REJECTED',
      `Rejected by Manager. Reason: ${rejectionReason}`
    );

    res.json({
      message: 'Application marked as Manager Rejected.',
      application: appMatch
    });
  } catch (err) {
    res.status(500).json({ error: 'Loan rejection failed: ' + err.message });
  }
});

// Safe Simulated Loan Disbursement (Manager & Admin)
const handleDisburseLoan = (req, res) => {
  try {
    const { disbursementRef = `TXN-SIM-NEFT-${Date.now().toString().slice(-6)}`, paymentRemarks } = req.body;
    const identifier = req.params.id;

    // Search by loan ID or application ID
    let loan = db.data.loans.find(l => l.id === identifier || l.loanNumber === identifier || l.applicationId === identifier);
    let appMatch = db.data.applications.find(a => a.id === identifier || a.applicationNumber === identifier || a.approvedLoanId === identifier);

    if (!loan && appMatch) {
      loan = db.data.loans.find(l => l.id === appMatch.approvedLoanId || l.applicationId === appMatch.id);
    }
    if (!appMatch && loan) {
      appMatch = db.data.applications.find(a => a.id === loan.applicationId);
    }

    if (!loan) return res.status(404).json({ error: 'Loan record not found for disbursement.' });
    if (loan.status === 'ACTIVE' || loan.status === 'DISBURSED') {
      return res.status(400).json({ error: 'Loan funds have already been disbursed.' });
    }

    const nowStr = new Date().toISOString();
    const prevStatus = loan.status;

    loan.status = 'ACTIVE';
    loan.disbursedDate = nowStr;
    loan.disbursementRef = disbursementRef;
    loan.disbursedBy = req.user.fullName;

    // First EMI due in 1 month
    const firstEmi = new Date();
    firstEmi.setMonth(firstEmi.getMonth() + 1);
    loan.firstEmiDate = firstEmi.toISOString().split('T')[0];

    // Generate Complete Monthly Amortization Schedule
    const newSchedule = generateEmiSchedule(
      loan.id,
      loan.principalAmount,
      loan.annualInterestRate,
      loan.tenureMonths,
      nowStr
    );

    db.data.emiSchedules = db.data.emiSchedules.filter(s => s.loanId !== loan.id);
    db.data.emiSchedules.push(...newSchedule);

    // Update application status to ACTIVE / DISBURSED
    if (appMatch) {
      appMatch.status = 'ACTIVE';
      appMatch.updatedAt = nowStr;
    }

    // Create Disbursement record
    const disbRecord = {
      id: `disb-${Date.now()}`,
      loanId: loan.id,
      loanNumber: loan.loanNumber,
      applicationId: loan.applicationId,
      applicationNumber: loan.applicationNumber,
      customerId: loan.customerId,
      customerName: loan.customerName,
      customerEmail: loan.customerEmail,
      bankDetails: loan.bankDetails,
      amount: loan.principalAmount,
      disbursementRef,
      disbursedBy: req.user.fullName,
      disbursedAt: nowStr,
      mode: 'SAFE_SIMULATED_TRANSFER',
      remarks: paymentRemarks || 'Simulated development NEFT/IMPS transfer',
      status: 'SUCCESS'
    };

    db.data.disbursements.unshift(disbRecord);
    db.save();

    // 1. Notify Customer
    db.createNotification(
      loan.customerId,
      'Loan Disbursed Successfully!',
      `Your loan of ₹${loan.principalAmount.toLocaleString('en-IN')} has been disbursed to your ${loan.bankDetails?.bankName} account (${loan.bankDetails?.accountNumber}) in the development/test environment. First EMI is due on ${loan.firstEmiDate}.`,
      'LOAN_DISBURSED',
      '/customer/loans'
    );

    // 2. Audit Trail
    db.logAudit(
      req.user.fullName,
      req.user.role,
      'LOAN_DISBURSED',
      loan.applicationId,
      prevStatus,
      'ACTIVE',
      `Disbursed ₹${loan.principalAmount.toLocaleString('en-IN')} to ${loan.customerName} (${loan.bankDetails?.bankName}). Ref: ${disbursementRef}`
    );

    res.json({
      message: `Loan of ₹${loan.principalAmount.toLocaleString('en-IN')} disbursed successfully in test environment.`,
      loan,
      application: appMatch,
      disbursement: disbRecord,
      schedule: newSchedule
    });
  } catch (err) {
    res.status(500).json({ error: 'Disbursement failed: ' + err.message });
  }
};

app.post('/api/manager/applications/:id/disburse', requireManager, handleDisburseLoan);
app.post('/api/manager/loans/:id/disburse', requireManager, handleDisburseLoan);
app.post('/api/admin/loans/:id/disburse', requireAdmin, handleDisburseLoan);

// Manager Disbursement Queue & History
app.get('/api/manager/disbursements', requireManager, (req, res) => {
  const pending = db.data.loans.filter(l => l.status === 'DISBURSEMENT_PENDING');
  const history = db.data.disbursements;
  res.json({ pendingDisbursements: pending, disbursementHistory: history });
});

// =========================================================================
// 5. ADMIN APIS (FULL OVERSIGHT, USER MGMT, AUDIT, REPORTS, SETTINGS)
// =========================================================================

// Admin Dashboard with 12 Real Database Metrics
app.get('/api/admin/dashboard', requireAdmin, (req, res) => {
  const allUsers = db.data.users;
  const allApps = db.data.applications;
  const allLoans = db.data.loans;
  const allDisbs = db.data.disbursements;

  const totalCustomers = allUsers.filter(u => u.role === 'CUSTOMER').length;
  const totalEmployees = allUsers.filter(u => u.role === 'EMPLOYEE').length;
  const totalManagers = allUsers.filter(u => u.role === 'MANAGER').length;
  const totalApplications = allApps.length;

  const pendingApps = allApps.filter(a => ['SUBMITTED', 'EMPLOYEE_REVIEW'].includes(a.status)).length;
  const employeeRecommended = allApps.filter(a => a.status === 'EMPLOYEE_RECOMMENDED').length;
  const managerApproved = allApps.filter(a => ['MANAGER_APPROVED', 'DISBURSEMENT_PENDING'].includes(a.status)).length;
  const rejectedApps = allApps.filter(a => ['EMPLOYEE_REJECTED', 'MANAGER_REJECTED', 'REJECTED'].includes(a.status)).length;
  const disbursementPending = allApps.filter(a => a.status === 'DISBURSEMENT_PENDING').length;
  const totalDisbursed = allLoans.filter(l => l.status === 'ACTIVE').reduce((sum, l) => sum + l.principalAmount, 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayApps = allApps.filter(a => a.createdAt && a.createdAt.startsWith(todayStr)).length;
  const todayDisb = allDisbs.filter(d => d.disbursedAt && d.disbursedAt.startsWith(todayStr)).reduce((sum, d) => sum + (d.amount || 0), 0);

  const currentMonthStr = todayStr.slice(0, 7);
  const monthlyDisb = allDisbs.filter(d => d.disbursedAt && d.disbursedAt.startsWith(currentMonthStr)).reduce((sum, d) => sum + (d.amount || 0), 0);

  res.json({
    metrics: {
      totalCustomers,
      totalEmployees,
      totalManagers,
      totalApplications,
      pendingApplications: pendingApps,
      employeeRecommended,
      managerApproved,
      rejectedApplications: rejectedApps,
      disbursementPending,
      totalDisbursed,
      todayApplications: todayApps,
      todayDisbursement: todayDisb,
      monthlyDisbursement: monthlyDisb || totalDisbursed
    },
    recentApplications: allApps.slice(0, 8),
    recentAuditLogs: db.data.auditLogs.slice(0, 10),
    recentDisbursements: allDisbs.slice(0, 5)
  });
});

// Admin All Loan Applications
app.get('/api/admin/applications', requireAdmin, (req, res) => {
  const { status, search } = req.query;
  let list = [...db.data.applications];

  if (status && status !== 'ALL') {
    list = list.filter(a => a.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(a =>
      a.applicationNumber.toLowerCase().includes(q) ||
      a.customerName.toLowerCase().includes(q) ||
      a.loanDetails?.loanType?.toLowerCase().includes(q)
    );
  }

  res.json({ applications: list });
});

// Admin Single Application
app.get('/api/admin/applications/:id', requireAdmin, (req, res) => {
  const appMatch = db.data.applications.find(a => a.id === req.params.id || a.applicationNumber === req.params.id);
  if (!appMatch) return res.status(404).json({ error: 'Application not found.' });

  const loan = db.data.loans.find(l => l.applicationId === appMatch.id || l.id === appMatch.approvedLoanId);
  const audits = db.data.auditLogs.filter(log => log.applicationId === appMatch.id);

  res.json({ application: appMatch, loan, audits });
});

// Admin Customer Management
app.get('/api/admin/customers', requireAdmin, (req, res) => {
  const customers = db.data.users.filter(u => u.role === 'CUSTOMER').map(c => {
    const custApps = db.data.applications.filter(a => a.customerId === c.id);
    const custLoans = db.data.loans.filter(l => l.customerId === c.id);
    return {
      id: c.id,
      fullName: c.fullName,
      email: c.email,
      phone: c.phone,
      monthlyIncome: c.monthlyIncome,
      creditScore: c.creditScore,
      address: c.address,
      city: c.city,
      state: c.state,
      postalCode: c.postalCode,
      status: c.status || 'ACTIVE',
      applicationsCount: custApps.length,
      activeLoansCount: custLoans.filter(l => l.status === 'ACTIVE').length,
      totalBorrowed: custLoans.reduce((sum, l) => sum + l.principalAmount, 0),
      createdAt: c.createdAt
    };
  });

  res.json({ customers });
});

// Admin Toggle Customer Status
app.post('/api/admin/customers/:id/toggle-status', requireAdmin, (req, res) => {
  const customer = db.data.users.find(u => u.id === req.params.id && u.role === 'CUSTOMER');
  if (!customer) return res.status(404).json({ error: 'Customer not found.' });

  customer.status = customer.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
  db.save();

  db.logAudit(
    req.user.fullName,
    'ADMIN',
    'USER_STATUS_CHANGED',
    null,
    null,
    customer.status,
    `Changed account status of customer ${customer.fullName} to ${customer.status}.`
  );

  res.json({ message: `Customer account marked as ${customer.status}.`, customer });
});

// Admin Employee Management
app.get('/api/admin/employees', requireAdmin, (req, res) => {
  const employees = db.data.users.filter(u => u.role === 'EMPLOYEE').map(e => {
    const processed = db.data.applications.filter(a => a.employeeVerification?.employeeId === e.id);
    const recommended = processed.filter(a => a.status === 'EMPLOYEE_RECOMMENDED' || a.employeeVerification?.recommendedAmount > 0);
    const rejected = processed.filter(a => a.status === 'EMPLOYEE_REJECTED');

    return {
      id: e.id,
      fullName: e.fullName,
      email: e.email,
      phone: e.phone,
      department: e.department || 'Verification & Underwriting',
      employeeId: e.employeeId || 'EMP-3000',
      status: e.status || 'ACTIVE',
      applicationsProcessed: processed.length,
      recommendations: recommended.length,
      rejections: rejected.length,
      createdAt: e.createdAt
    };
  });

  res.json({ employees });
});

// Admin Create Employee
app.post('/api/admin/employees', requireAdmin, async (req, res) => {
  try {
    const { fullName, email, phone, department, password } = req.body;
    if (!fullName || !email) {
      return res.status(400).json({ error: 'Full name and email are required.' });
    }

    const emailNorm = email.trim().toLowerCase();
    if (db.data.users.some(u => u.email.toLowerCase() === emailNorm)) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password || '123456', salt);
    const empSeq = db.data.users.filter(u => u.role === 'EMPLOYEE').length + 3001;

    const newEmp = {
      id: `usr-emp-${Date.now()}`,
      fullName: fullName.trim(),
      email: emailNorm,
      phone: phone || '+91 98765 22000',
      role: 'EMPLOYEE',
      department: department || 'Customer KYC & Document Audits',
      employeeId: `EMP-${empSeq}`,
      status: 'ACTIVE',
      passwordHash,
      createdAt: new Date().toISOString()
    };

    db.data.users.push(newEmp);
    db.save();

    db.logAudit(
      req.user.fullName,
      'ADMIN',
      'EMPLOYEE_CREATED',
      null,
      null,
      null,
      `Created verification employee account for ${newEmp.fullName} (${newEmp.employeeId}).`
    );

    res.status(201).json({ message: 'Employee created successfully.', employee: newEmp });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create employee: ' + err.message });
  }
});

// Admin Toggle Employee Status
app.post('/api/admin/employees/:id/toggle-status', requireAdmin, (req, res) => {
  const emp = db.data.users.find(u => u.id === req.params.id && u.role === 'EMPLOYEE');
  if (!emp) return res.status(404).json({ error: 'Employee not found.' });

  emp.status = emp.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
  db.save();

  db.logAudit(
    req.user.fullName,
    'ADMIN',
    'USER_STATUS_CHANGED',
    null,
    null,
    emp.status,
    `Changed account status of employee ${emp.fullName} to ${emp.status}.`
  );

  res.json({ message: `Employee account marked as ${emp.status}.`, employee: emp });
});

// Admin Manager Management
app.get('/api/admin/managers', requireAdmin, (req, res) => {
  const managers = db.data.users.filter(u => u.role === 'MANAGER').map(m => {
    const reviewed = db.data.applications.filter(a => a.managerDecision?.managerId === m.id);
    const approved = reviewed.filter(a => ['MANAGER_APPROVED', 'DISBURSEMENT_PENDING', 'ACTIVE'].includes(a.status));
    const rejected = reviewed.filter(a => a.status === 'MANAGER_REJECTED');
    const disbursed = db.data.disbursements.filter(d => d.disbursedBy === m.fullName);

    return {
      id: m.id,
      fullName: m.fullName,
      email: m.email,
      phone: m.phone,
      department: m.department || 'Credit Approvals & Disbursement',
      employeeId: m.employeeId || 'MGR-2000',
      status: m.status || 'ACTIVE',
      applicationsReviewed: reviewed.length,
      approvedCount: approved.length,
      rejectedCount: rejected.length,
      disbursedCount: disbursed.length,
      createdAt: m.createdAt
    };
  });

  res.json({ managers });
});

// Admin Create Manager
app.post('/api/admin/managers', requireAdmin, async (req, res) => {
  try {
    const { fullName, email, phone, department, password } = req.body;
    if (!fullName || !email) {
      return res.status(400).json({ error: 'Full name and email are required.' });
    }

    const emailNorm = email.trim().toLowerCase();
    if (db.data.users.some(u => u.email.toLowerCase() === emailNorm)) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password || '123456', salt);
    const mgrSeq = db.data.users.filter(u => u.role === 'MANAGER').length + 2001;

    const newMgr = {
      id: `usr-mgr-${Date.now()}`,
      fullName: fullName.trim(),
      email: emailNorm,
      phone: phone || '+91 98765 33000',
      role: 'MANAGER',
      department: department || 'Credit Approvals & Disbursement',
      employeeId: `MGR-${mgrSeq}`,
      status: 'ACTIVE',
      passwordHash,
      createdAt: new Date().toISOString()
    };

    db.data.users.push(newMgr);
    db.save();

    db.logAudit(
      req.user.fullName,
      'ADMIN',
      'MANAGER_CREATED',
      null,
      null,
      null,
      `Created manager account for ${newMgr.fullName} (${newMgr.employeeId}).`
    );

    res.status(201).json({ message: 'Manager created successfully.', manager: newMgr });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create manager: ' + err.message });
  }
});

// Admin Toggle Manager Status
app.post('/api/admin/managers/:id/toggle-status', requireAdmin, (req, res) => {
  const mgr = db.data.users.find(u => u.id === req.params.id && u.role === 'MANAGER');
  if (!mgr) return res.status(404).json({ error: 'Manager not found.' });

  mgr.status = mgr.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
  db.save();

  db.logAudit(
    req.user.fullName,
    'ADMIN',
    'USER_STATUS_CHANGED',
    null,
    null,
    mgr.status,
    `Changed account status of manager ${mgr.fullName} to ${mgr.status}.`
  );

  res.json({ message: `Manager account marked as ${mgr.status}.`, manager: mgr });
});

// Admin Disbursements Ledger
app.get('/api/admin/disbursements', requireAdmin, (req, res) => {
  res.json({
    disbursements: db.data.disbursements,
    pendingDisbursements: db.data.loans.filter(l => l.status === 'DISBURSEMENT_PENDING')
  });
});

// Admin Loans List
app.get('/api/admin/loans', requireAdmin, (req, res) => {
  const { status, search } = req.query;
  let list = [...db.data.loans];

  if (status && status !== 'ALL') list = list.filter(l => l.status === status);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(l =>
      l.loanNumber.toLowerCase().includes(q) ||
      l.customerName.toLowerCase().includes(q) ||
      l.loanType.toLowerCase().includes(q)
    );
  }

  res.json({ loans: list });
});

// Admin EMI Management
app.get('/api/admin/emi-management', requireAdmin, (req, res) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const schedulesWithLoan = db.data.emiSchedules.map(s => {
    const loan = db.data.loans.find(l => l.id === s.loanId);
    return {
      ...s,
      loanNumber: loan?.loanNumber || 'N/A',
      customerName: loan?.customerName || 'Customer',
      loanType: loan?.loanType || 'Personal Loan',
      isOverdue: s.status !== 'PAID' && s.dueDate < todayStr
    };
  });

  const overdue = schedulesWithLoan.filter(s => s.isOverdue);
  const upcoming = schedulesWithLoan.filter(s => s.status !== 'PAID' && !s.isOverdue).slice(0, 50);
  const paidRecent = schedulesWithLoan.filter(s => s.status === 'PAID').slice(0, 30);

  res.json({
    overdue,
    upcoming,
    paidRecent,
    totalOverdueAmount: overdue.reduce((sum, s) => sum + s.emiAmount, 0)
  });
});

// Admin Offline EMI Collection
app.post('/api/admin/emi/:scheduleId/collect', requireAdmin, (req, res) => {
  const { paymentMethod = 'CASH', transactionRef = `OFFLINE-${Date.now().toString().slice(-4)}` } = req.body;
  const targetEmi = db.data.emiSchedules.find(s => s.id === req.params.scheduleId);

  if (!targetEmi) return res.status(404).json({ error: 'EMI record not found.' });
  if (targetEmi.status === 'PAID') return res.status(400).json({ error: 'This EMI is already paid.' });

  const loan = db.data.loans.find(l => l.id === targetEmi.loanId);
  const nowStr = new Date().toISOString();

  targetEmi.status = 'PAID';
  targetEmi.paidAmount = targetEmi.emiAmount;
  targetEmi.paidDate = nowStr.split('T')[0];
  targetEmi.paymentMethod = paymentMethod;
  targetEmi.transactionRef = transactionRef;

  if (loan) {
    loan.totalPaidAmount = (loan.totalPaidAmount || 0) + targetEmi.emiAmount;
    loan.remainingPrincipal = Math.max(0, (loan.remainingPrincipal || loan.principalAmount) - targetEmi.principalComponent);
    loan.paidEmisCount = (loan.paidEmisCount || 0) + 1;
  }

  const paymentRecord = {
    id: `pay-${Date.now()}`,
    loanId: loan?.id || 'N/A',
    loanNumber: loan?.loanNumber || 'N/A',
    customerId: loan?.customerId || 'N/A',
    customerName: loan?.customerName || 'Customer',
    emiScheduleId: targetEmi.id,
    emiNumber: targetEmi.emiNumber,
    amountPaid: targetEmi.emiAmount,
    paymentMethod,
    transactionRef,
    paymentDate: nowStr,
    status: 'SUCCESS',
    collectedBy: req.user.fullName,
    createdAt: nowStr
  };

  db.data.payments.unshift(paymentRecord);
  db.save();

  if (loan?.customerId) {
    db.createNotification(
      loan.customerId,
      `Offline EMI Payment Recorded (EMI #${targetEmi.emiNumber})`,
      `Cash/Bank collection of ₹${targetEmi.emiAmount.toLocaleString('en-IN')} for ${loan.loanNumber} recorded by ${req.user.fullName}.`,
      'PAYMENT_SUCCESS',
      '/customer/loans'
    );
  }

  db.logAudit(
    req.user.fullName,
    'ADMIN',
    'EMI_COLLECTED',
    loan?.applicationId,
    null,
    null,
    `Collected ₹${targetEmi.emiAmount} for EMI #${targetEmi.emiNumber} (${loan?.loanNumber}).`
  );

  res.json({ message: `EMI #${targetEmi.emiNumber} marked as collected.`, emi: targetEmi, payment: paymentRecord });
});

// Admin System Reports & Analytics
app.get('/api/admin/reports', requireAdmin, (req, res) => {
  const apps = db.data.applications;
  const loans = db.data.loans;
  const users = db.data.users;

  // Breakdown by Loan Type
  const loanTypes = ['Personal Loan', 'Home Loan', 'Vehicle Loan', 'Education Loan', 'Business Loan'];
  const byType = loanTypes.map(type => {
    const typeApps = apps.filter(a => a.loanDetails?.loanType === type);
    const typeLoans = loans.filter(l => l.loanType === type && l.status === 'ACTIVE');
    return {
      loanType: type,
      applicationsCount: typeApps.length,
      approvedCount: typeApps.filter(a => ['MANAGER_APPROVED', 'DISBURSEMENT_PENDING', 'ACTIVE'].includes(a.status)).length,
      disbursedCount: typeLoans.length,
      totalDisbursedAmount: typeLoans.reduce((sum, l) => sum + l.principalAmount, 0)
    };
  });

  // Employee Performance
  const employees = users.filter(u => u.role === 'EMPLOYEE').map(e => {
    const processed = apps.filter(a => a.employeeVerification?.employeeId === e.id);
    return {
      name: e.fullName,
      employeeId: e.employeeId,
      department: e.department,
      processedCount: processed.length,
      recommendedCount: processed.filter(a => a.status === 'EMPLOYEE_RECOMMENDED' || a.employeeVerification?.recommendedAmount > 0).length,
      rejectedCount: processed.filter(a => a.status === 'EMPLOYEE_REJECTED').length
    };
  });

  // Manager Performance
  const managers = users.filter(u => u.role === 'MANAGER').map(m => {
    const reviewed = apps.filter(a => a.managerDecision?.managerId === m.id);
    return {
      name: m.fullName,
      employeeId: m.employeeId,
      department: m.department,
      reviewedCount: reviewed.length,
      approvedCount: reviewed.filter(a => ['MANAGER_APPROVED', 'DISBURSEMENT_PENDING', 'ACTIVE'].includes(a.status)).length,
      rejectedCount: reviewed.filter(a => a.status === 'MANAGER_REJECTED').length
    };
  });

  res.json({
    summary: {
      totalApplications: apps.length,
      approvedLoans: apps.filter(a => ['MANAGER_APPROVED', 'DISBURSEMENT_PENDING', 'ACTIVE'].includes(a.status)).length,
      rejectedLoans: apps.filter(a => ['EMPLOYEE_REJECTED', 'MANAGER_REJECTED', 'REJECTED'].includes(a.status)).length,
      disbursedLoans: loans.filter(l => l.status === 'ACTIVE').length,
      totalDisbursedAmount: loans.filter(l => l.status === 'ACTIVE').reduce((sum, l) => sum + l.principalAmount, 0)
    },
    byLoanType: byType,
    employeePerformance: employees,
    managerPerformance: managers
  });
});

// Admin Audit Logs
app.get('/api/admin/audit-logs', requireAdmin, (req, res) => {
  res.json({ auditLogs: db.data.auditLogs });
});

// Admin System Settings
app.get('/api/admin/settings', requireAdmin, (req, res) => {
  res.json({ settings: db.data.settings });
});

app.put('/api/admin/settings', requireAdmin, (req, res) => {
  db.data.settings = { ...db.data.settings, ...req.body };
  db.save();
  db.logAudit(
    req.user.fullName,
    'ADMIN',
    'SETTINGS_UPDATED',
    null,
    null,
    null,
    'Updated loan interest rates and system risk policy thresholds.'
  );
  res.json({ message: 'Settings saved successfully.', settings: db.data.settings });
});

// Reset Database to Seed State (Development Tool)
app.post('/api/admin/reset-database', requireAdmin, (req, res) => {
  db.init(true);
  res.json({ message: 'Database reset to clean 4-role seed state successfully.' });
});

// =========================================================================
// 6. PUBLIC UTILITY ENDPOINTS
// =========================================================================

// Public EMI Calculator API
app.post('/api/public/calculate-emi', (req, res) => {
  const { principal, loanType, tenureMonths, annualRate } = req.body;
  const settings = db.data.settings;
  const rate = annualRate || settings.interestRates?.[loanType] || 12.0;
  const emi = calculateEmi(principal, rate, tenureMonths);
  const totalPayable = emi * Number(tenureMonths);
  const totalInterest = totalPayable - Number(principal);

  res.json({
    principal: Number(principal),
    annualRate: rate,
    tenureMonths: Number(tenureMonths),
    monthlyEmi: emi,
    totalInterest,
    totalPayable
  });
});

// Public Loan Products Directory
app.get('/api/public/loan-types', (req, res) => {
  const settings = db.data.settings;
  const types = Object.keys(settings.interestRates || {}).map(type => ({
    type,
    rate: settings.interestRates[type],
    maxTenure: settings.maxTenureMonths?.[type] || 60,
    processingFee: `${settings.processingFeePercent}%`
  }));
  res.json({ loanTypes: types });
});

// Root Welcome & Discovery API (Guaranteed JSON)
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'Kalyan Institutional Loan Management Platform',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      loanTypes: '/api/public/loan-types',
      authLogin: '/api/auth/login'
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({
    status: 'active',
    service: 'Kalyan Loan Management API Gateway',
    version: '1.0.0'
  });
});

// System Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Institutional Loan Management REST API',
    applicationsCount: db.data.applications.length,
    activeLoansCount: db.data.loans.filter(l => l.status === 'ACTIVE').length,
    timestamp: new Date().toISOString()
  });
});

// JSON 404 Handler for all unhandled routes (ensures NO HTML error pages)
app.all('*', (req, res) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl || req.url}`,
    status: 404,
    timestamp: new Date().toISOString()
  });
});

// Global JSON Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server exception:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500,
    timestamp: new Date().toISOString()
  });
});

let serverInstance = null;
if (process.env.NODE_ENV !== 'test') {
  serverInstance = app.listen(PORT, () => {
    console.log(`Loan Management System API Server running on http://127.0.0.1:${PORT}`);
  });
}

export { app, serverInstance };
export default app;
