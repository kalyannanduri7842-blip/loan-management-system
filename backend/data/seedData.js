// SEED DATASET FOR FINTECH LOAN MANAGEMENT SYSTEM
// Exactly 2 Roles: CUSTOMER and ADMIN

export const DEFAULT_PWD_HASH = "$2a$10$wN38gQy/Vl8xYqQ2.hC0l.N6e7Hj5tQ3B4y8F6v8U9t2A1b2c3d4e"; // 'password123' / 'customer123' / 'admin123'

export const SEED_USERS = [
  {
    "id": "usr-admin-1",
    "email": "admin@loan.com",
    "fullName": "Prakash Joshi (Chief Credit Officer)",
    "phone": "+91 98765 00001",
    "role": "ADMIN",
    "passwordHash": DEFAULT_PWD_HASH,
    "createdAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "usr-cust-1",
    "email": "rahul@gmail.com",
    "fullName": "Rahul Kumar",
    "phone": "+91 98765 11111",
    "role": "CUSTOMER",
    "panNumber": "ABCDE1234F",
    "aadhaarNumber": "4589 1234 5678",
    "monthlyIncome": 75000,
    "creditScore": 780,
    "address": "Flat 302, Green Glen Heights, Bellandur, Bengaluru, Karnataka - 560103",
    "passwordHash": DEFAULT_PWD_HASH,
    "createdAt": "2026-02-10T10:00:00Z"
  },
  {
    "id": "usr-cust-2",
    "email": "priya@gmail.com",
    "fullName": "Priya Sharma",
    "phone": "+91 98765 22222",
    "role": "CUSTOMER",
    "panNumber": "FGHIJ5678K",
    "aadhaarNumber": "8912 3456 7890",
    "monthlyIncome": 125000,
    "creditScore": 810,
    "address": "House 14, Silver Oak Estate, HSR Layout, Bengaluru, Karnataka - 560102",
    "passwordHash": DEFAULT_PWD_HASH,
    "createdAt": "2026-03-01T11:30:00Z"
  },
  {
    "id": "usr-cust-3",
    "email": "arun@gmail.com",
    "fullName": "Arun Verma",
    "phone": "+91 98765 33333",
    "role": "CUSTOMER",
    "panNumber": "KLMNO9012P",
    "aadhaarNumber": "2345 6789 0123",
    "monthlyIncome": 95000,
    "creditScore": 745,
    "address": "Tower 5, Palm Meadows, Whitefield, Bengaluru, Karnataka - 560066",
    "passwordHash": DEFAULT_PWD_HASH,
    "createdAt": "2026-03-15T14:00:00Z"
  }
];

