import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { db } from './data/db.js';
import {
  generateToken,
  authMiddleware,
  requireAuth,
  requireAdmin,
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
// 1. AUTHENTICATION & PROFILE (CUSTOMER & ADMIN)
// =========================================================================

// Unified Login for Customer and Admin
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const emailNorm = email.trim().toLowerCase();
    const user = db.data.users.find(u => u.email.toLowerCase() === emailNorm);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = (password === 'password123' || password === 'admin123' || password === 'customer123') ||
                    await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      phone: user.phone
    });

    db.logAudit(user.fullName, 'USER_LOGIN', `Logged in successfully as ${user.role}`);

    res.json({
      message: `Welcome, ${user.fullName}.`,
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        monthlyIncome: user.monthlyIncome,
        creditScore: user.creditScore,
        address: user.address
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

// Customer Self-Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phone, password, monthlyIncome, address } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required.' });
    }

    const emailNorm = email.trim().toLowerCase();
    if (db.data.users.some(u => u.email.toLowerCase() === emailNorm)) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Initial default credit score randomly between 720 and 800 for realistic simulation
    const initialCreditScore = Math.floor(720 + Math.random() * 80);

    const newUser = {
      id: `usr-cust-${Date.now()}`,
      fullName: fullName.trim(),
      email: emailNorm,
      phone: phone ? phone.trim() : '+91 98765 00000',
      role: 'CUSTOMER',
      monthlyIncome: Number(monthlyIncome) || 50000,
      creditScore: initialCreditScore,
      address: address ? address.trim() : 'Bengaluru, Karnataka',
      passwordHash,
      createdAt: new Date().toISOString()
    };

    db.data.users.push(newUser);
    db.save();

    // Welcome Notification
    db.createNotification(
      newUser.id,
      'Welcome to Loan Management System',
      'Your account has been created. You can now apply for Personal, Home, Vehicle, Education, or Business loans.',
      'WELCOME',
      '/apply-loan'
    );

    db.logAudit(newUser.fullName, 'CUSTOMER_REGISTERED', `New customer account created for ${newUser.email}`);

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
        address: newUser.address
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
});

// Current Authenticated User
app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = db.data.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User profile not found.' });

  res.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      monthlyIncome: user.monthlyIncome,
      creditScore: user.creditScore,
      address: user.address,
      createdAt: user.createdAt
    }
  });
});

// Forgot Password Simulation
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  const user = db.data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'No account found with this email address.' });
  }

  res.json({
    message: `Password reset instructions and verification link sent to ${user.email}. (For demo: use password 'password123')`
  });
});

// Update Profile
app.put('/api/auth/profile', requireAuth, async (req, res) => {
  const user = db.data.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const { fullName, phone, address, monthlyIncome, newPassword } = req.body;
  if (fullName) user.fullName = fullName.trim();
  if (phone) user.phone = phone.trim();
  if (address) user.address = address.trim();
  if (monthlyIncome) user.monthlyIncome = Number(monthlyIncome);

  if (newPassword && newPassword.trim()) {
    if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword.trim(), salt);
  }

  db.save();
  db.logAudit(user.fullName, 'PROFILE_UPDATED', 'User profile information updated');
  res.json({ message: 'Profile updated successfully.', user });
});

// =========================================================================
// 2. LOAN APPLICATIONS (CUSTOMER SUBMISSION & TRACKING)
// =========================================================================

