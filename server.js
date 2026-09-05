/**
 * KALYAN INSTITUTIONAL LOAN MANAGEMENT PLATFORM
 * Unified Master Entrypoint
 */

import { app } from './backend/server.js';

const PORT = process.env.PORT || 8080;

console.log('======================================================================');
console.log('💰 Kalyan Institutional Loan Management Platform');
console.log('Environment: ' + (process.env.NODE_ENV || 'production'));
console.log('Port: ' + PORT);
console.log('Version: 1.0.0');
console.log('======================================================================');

export default app;
