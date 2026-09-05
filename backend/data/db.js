import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  SEED_USERS,
  SEED_APPLICATIONS,
  SEED_LOANS,
  SEED_NOTIFICATIONS,
  SEED_SETTINGS
} from './seedData.js';
import { generateEmiSchedule } from '../utils/loanCalculator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'loan_db.json');

class LoanDatabase {
  constructor() {
    this.data = {
      users: [],
      applications: [],
      loans: [],
      emiSchedules: [],
      payments: [],
      disbursements: [],
      notifications: [],
      settings: {},
      auditLogs: []
    };
    this.init();
  }

  init(forceReset = false) {
    if (!forceReset && fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.users.length > 0) {
          this.data = {
            users: parsed.users || [],
            applications: parsed.applications || [],
            loans: parsed.loans || [],
            emiSchedules: parsed.emiSchedules || [],
            payments: parsed.payments || [],
            disbursements: parsed.disbursements || [],
            notifications: parsed.notifications || [],
            settings: parsed.settings || SEED_SETTINGS,
            auditLogs: parsed.auditLogs || []
          };

          // Ensure default demo accounts exist
          for (const seedUser of SEED_USERS) {
            const exists = this.data.users.find(u => u.email.toLowerCase() === seedUser.email.toLowerCase());
            if (!exists) {
              this.data.users.push(seedUser);
            }
          }
          this.save();
          console.log(` Loaded Loan database from ${DB_FILE}`);
          return;
        }
      } catch (err) {
        console.warn('Could not read existing loan_db.json, reinitializing from seed data.', err);
      }
    }

    // Generate initial EMI schedule and payment for the active seed loan (loan-2002)
    const activeLoan = SEED_LOANS.find(l => l.id === 'loan-2002');
    let seedEmiSchedules = [];
    let seedPayments = [];
    let seedDisbursements = [];

    if (activeLoan) {
      seedEmiSchedules = generateEmiSchedule(
        activeLoan.id,
        activeLoan.principalAmount,
        activeLoan.annualInterestRate,
        activeLoan.tenureMonths,
        activeLoan.disbursedDate || new Date().toISOString()
      );

      // Mark the 1st EMI as PAID for active demo loan
      if (seedEmiSchedules.length > 0) {
        seedEmiSchedules[0].status = 'PAID';
        seedEmiSchedules[0].paidAmount = seedEmiSchedules[0].emiAmount;
        seedEmiSchedules[0].paidDate = '2026-03-01';
        seedEmiSchedules[0].paymentMethod = 'UPI';
        seedEmiSchedules[0].transactionRef = 'UPI-PAY-782190';

        seedPayments.push({
          id: 'pay-seed-1',
          loanId: activeLoan.id,
          loanNumber: activeLoan.loanNumber,
          customerId: activeLoan.customerId,
          customerName: activeLoan.customerName,
          emiScheduleId: seedEmiSchedules[0].id,
          emiNumber: 1,
          amountPaid: seedEmiSchedules[0].emiAmount,
          paymentMethod: 'UPI',
          transactionRef: 'UPI-PAY-782190',
          paymentDate: '2026-03-01T10:00:00Z',
          status: 'SUCCESS',
          collectedBy: 'Self (Customer Online)',
          createdAt: '2026-03-01T10:00:00Z'
        });
      }

      seedDisbursements.push({
        id: 'disb-seed-1',
        loanId: activeLoan.id,
        loanNumber: activeLoan.loanNumber,
        applicationId: activeLoan.applicationId,
        applicationNumber: activeLoan.applicationNumber,
        customerId: activeLoan.customerId,
        customerName: activeLoan.customerName,
        customerEmail: activeLoan.customerEmail,
        bankDetails: activeLoan.bankDetails,
        amount: activeLoan.principalAmount,
        disbursementRef: activeLoan.disbursementRef || 'TXN-SIM-NEFT-891024',
        disbursedBy: activeLoan.disbursedBy || 'Priya Sharma (Senior Underwriting Manager)',
        disbursedAt: activeLoan.disbursedDate || '2026-02-17T11:00:00Z',
        mode: 'SAFE_SIMULATED_TRANSFER',
        status: 'SUCCESS'
      });
    }

    this.data = {
      users: SEED_USERS,
      applications: SEED_APPLICATIONS,
      loans: SEED_LOANS,
      emiSchedules: seedEmiSchedules,
      payments: seedPayments,
      disbursements: seedDisbursements,
      notifications: SEED_NOTIFICATIONS,
      settings: SEED_SETTINGS,
      auditLogs: [
        {
          id: 'log-1',
          actor: 'System Bootstrapper',
          role: 'SYSTEM',
          action: 'SYSTEM_BOOT',
          applicationId: null,
          prevStatus: null,
          newStatus: null,
          details: 'Initialized comprehensive multi-role Loan Management System with 4 connected roles: Customer, Employee, Manager, Admin.',
          timestamp: new Date().toISOString()
        },
        {
          id: 'log-2',
          actor: 'Rahul Deshmukh (Verification Officer)',
          role: 'EMPLOYEE',
          action: 'EMPLOYEE_RECOMMENDED',
          applicationId: 'app-1003',
          prevStatus: 'EMPLOYEE_REVIEW',
          newStatus: 'EMPLOYEE_RECOMMENDED',
          details: 'Verified KYC, CIBIL (810) and salary documents for Anita Sharma. Recommended ₹35,00,000 for 180 months.',
          timestamp: '2026-03-01T11:30:00Z'
        },
        {
          id: 'log-3',
          actor: 'Priya Sharma (Senior Underwriting Manager)',
          role: 'MANAGER',
          action: 'MANAGER_APPROVED',
          applicationId: 'app-1004',
          prevStatus: 'EMPLOYEE_RECOMMENDED',
          newStatus: 'DISBURSEMENT_PENDING',
          details: 'Reviewed and sanctioned loan of ₹7,50,000 for Sneha Reddy @ 11.5% p.a. Awaiting disbursement.',
          timestamp: '2026-03-02T09:15:00Z'
        },
        {
          id: 'log-4',
          actor: 'Priya Sharma (Senior Underwriting Manager)',
          role: 'MANAGER',
          action: 'LOAN_DISBURSED',
          applicationId: 'app-1005',
          prevStatus: 'DISBURSEMENT_PENDING',
          newStatus: 'ACTIVE',
          details: 'Disbursed ₹6,00,000 for Rajesh Gupta (Kotak Mahindra Bank). Ref: TXN-SIM-NEFT-891024.',
          timestamp: '2026-02-17T11:00:00Z'
        }
      ]
    };

    this.save();
    console.log(` Initialized clean Loan database at ${DB_FILE}`);
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database:', err);
    }
  }

  createNotification(userId, title, message, type, link = '') {
    const notif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      title,
      message,
      type,
      link,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    this.data.notifications.unshift(notif);
    if (this.data.notifications.length > 500) this.data.notifications.pop();
    this.save();
    return notif;
  }

  logAudit(actor, role, action, applicationId = null, prevStatus = null, newStatus = null, details = '') {
    const log = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor: actor || 'System',
      role: role || 'SYSTEM',
      action,
      applicationId: applicationId || null,
      prevStatus: prevStatus || null,
      newStatus: newStatus || null,
      details: details || '',
      timestamp: new Date().toISOString()
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 1000) this.data.auditLogs.pop();
    this.save();
    return log;
  }
}

export const db = new LoanDatabase();