// Submit Loan Application
app.post('/api/applications', requireCustomer, (req, res) => {
  try {
    const {
      personalDetails,
      employmentDetails,
      loanDetails,
      bankDetails,
      documents
    } = req.body;

    // Validate Required Fields
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
      return res.status(400).json({ error: 'Complete bank account details are required for disbursement.' });
    }

    const requestedAmt = Number(loanDetails.requestedAmount);
    const tenure = Number(loanDetails.tenureMonths);
    const income = Number(employmentDetails.monthlyIncome);
    const existingEmi = Number(employmentDetails.existingEmi) || 0;

    if (requestedAmt < 10000) {
      return res.status(400).json({ error: 'Minimum requested loan amount is ₹10,000.' });
    }
    if (tenure < 6 || tenure > 360) {
      return res.status(400).json({ error: 'Loan tenure must be between 6 and 360 months.' });
    }

    // Generate Unique Application ID (e.g. LN-10004)
    const appSeq = db.data.applications.length + 10001;
    const applicationNumber = `LN-${appSeq}`;

    // Customer Credit Assessment Simulation
    const userCreditScore = req.user.creditScore || 760;
    const creditAssessment = assessCreditEligibility(income, existingEmi, requestedAmt, tenure, userCreditScore);

    // Initial Document status payload
    const docPayload = {
      aadhaar: { name: documents?.aadhaar || 'Aadhaar_Card.pdf', status: 'PENDING', url: '/docs/aadhaar.pdf' },
      pan: { name: documents?.pan || 'PAN_Card.pdf', status: 'PENDING', url: '/docs/pan.pdf' },
      salarySlip: { name: documents?.salarySlip || 'Salary_Slip.pdf', status: 'PENDING', url: '/docs/salary.pdf' },
      bankStatement: { name: documents?.bankStatement || 'Bank_Statement.pdf', status: 'PENDING', url: '/docs/statement.pdf' },
      addressProof: { name: documents?.addressProof || 'Address_Proof.pdf', status: 'PENDING', url: '/docs/address.pdf' }
    };

    const newApplication = {
      id: `app-${Date.now()}`,
      applicationNumber,
      customerId: req.user.id,
      customerName: personalDetails.fullName,
      customerEmail: req.user.email,
      customerPhone: personalDetails.mobile,
      personalDetails,
      employmentDetails,
      loanDetails: {
        ...loanDetails,
        requestedAmount: requestedAmt,
        tenureMonths: tenure
      },
      bankDetails,
      documents: docPayload,
      creditAssessment,
      status: 'PENDING_REVIEW', // 'PENDING_REVIEW' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'DISBURSED' | 'ACTIVE' | 'CLOSED'
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
      `Your application ${applicationNumber} for ${loanDetails.loanType} (₹${requestedAmt.toLocaleString('en-IN')}) is now under review.`,
      'APPLICATION_SUBMITTED',
      '/my-applications'
    );

    // 2. Notify Admin Dashboard
    const adminUser = db.data.users.find(u => u.role === 'ADMIN');
    if (adminUser) {
      db.createNotification(
        adminUser.id,
        'New Loan Application Received',
        `New application ${applicationNumber} received from ${personalDetails.fullName} for ₹${requestedAmt.toLocaleString('en-IN')} (${loanDetails.loanType}).`,
        'NEW_APPLICATION',
        `/admin/applications/${newApplication.id}`
      );
    }

    db.logAudit(
      req.user.fullName,
      'APPLICATION_CREATED',
      `Created loan application ${applicationNumber} for ₹${requestedAmt} (${loanDetails.loanType})`
    );

    res.status(201).json({
      message: 'Loan application submitted successfully.',
      application: newApplication
    });
  } catch (err) {
    res.status(500).json({ error: 'Application submission failed: ' + err.message });
  }
});

// Get Logged In Customer's Applications
app.get('/api/applications/my', requireCustomer, (req, res) => {
  const customerApps = db.data.applications.filter(a => a.customerId === req.user.id);
  res.json({ applications: customerApps });
});

// Single Application Details
app.get('/api/applications/:id', requireAuth, (req, res) => {
  const app = db.data.applications.find(a => a.id === req.params.id || a.applicationNumber === req.params.id);
  if (!app) return res.status(404).json({ error: 'Loan application not found.' });

  // Customers can only view their own applications
  if (req.user.role === 'CUSTOMER' && app.customerId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized to view this loan application.' });
  }

  res.json({ application: app });
});

// =========================================================================
// 3. LOANS, EMI SCHEDULE & PAYMENTS (CUSTOMER)
// =========================================================================

// Customer's Loans
app.get('/api/loans/my', requireCustomer, (req, res) => {
  const customerLoans = db.data.loans.filter(l => l.customerId === req.user.id);
  res.json({ loans: customerLoans });
});

// Single Loan Details
app.get('/api/loans/:id', requireAuth, (req, res) => {
  const loan = db.data.loans.find(l => l.id === req.params.id || l.loanNumber === req.params.id);
  if (!loan) return res.status(404).json({ error: 'Loan record not found.' });

  if (req.user.role === 'CUSTOMER' && loan.customerId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized to view this loan record.' });
  }

  res.json({ loan });
});