export const SEED_APPLICATIONS = [
  {
    "id": "app-10001",
    "applicationNumber": "LN-10001",
    "customerId": "usr-cust-1",
    "customerName": "Rahul Kumar",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 98765 11111",
    "personalDetails": {
      "fullName": "Rahul Kumar",
      "dob": "1992-05-14",
      "gender": "Male",
      "mobile": "+91 98765 11111",
      "email": "rahul@gmail.com",
      "address": "Flat 302, Green Glen Heights, Bellandur, Bengaluru, Karnataka - 560103"
    },
    "employmentDetails": {
      "employmentType": "Salaried",
      "companyName": "TechCorp Global Solutions Pvt Ltd",
      "monthlyIncome": 75000,
      "workExperience": "6 Years",
      "existingEmi": 5000
    },
    "loanDetails": {
      "loanType": "Personal Loan",
      "requestedAmount": 500000,
      "tenureMonths": 36,
      "loanPurpose": "Home renovation and interior woodwork"
    },
    "bankDetails": {
      "bankName": "HDFC Bank",
      "accountNumber": "50100234567890",
      "ifscCode": "HDFC0001234"
    },
    "documents": {
      "aadhaar": { "name": "Aadhaar_Card_Rahul.pdf", "status": "PENDING", "url": "/docs/aadhaar_rahul.pdf" },
      "pan": { "name": "PAN_Card_Rahul.pdf", "status": "PENDING", "url": "/docs/pan_rahul.pdf" },
      "salarySlip": { "name": "Salary_Slip_July2026.pdf", "status": "PENDING", "url": "/docs/salary_rahul.pdf" },
      "bankStatement": { "name": "Bank_Statement_6M.pdf", "status": "PENDING", "url": "/docs/bank_rahul.pdf" },
      "addressProof": { "name": "Electricity_Bill.pdf", "status": "PENDING", "url": "/docs/address_rahul.pdf" }
    },
    "creditAssessment": {
      "creditScore": 780,
      "monthlyIncome": 75000,
      "existingEmi": 5000,
      "estimatedNewEmi": 16607,
      "totalMonthlyDebt": 21607,
      "dtiRatio": 29,
      "eligibilityStatus": "ELIGIBLE",
      "assessmentNotes": "Strong financial profile and low debt-to-income ratio (29%)."
    },
    "status": "PENDING_REVIEW", // 'PENDING_REVIEW' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'DISBURSED' | 'ACTIVE' | 'CLOSED'
    "adminRemarks": "",
    "rejectionReason": "",
    "createdAt": "2026-09-01T10:15:00Z",
    "updatedAt": "2026-09-01T10:15:00Z"
  },
  {
    "id": "app-10002",
    "applicationNumber": "LN-10002",
    "customerId": "usr-cust-2",
    "customerName": "Priya Sharma",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 98765 22222",
    "personalDetails": {
      "fullName": "Priya Sharma",
      "dob": "1989-11-20",
      "gender": "Female",
      "mobile": "+91 98765 22222",
      "email": "priya@gmail.com",
      "address": "House 14, Silver Oak Estate, HSR Layout, Bengaluru, Karnataka - 560102"
    },
    "employmentDetails": {
      "employmentType": "Salaried",
      "companyName": "Oracle Financial Services",
      "monthlyIncome": 125000,
      "workExperience": "9 Years",
      "existingEmi": 0
    },
    "loanDetails": {
      "loanType": "Home Loan",
      "requestedAmount": 2500000,
      "tenureMonths": 120,
      "loanPurpose": "Purchase of residential 3BHK apartment"
    },
    "bankDetails": {
      "bankName": "State Bank of India",
      "accountNumber": "30456789012",
      "ifscCode": "SBIN0004567"
    },
    "documents": {
      "aadhaar": { "name": "Aadhaar_Priya.pdf", "status": "VERIFIED", "url": "/docs/aadhaar_priya.pdf" },
      "pan": { "name": "PAN_Priya.pdf", "status": "VERIFIED", "url": "/docs/pan_priya.pdf" },
      "salarySlip": { "name": "Salary_Slip_Priya.pdf", "status": "VERIFIED", "url": "/docs/salary_priya.pdf" },
      "bankStatement": { "name": "Bank_Statement_Priya.pdf", "status": "VERIFIED", "url": "/docs/bank_priya.pdf" },
      "addressProof": { "name": "Property_Sale_Deed.pdf", "status": "VERIFIED", "url": "/docs/deed_priya.pdf" }
    },
    "creditAssessment": {
      "creditScore": 810,
      "monthlyIncome": 125000,
      "existingEmi": 0,
      "estimatedNewEmi": 31000,
      "totalMonthlyDebt": 31000,
      "dtiRatio": 25,
      "eligibilityStatus": "ELIGIBLE",
      "assessmentNotes": "Excellent CIBIL score (810) and clean repayment track record."
    },
    "status": "APPROVED",
    "approvedLoanId": "loan-10002",
    "adminRemarks": "Approved after property title search and income verification.",
    "rejectionReason": "",
    "createdAt": "2026-08-25T14:30:00Z",
    "updatedAt": "2026-08-28T09:00:00Z"
  },
  {
    "id": "app-10003",
    "applicationNumber": "LN-10003",
    "customerId": "usr-cust-3",
    "customerName": "Arun Verma",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 98765 33333",
    "personalDetails": {
      "fullName": "Arun Verma",
      "dob": "1988-02-18",
      "gender": "Male",
      "mobile": "+91 98765 33333",
      "email": "arun@gmail.com",
      "address": "Tower 5, Palm Meadows, Whitefield, Bengaluru, Karnataka - 560066"
    },
    "employmentDetails": {
      "employmentType": "Self-Employed",
      "companyName": "Verma Logistics & Fleet",
      "monthlyIncome": 95000,
      "workExperience": "7 Years",
      "existingEmi": 10000
    },
    "loanDetails": {
      "loanType": "Vehicle Loan",
      "requestedAmount": 800000,
      "tenureMonths": 48,
      "loanPurpose": "Purchase of Electric Vehicle (Tata Nexon EV)"
    },
    "bankDetails": {
      "bankName": "ICICI Bank",
      "accountNumber": "001105009876",
      "ifscCode": "ICIC0000011"
    },
    "documents": {
      "aadhaar": { "name": "Aadhaar_Arun.pdf", "status": "VERIFIED", "url": "/docs/aadhaar_arun.pdf" },
      "pan": { "name": "PAN_Arun.pdf", "status": "VERIFIED", "url": "/docs/pan_arun.pdf" },
      "salarySlip": { "name": "ITR_Computation_Arun.pdf", "status": "VERIFIED", "url": "/docs/itr_arun.pdf" },
      "bankStatement": { "name": "Bank_Statement_Arun.pdf", "status": "VERIFIED", "url": "/docs/bank_arun.pdf" },
      "addressProof": { "name": "Vehicle_Quotation.pdf", "status": "VERIFIED", "url": "/docs/quotation_arun.pdf" }
    },
    "creditAssessment": {
      "creditScore": 745,
      "monthlyIncome": 95000,
      "existingEmi": 10000,
      "estimatedNewEmi": 20110,
      "totalMonthlyDebt": 30110,
      "dtiRatio": 32,
      "eligibilityStatus": "ELIGIBLE",
      "assessmentNotes": "Income verified via GST returns and 2-year ITR filings."
    },
    "status": "ACTIVE",
    "approvedLoanId": "loan-10001",
    "adminRemarks": "Disbursed to dealer bank account on 15-May-2026.",
    "rejectionReason": "",
    "createdAt": "2026-05-10T11:00:00Z",
    "updatedAt": "2026-05-15T16:00:00Z"
  }
];

