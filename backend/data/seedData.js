// CLEAN SEED DATASET (NO FAKE / DUMMY APPLICATIONS OR LOANS)
// Exact 2 Roles: CUSTOMER and ADMIN

export const DEFAULT_PWD_HASH = "$2a$10$wN38gQy/Vl8xYqQ2.hC0l.N6e7Hj5tQ3B4y8F6v8U9t2A1b2c3d4e"; // 'admin123' / 'customer123' / 'password123'

export const SEED_USERS = [
  {
    "id": "usr-admin-1",
    "email": "admin@loan.com",
    "fullName": "Administrator (Chief Underwriting Officer)",
    "phone": "+91 98765 00001",
    "role": "ADMIN",
    "passwordHash": DEFAULT_PWD_HASH,
    "createdAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "usr-cust-1",
    "email": "customer@loan.com",
    "fullName": "Rahul Kumar",
    "phone": "+91 98765 11111",
    "role": "CUSTOMER",
    "monthlyIncome": 75000,
    "creditScore": 780,
    "address": "Bengaluru, Karnataka",
    "passwordHash": DEFAULT_PWD_HASH,
    "createdAt": "2026-01-01T00:00:00Z"
  }
];

export const SEED_APPLICATIONS = [];
export const SEED_LOANS = [];
export const SEED_NOTIFICATIONS = [];

export const SEED_SETTINGS = {
  "appName": "Loan Management System",
  "companyName": "Apex Capital & Lending Services",
  "interestRates": {
    "Personal Loan": 12.0,
    "Home Loan": 8.5,
    "Vehicle Loan": 9.5,
    "Education Loan": 10.0,
    "Business Loan": 14.0
  },
  "maxTenureMonths": {
    "Personal Loan": 60,
    "Home Loan": 360,
    "Vehicle Loan": 84,
    "Education Loan": 120,
    "Business Loan": 120
  },
  "processingFeePercent": 1.0,
  "minCreditScore": 600,
  "maxDtiRatio": 65,
  "supportEmail": "support@loanmanagement.com",
  "supportPhone": "1800-456-7890"
};