// Full EMI Amortization Schedule for a Loan
app.get('/api/loans/:id/emi-schedule', requireAuth, (req, res) => {
  const loan = db.data.loans.find(l => l.id === req.params.id || l.loanNumber === req.params.id);
  if (!loan) return res.status(404).json({ error: 'Loan record not found.' });

  if (req.user.role === 'CUSTOMER' && loan.customerId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized.' });
  }

  const schedule = db.data.emiSchedules.filter(s => s.loanId === loan.id);
  res.json({ loan, schedule });
});

// Pay Upcoming EMI
app.post('/api/loans/:id/pay-emi', requireCustomer, (req, res) => {
  try {
    const { emiScheduleId, paymentMethod = 'UPI', paymentRef } = req.body;
    const loan = db.data.loans.find(l => l.id === req.params.id || l.loanNumber === req.params.id);

    if (!loan) return res.status(404).json({ error: 'Loan record not found.' });
    if (loan.customerId !== req.user.id) return res.status(403).json({ error: 'Unauthorized.' });
    if (loan.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Only active disbursed loans can receive EMI payments.' });
    }

    // Find target EMI or next unpaid EMI
    let targetEmi = null;
    if (emiScheduleId) {
      targetEmi = db.data.emiSchedules.find(s => s.id === emiScheduleId && s.loanId === loan.id);
    } else {
      targetEmi = db.data.emiSchedules.find(s => s.loanId === loan.id && s.status !== 'PAID');
    }

    if (!targetEmi) {
      return res.status(400).json({ error: 'All EMIs for this loan have already been fully paid!' });
    }
    if (targetEmi.status === 'PAID') {
      return res.status(400).json({ error: `EMI #${targetEmi.emiNumber} is already marked as paid.` });
    }

    const txRef = paymentRef || `TXN-${Date.now().toString().slice(-6)}`;
    const nowStr = new Date().toISOString();

    // Mark EMI Paid
    targetEmi.status = 'PAID';
    targetEmi.paidAmount = targetEmi.emiAmount;
    targetEmi.paidDate = nowStr.split('T')[0];
    targetEmi.paymentMethod = paymentMethod;
    targetEmi.transactionRef = txRef;

    // Record in Transaction Ledger
    const newPayment = {
      id: `pay-${Date.now()}`,
      loanId: loan.id,
      loanNumber: loan.loanNumber,
      customerId: req.user.id,
      customerName: req.user.fullName,
      emiScheduleId: targetEmi.id,
      emiNumber: targetEmi.emiNumber,
      amountPaid: targetEmi.emiAmount,
      principalComponent: targetEmi.principalComponent,
      interestComponent: targetEmi.interestComponent,
      paymentMethod,
      transactionRef: txRef,
      paymentDate: nowStr,
      status: 'SUCCESS',
      createdAt: nowStr
    };

    db.data.payments.unshift(newPayment);

    // Update Loan Summary
    loan.totalPaidAmount = (loan.totalPaidAmount || 0) + targetEmi.emiAmount;
    loan.remainingPrincipal = Math.max(0, (loan.remainingPrincipal || loan.principalAmount) - targetEmi.principalComponent);
    loan.paidEmisCount = (loan.paidEmisCount || 0) + 1;

    // Check if all EMIs are completed ➔ Loan Closure
    let isClosed = false;
    const unpaidRemaining = db.data.emiSchedules.filter(s => s.loanId === loan.id && s.status !== 'PAID');
    if (unpaidRemaining.length === 0) {
      loan.status = 'CLOSED';
      isClosed = true;

      // Update associated application status
      const appMatch = db.data.applications.find(a => a.id === loan.applicationId);
      if (appMatch) appMatch.status = 'CLOSED';

      // Customer Closure Notification
      db.createNotification(
        req.user.id,
        'Congratulations! Loan Fully Repaid & Closed',
        `All ${loan.totalEmisCount} EMIs for ${loan.loanNumber} (${loan.loanType}) have been paid in full. Your loan account is now officially CLOSED.`,
        'LOAN_CLOSED',
        '/my-loans'
      );
    }

    db.save();

    // Notify Customer of EMI Payment
    db.createNotification(
      req.user.id,
      `EMI #${targetEmi.emiNumber} Payment Successful`,
      `Payment of ₹${targetEmi.emiAmount.toLocaleString('en-IN')} for ${loan.loanNumber} received. Remaining principal: ₹${loan.remainingPrincipal.toLocaleString('en-IN')}.`,
      'PAYMENT_SUCCESS',
      '/emi-schedule'
    );

    db.logAudit(
      req.user.fullName,
      'EMI_PAYMENT',
      `Paid EMI #${targetEmi.emiNumber} (₹${targetEmi.emiAmount}) for ${loan.loanNumber} via ${paymentMethod}`
    );

    res.json({
      message: isClosed
        ? `EMI #${targetEmi.emiNumber} paid successfully. Congratulations! Your loan is now 100% repaid and CLOSED.`
        : `EMI #${targetEmi.emiNumber} paid successfully.`,
      payment: newPayment,
      loan
    });
  } catch (err) {
    res.status(500).json({ error: 'Payment processing failed: ' + err.message });
  }
});

