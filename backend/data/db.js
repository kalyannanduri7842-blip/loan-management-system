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
      notifications: [],
      settings: {},
      auditLogs: []
    };
    this.init();
  }

  init() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        console.log(`📦 Loaded existing Loan database from ${DB_FILE}`);
        return;
      } catch (err) {
        console.warn('⚠️ Could not parse existing DB, re-seeding...', err);
      }
    }

    // Generate initial EMI schedule for loan-10001
    const schedule1 = generateEmiSchedule('loan-10001', 800000, 9.5, 48, '2026-05-15T16:00:00Z');
    // Mark first 4 EMIs as paid
    const initialPayments = [];
    for (let i = 0; i < 4; i++) {
      schedule1[i].status = 'PAID';
      schedule1[i].paidAmount = schedule1[i].emiAmount;
      schedule1[i].paidDate = schedule1[i].dueDate;
      schedule1[i].paymentMethod = 'UPI';
      schedule1[i].transactionRef = `TXN-2026-0${i + 6}-9942`;

      initialPayments.push({
        id: `pay-1000${i + 1}`,
        loanId: 'loan-10001',
        loanNumber: 'LOAN-10001',
        customerId: 'usr-cust-3',
        customerName: 'Arun Verma',
        emiScheduleId: schedule1[i].id,
        emiNumber: i + 1,
        amountPaid: schedule1[i].emiAmount,
        paymentMethod: 'UPI',
        transactionRef: `TXN-2026-0${i + 6}-9942`,
        paymentDate: schedule1[i].dueDate,
        status: 'SUCCESS',
        createdAt: schedule1[i].dueDate
      });
    }

    this.data = {
      users: SEED_USERS,
      applications: SEED_APPLICATIONS,
      loans: SEED_LOANS,
      emiSchedules: schedule1,
      payments: initialPayments,
      notifications: SEED_NOTIFICATIONS,
      settings: SEED_SETTINGS,
      auditLogs: [
        {
          id: 'log-1',
          actor: 'System Initialization',
          action: 'SYSTEM_BOOT',
          details: 'Initialized Loan Management System database.',
          timestamp: new Date().toISOString()
        }
      ]
    };

    this.save();
    console.log(`🌱 Seeded Loan database with ${this.data.applications.length} applications and ${this.data.users.length} users to ${DB_FILE}`);
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

  logAudit(actor, action, details) {
    const log = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor: actor || 'System',
      action,
      details,
      timestamp: new Date().toISOString()
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 1000) this.data.auditLogs.pop();
    this.save();
    return log;
  }
}

export const db = new LoanDatabase();
