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
 this.data = {
 users: SEED_USERS,
 applications: SEED_APPLICATIONS,
 loans: SEED_LOANS,
 emiSchedules: [],
 payments: [],
 notifications: SEED_NOTIFICATIONS,
 settings: SEED_SETTINGS,
 auditLogs: [
 {
 id: 'log-1',
 actor: 'System',
 action: 'SYSTEM_BOOT',
 details: 'Initialized clean Loan Management System database ready for live user input.',
 timestamp: new Date().toISOString()
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