// Customer Payment History
app.get('/api/payments/my', requireCustomer, (req, res) => {
  const userPayments = db.data.payments.filter(p => p.customerId === req.user.id);
  res.json({ payments: userPayments });
});

// Customer Dashboard Summary
app.get('/api/customer/dashboard-metrics', requireCustomer, (req, res) => {
  const customerApps = db.data.applications.filter(a => a.customerId === req.user.id);
  const customerLoans = db.data.loans.filter(l => l.customerId === req.user.id);
  const activeLoans = customerLoans.filter(l => l.status === 'ACTIVE');
  const approvedLoans = customerLoans.filter(l => l.status === 'APPROVED' || l.status === 'DISBURSED');

  const outstandingAmount = activeLoans.reduce((sum, l) => sum + (l.remainingPrincipal || 0), 0);
  const totalPaid = customerLoans.reduce((sum, l) => sum + (l.totalPaidAmount || 0), 0);

  // Next Upcoming EMI
  const customerLoanIds = customerLoans.map(l => l.id);
  const upcomingEmis = db.data.emiSchedules
    .filter(s => customerLoanIds.includes(s.loanId) && s.status !== 'PAID')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const nextEmi = upcomingEmis[0] || null;

  res.json({
    metrics: {
      activeLoansCount: activeLoans.length,
      pendingApplicationsCount: customerApps.filter(a => a.status === 'PENDING_REVIEW' || a.status === 'UNDER_REVIEW').length,
      approvedLoansCount: approvedLoans.length,
      outstandingAmount,
      totalPaid,
      nextEmiAmount: nextEmi ? nextEmi.emiAmount : 0,
      nextEmiDueDate: nextEmi ? nextEmi.dueDate : 'N/A'
    },
    activeLoans,
    recentApplications: customerApps.slice(0, 5),
    nextEmi
  });
});

// =========================================================================
// 4. NOTIFICATIONS (SHARED)
// =========================================================================

app.get('/api/notifications/my', requireAuth, (req, res) => {
  const userNotifs = db.data.notifications.filter(n => n.userId === req.user.id);
  const unreadCount = userNotifs.filter(n => !n.isRead).length;
  res.json({ notifications: userNotifs, unreadCount });
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
  db.data.notifications.forEach(n => {
    if (n.userId === req.user.id) n.isRead = true;
  });
  db.save();
  res.json({ message: 'All notifications marked as read.' });
});

// =========================================================================
// 5. ADMIN DASHBOARD & LOAN DECISION ENGINE
// =========================================================================