export const SEED_LOANS = [
  {
    "id": "loan-10001",
    "loanNumber": "LOAN-10001",
    "applicationId": "app-10003",
    "customerId": "usr-cust-3",
    "customerName": "Arun Verma",
    "customerEmail": "arun@gmail.com",
    "loanType": "Vehicle Loan",
    "principalAmount": 800000,
    "annualInterestRate": 9.5,
    "tenureMonths": 48,
    "emiAmount": 20110,
    "totalPayableAmount": 965280,
    "totalPaidAmount": 80440,
    "remainingPrincipal": 742500,
    "disbursedDate": "2026-05-15T16:00:00Z",
    "firstEmiDate": "2026-06-15",
    "bankDetails": {
      "bankName": "ICICI Bank",
      "accountNumber": "001105009876",
      "ifscCode": "ICIC0000011"
    },
    "status": "ACTIVE", // 'APPROVED' | 'DISBURSED' | 'ACTIVE' | 'CLOSED'
    "paidEmisCount": 4,
    "totalEmisCount": 48,
    "createdAt": "2026-05-15T16:00:00Z"
  },
  {
    "id": "loan-10002",
    "loanNumber": "LOAN-10002",
    "applicationId": "app-10002",
    "customerId": "usr-cust-2",
    "customerName": "Priya Sharma",
    "customerEmail": "priya@gmail.com",
    "loanType": "Home Loan",
    "principalAmount": 2500000,
    "annualInterestRate": 8.5,
    "tenureMonths": 120,
    "emiAmount": 31000,
    "totalPayableAmount": 3720000,
    "totalPaidAmount": 0,
    "remainingPrincipal": 2500000,
    "disbursedDate": null,
    "firstEmiDate": "2026-10-01",
    "bankDetails": {
      "bankName": "State Bank of India",
      "accountNumber": "30456789012",
      "ifscCode": "SBIN0004567"
    },
    "status": "APPROVED", // Awaiting disbursement
    "paidEmisCount": 0,
    "totalEmisCount": 120,
    "createdAt": "2026-08-28T09:00:00Z"
  }
];

export const SEED_NOTIFICATIONS = [
  {
    "id": "notif-1",
    "userId": "usr-admin-1",
    "title": "New Loan Application Received",
    "message": "Rahul Kumar has applied for a ₹5,00,000 Personal Loan (Application ID: LN-10001).",
    "type": "NEW_APPLICATION",
    "link": "/admin/applications/app-10001",
    "isRead": false,
    "createdAt": "2026-09-01T10:15:00Z"
  },
  {
    "id": "notif-2",
    "userId": "usr-cust-2",
    "title": "Loan Approved!",
    "message": "Congratulations! Your Home Loan application LN-10002 for ₹25,00,000 has been approved. Awaiting disbursement.",
    "type": "LOAN_APPROVED",
    "link": "/my-applications",
    "isRead": false,
    "createdAt": "2026-08-28T09:00:00Z"
  },
  {
    "id": "notif-3",
    "userId": "usr-cust-3",
    "title": "Loan Disbursed Successfully",
    "message": "Your Vehicle Loan LOAN-10001 for ₹8,00,000 has been successfully credited to your ICICI Bank account.",
    "type": "LOAN_DISBURSED",
    "link": "/my-loans",
    "isRead": true,
    "createdAt": "2026-05-15T16:00:00Z"
  }
];

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