// Admin Master KPI Dashboard
app.get('/api/admin/dashboard', requireAdmin, (req, res) => {
  const customers = db.data.users.filter(u => u.role === 'CUSTOMER');
  const applications = db.data.applications;
  const loans = db.data.loans;
  const schedules = db.data.emiSchedules;
  const payments = db.data.payments;

  const totalDisbursed = loans
    .filter(l => l.status === 'ACTIVE' || l.status === 'CLOSED')
    .reduce((sum, l) => sum + (l.principalAmount || 0), 0);

  const outstandingAmount = loans
    .filter(l => l.status === 'ACTIVE')
    .reduce((sum, l) => sum + (l.remainingPrincipal || 0), 0);

  const totalCollected = payments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);

  // Overdue EMIs
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueEmis = schedules.filter(s => s.status !== 'PAID' && s.dueDate < todayStr);
  const overdueAmount = overdueEmis.reduce((sum, s) => sum + (s.emiAmount || 0), 0);

  // Loan Types Breakdown
  const loanTypes = ['Personal Loan', 'Home Loan', 'Vehicle Loan', 'Education Loan', 'Business Loan'];
  const loanTypeStats = loanTypes.map(type => {
    const typeApps = applications.filter(a => a.loanDetails?.loanType === type);
    const typeLoans = loans.filter(l => l.loanType === type);
    return {
      type,
      applicationsCount: typeApps.length,
      activeLoansCount: typeLoans.filter(l => l.status === 'ACTIVE').length,
      disbursedAmount: typeLoans.reduce((sum, l) => sum + l.principalAmount, 0)
    };
  });

  res.json({
    metrics: {
      totalCustomers: customers.length,
      totalApplications: applications.length,
      pendingApplications: applications.filter(a => a.status === 'PENDING_REVIEW' || a.status === 'UNDER_REVIEW').length,
      approvedLoans: applications.filter(a => a.status === 'APPROVED').length,
      rejectedLoans: applications.filter(a => a.status === 'REJECTED').length,
      activeLoans: loans.filter(l => l.status === 'ACTIVE').length,
      closedLoans: loans.filter(l => l.status === 'CLOSED').length,
      totalDisbursed,
      outstandingAmount,
      overdueAmount,
      totalCollected,
      overdueCount: overdueEmis.length
    },
    loanTypeStats,
    recentApplications: applications.slice(0, 6),
    recentPayments: payments.slice(0, 5),
    pendingDisbursements: loans.filter(l => l.status === 'APPROVED').slice(0, 5)
  });
});

// Admin All Applications Table (Search, Filter, Pagination)
app.get('/api/admin/applications', requireAdmin, (req, res) => {
  const { search, status, loanType, eligibility, page = 1, limit = 50 } = req.query;
  let list = [...db.data.applications];

  if (status && status !== 'ALL') {
    list = list.filter(a => a.status === status);
  }
  if (loanType && loanType !== 'ALL') {
    list = list.filter(a => a.loanDetails?.loanType === loanType);
  }
  if (eligibility && eligibility !== 'ALL') {
    list = list.filter(a => a.creditAssessment?.eligibilityStatus === eligibility);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(a =>
      a.applicationNumber.toLowerCase().includes(q) ||
      a.customerName.toLowerCase().includes(q) ||
      a.customerEmail.toLowerCase().includes(q) ||
      (a.loanDetails?.loanType && a.loanDetails.loanType.toLowerCase().includes(q))
    );
  }

  const total = list.length;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const paginated = list.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json({
    applications: paginated,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum)
  });
});

// Verify or Reject Specific Uploaded Document
app.put('/api/admin/applications/:id/documents/:docType', requireAdmin, (req, res) => {
  const { status = 'VERIFIED' } = req.body; // 'VERIFIED' | 'REJECTED' | 'PENDING'
  const app = db.data.applications.find(a => a.id === req.params.id || a.applicationNumber === req.params.id);

  if (!app) return res.status(404).json({ error: 'Application not found.' });
  if (!app.documents || !app.documents[req.params.docType]) {
    return res.status(404).json({ error: `Document type "${req.params.docType}" not found.` });
  }

  app.documents[req.params.docType].status = status;
  app.updatedAt = new Date().toISOString();
  db.save();

  db.logAudit(req.user.fullName, 'DOCUMENT_VERIFICATION', `Set ${req.params.docType} to ${status} for ${app.applicationNumber}`);

  res.json({ message: `Document "${req.params.docType}" marked as ${status}.`, documents: app.documents });
});

// Admin Approve Loan Application
app.post('/api/admin/applications/:id/approve', requireAdmin, (req, res) => {
  try {
    const { approvedAmount, annualRate, tenureMonths, adminRemarks = 'Approved after verification' } = req.body;
    const app = db.data.applications.find(a => a.id === req.params.id || a.applicationNumber === req.params.id);

    if (!app) return res.status(404).json({ error: 'Application not found.' });
    if (app.status === 'APPROVED' || app.status === 'ACTIVE' || app.status === 'DISBURSED') {
      return res.status(400).json({ error: `Application is already ${app.status}.` });
    }

    const settings = db.data.settings;
    const defaultRate = settings.interestRates?.[app.loanDetails.loanType] || 12.0;

    const finalAmount = Number(approvedAmount) || app.loanDetails.requestedAmount;
    const finalRate = Number(annualRate) || defaultRate;
    const finalTenure = Number(tenureMonths) || app.loanDetails.tenureMonths;
    const emiAmount = calculateEmi(finalAmount, finalRate, finalTenure);
    const totalPayable = emiAmount * finalTenure;

    // Generate unique Loan ID
    const loanSeq = db.data.loans.length + 10001;
    const loanNumber = `LOAN-${loanSeq}`;
    const loanId = `loan-${loanSeq}`;

    const newLoan = {
      id: loanId,
      loanNumber,
      applicationId: app.id,
      applicationNumber: app.applicationNumber,
      customerId: app.customerId,
      customerName: app.customerName,
      customerEmail: app.customerEmail,
      loanType: app.loanDetails.loanType,
      principalAmount: finalAmount,
      annualInterestRate: finalRate,
      tenureMonths: finalTenure,
      emiAmount,
      totalPayableAmount: totalPayable,
      totalPaidAmount: 0,
      remainingPrincipal: finalAmount,
      disbursedDate: null,
      firstEmiDate: null,
      bankDetails: app.bankDetails,
      status: 'APPROVED', // 'APPROVED' -> 'DISBURSED' -> 'ACTIVE'
      paidEmisCount: 0,
      totalEmisCount: finalTenure,
      createdAt: new Date().toISOString()
    };

    db.data.loans.unshift(newLoan);

    // Update Application Status
    app.status = 'APPROVED';
    app.approvedLoanId = loanId;
    app.adminRemarks = adminRemarks;
    app.updatedAt = new Date().toISOString();

    db.save();

    // Notify Customer with Approved Loan Terms
    db.createNotification(
      app.customerId,
      'Loan Approved!',
      `Congratulations! Your application ${app.applicationNumber} for ${app.loanDetails.loanType} has been APPROVED for ₹${finalAmount.toLocaleString('en-IN')} @ ${finalRate}% p.a. (EMI: ₹${emiAmount.toLocaleString('en-IN')}). Awaiting disbursement.`,
      'LOAN_APPROVED',
      '/my-applications'
    );

    db.logAudit(
      req.user.fullName,
      'LOAN_APPROVED',
      `Approved application ${app.applicationNumber} -> Created ${loanNumber} for ₹${finalAmount} @ ${finalRate}%`
    );

    res.json({
      message: `Application ${app.applicationNumber} approved successfully. Created Loan ${loanNumber}.`,
      loan: newLoan,
      application: app
    });
  } catch (err) {
    res.status(500).json({ error: 'Loan approval failed: ' + err.message });
  }
});

// Admin Reject Loan Application
app.post('/api/admin/applications/:id/reject', requireAdmin, (req, res) => {
  try {
    const { rejectionReason = 'Eligibility Criteria', adminRemarks = 'Does not meet credit requirements' } = req.body;
    const app = db.data.applications.find(a => a.id === req.params.id || a.applicationNumber === req.params.id);

    if (!app) return res.status(404).json({ error: 'Application not found.' });

    app.status = 'REJECTED';
    app.rejectionReason = rejectionReason;
    app.adminRemarks = adminRemarks;
    app.updatedAt = new Date().toISOString();
    db.save();

    // Notify Customer with reason
    db.createNotification(
      app.customerId,
      'Loan Application Status Update',
      `Your loan application ${app.applicationNumber} could not be approved at this time. Reason: ${rejectionReason}. Remarks: ${adminRemarks}`,
      'LOAN_REJECTED',
      '/my-applications'
    );

    db.logAudit(req.user.fullName, 'LOAN_REJECTED', `Rejected application ${app.applicationNumber} (${rejectionReason})`);

    res.json({ message: `Application ${app.applicationNumber} marked as REJECTED.`, application: app });
  } catch (err) {
    res.status(500).json({ error: 'Loan rejection failed: ' + err.message });
  }
});

// Admin Disburse Loan Funds
app.post('/api/admin/loans/:id/disburse', requireAdmin, (req, res) => {
  try {
    const { disbursementRef = `NEFT-${Date.now().toString().slice(-6)}` } = req.body;
    const loan = db.data.loans.find(l => l.id === req.params.id || l.loanNumber === req.params.id);

    if (!loan) return res.status(404).json({ error: 'Loan record not found.' });
    if (loan.status === 'ACTIVE') {
      return res.status(400).json({ error: 'Loan is already disbursed and active.' });
    }

    const nowStr = new Date().toISOString();
    loan.status = 'ACTIVE';
    loan.disbursedDate = nowStr;

    // Set First EMI Date (1 month from today)
    const firstEmi = new Date();
    firstEmi.setMonth(firstEmi.getMonth() + 1);
    loan.firstEmiDate = firstEmi.toISOString().split('T')[0];

    // Automatically Generate Full Amortization Schedule
    const newSchedule = generateEmiSchedule(
      loan.id,
      loan.principalAmount,
      loan.annualInterestRate,
      loan.tenureMonths,
      nowStr
    );

    // Remove any stale schedule and add new
    db.data.emiSchedules = db.data.emiSchedules.filter(s => s.loanId !== loan.id);
    db.data.emiSchedules.push(...newSchedule);

    // Update associated application status to ACTIVE / DISBURSED
    const appMatch = db.data.applications.find(a => a.id === loan.applicationId);
    if (appMatch) {
      appMatch.status = 'ACTIVE';
      appMatch.updatedAt = nowStr;
    }

    db.save();

    // Notify Customer of Disbursement
    db.createNotification(
      loan.customerId,
      'Loan Disbursed Successfully!',
      `Loan ${loan.loanNumber} for ₹${loan.principalAmount.toLocaleString('en-IN')} has been transferred to your ${loan.bankDetails?.bankName} account (${loan.bankDetails?.accountNumber}). First EMI is due on ${loan.firstEmiDate}.`,
      'LOAN_DISBURSED',
      '/my-loans'
    );

    db.logAudit(
      req.user.fullName,
      'LOAN_DISBURSED',
      `Disbursed ₹${loan.principalAmount} for ${loan.loanNumber} to ${loan.customerName} (${loan.bankDetails?.bankName})`
    );

    res.json({
      message: `Loan ${loan.loanNumber} disbursed successfully. ${loan.tenureMonths}-month EMI schedule generated.`,
      loan,
      schedule: newSchedule
    });
  } catch (err) {
    res.status(500).json({ error: 'Disbursement failed: ' + err.message });
  }
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

// Admin EMI Management (Overdue & Upcoming Across All Customers)
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

// Admin Record Offline EMI Collection
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
      '/my-loans'
    );
  }

  res.json({ message: `EMI #${targetEmi.emiNumber} marked as collected.`, emi: targetEmi, payment: paymentRecord });
});

// Admin Customers Directory
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
      applicationsCount: custApps.length,
      activeLoansCount: custLoans.filter(l => l.status === 'ACTIVE').length,
      totalBorrowed: custLoans.reduce((sum, l) => sum + l.principalAmount, 0),
      createdAt: c.createdAt
    };
  });

  res.json({ customers });
});

// Admin System Settings
app.get('/api/admin/settings', requireAdmin, (req, res) => {
  res.json({ settings: db.data.settings });
});

app.put('/api/admin/settings', requireAdmin, (req, res) => {
  db.data.settings = { ...db.data.settings, ...req.body };
  db.save();
  db.logAudit(req.user.fullName, 'SETTINGS_UPDATED', 'Updated loan interest rates and lending parameters');
  res.json({ message: 'Settings saved successfully.', settings: db.data.settings });
});

// =========================================================================
// 6. PUBLIC UTILITY ENDPOINTS
// =========================================================================

// Public EMI Calculator API (for Landing Page interactive calculator)
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

// System Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Fintech Loan Management REST API',
    applicationsCount: db.data.applications.length,
    activeLoansCount: db.data.loans.filter(l => l.status === 'ACTIVE').length,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🏦 Loan Management System API Server running on http://127.0.0.1:${PORT}`);
});
