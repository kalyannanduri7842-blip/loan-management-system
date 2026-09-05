// REALISTIC SEED DATASET WITH 4 ROLES: CUSTOMER, EMPLOYEE, MANAGER, ADMIN
// Password for all demo accounts: '123456'

export const DEFAULT_PWD_HASH = "$2a$10$wN38gQy/Vl8xYqQ2.hC0l.N6e7Hj5tQ3B4y8F6v8U9t2A1b2c3d4e"; // '123456' / 'password123'

export const SEED_USERS = [
  // 1. ADMIN USER
  {
    id: "usr-admin-1",
    email: "admin@demo.com",
    fullName: "Rajesh Varma (Chief Administrator)",
    phone: "+91 98765 00001",
    role: "ADMIN",
    department: "Executive Risk & Governance",
    employeeId: "ADM-1001",
    status: "ACTIVE",
    passwordHash: DEFAULT_PWD_HASH,
    createdAt: "2026-01-01T00:00:00Z"
  },

  // 2. MANAGER USERS (2 Managers)
  {
    id: "usr-mgr-1",
    email: "manager@demo.com",
    fullName: "Priya Sharma (Senior Underwriting Manager)",
    phone: "+91 98765 33333",
    role: "MANAGER",
    department: "Credit Approvals & Disbursement",
    employeeId: "MGR-2001",
    status: "ACTIVE",
    passwordHash: DEFAULT_PWD_HASH,
    createdAt: "2026-01-02T00:00:00Z"
  },
  {
    id: "usr-mgr-2",
    email: "priya.manager@demo.com",
    fullName: "Siddharth Sen (Regional Credit Manager)",
    phone: "+91 98765 33334",
    role: "MANAGER",
    department: "Commercial Credit & Sanctions",
    employeeId: "MGR-2002",
    status: "ACTIVE",
    passwordHash: DEFAULT_PWD_HASH,
    createdAt: "2026-01-03T00:00:00Z"
  },

  // 3. EMPLOYEE USERS (3 Verification Officers)
  {
    id: "usr-emp-1",
    email: "employee@demo.com",
    fullName: "Rahul Deshmukh (Verification Officer)",
    phone: "+91 98765 22222",
    role: "EMPLOYEE",
    department: "Customer KYC & Credit Assessment",
    employeeId: "EMP-3001",
    status: "ACTIVE",
    passwordHash: DEFAULT_PWD_HASH,
    createdAt: "2026-01-05T00:00:00Z"
  },
  {
    id: "usr-emp-2",
    email: "amit.employee@demo.com",
    fullName: "Amit Saxena (Document Verification Officer)",
    phone: "+91 98765 22223",
    role: "EMPLOYEE",
    department: "Document Audits & Legal",
    employeeId: "EMP-3002",
    status: "ACTIVE",
    passwordHash: DEFAULT_PWD_HASH,
    createdAt: "2026-01-06T00:00:00Z"
  },
  {
    id: "usr-emp-3",
    email: "neha.employee@demo.com",
    fullName: "Neha Kapoor (Risk Analyst)",
    phone: "+91 98765 22224",
    role: "EMPLOYEE",
    department: "Credit Underwriting",
    employeeId: "EMP-3003",
    status: "ACTIVE",
    passwordHash: DEFAULT_PWD_HASH,
    createdAt: "2026-01-07T00:00:00Z"
  },

  // 4. CUSTOMER USERS (8 Customers)
  {
    id: "usr-cust-1",
    email: "customer@demo.com",
    fullName: "Rahul Kumar",
    phone: "+91 98765 11111",
    role: "CUSTOMER",
    monthlyIncome: 85000,
    creditScore: 780,
    address: "Flat 302, Green Glen Heights, Bellandur, Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560103",
    status: "ACTIVE",
    passwordHash: DEFAULT_PWD_HASH,
    createdAt: "2026-01-10T00:00:00Z"
  },
  {
    id: "usr-cust-2",
    email: "anita.sharma@demo.com",
    fullName: "Anita Sharma",
    phone: "+91 98765 11112",
    role: "CUSTOMER",
    monthlyIncome: 120000,
    creditScore: 810,
    address: "B-404, Oberoi Springs, Andheri West, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400053",
    status: "ACTIVE",
    passwordHash: DEFAULT_PWD_HASH,
    createdAt: "2026-01-12T00:00:00Z"
  },
  {
    id: "usr-cust-3",
    email: "vikram.patel@demo.com",
    fullName: "Vikram Patel",
    phone: "+91 98765 11113",
    role: "CUSTOMER",
    monthlyIncome: 65000,
    creditScore: 740,
    address: "12, Shanti Niketan Society, Navrangpura, Ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    postalCode: "380009",
    status: "ACTIVE",
    passwordHash: DEFAULT_PWD_HASH,
    createdAt: "2026-01-15T00:00:00Z"
  },
  {
    id: "usr-cust-4",
    email: "deepak.verma@demo.com",
    fullName: "Deepak Verma",
    phone: "+91 98765 11114",
    role: "CUSTOMER",
    monthlyIncome: 55000,
    creditScore: 690,
    address: "H-89, South Extension Part 1, New Delhi",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110049",
    status: "ACTIVE",
    passwordHash: DEFAULT_PWD_HASH,
    createdAt: "2026-01-18T00:00:00Z"
  },
  {
    id: "usr-cust-5",
    email: "sneha.reddy@demo.com",
    fullName: "Sneha Reddy",
    phone: "+91 98765 11115",
    role: "CUSTOMER",
    monthlyIncome: 145000,
    creditScore: 825,
    address: "Plot 45, Jubilee Hills, Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    postalCode: "500033",
    status: "ACTIVE",
    passwordHash: DEFAULT_PWD_HASH,
    createdAt: "2026-01-20T00:00:00Z"
  },
  {
    id: "usr-cust-6",
    email: "rajesh.gupta@demo.com",
    fullName: "Rajesh Gupta",
    phone: "+91 98765 11116",
    role: "CUSTOMER",
    monthlyIncome: 95000,
    creditScore: 760,
    address: "7A, Lake Gardens, Kolkata",
    city: "Kolkata",
    state: "West Bengal",
    postalCode: "700045",
    status: "ACTIVE",
    passwordHash: DEFAULT_PWD_HASH,
    createdAt: "2026-01-22T00:00:00Z"
  },
  {
    id: "usr-cust-7",
    email: "pooja.mehta@demo.com",
    fullName: "Pooja Mehta",
    phone: "+91 98765 11117",
    role: "CUSTOMER",
    monthlyIncome: 70000,
    creditScore: 715,
    address: "301, Koregaon Park Road, Pune",
    city: "Pune",
    state: "Maharashtra",
    postalCode: "411001",
    status: "ACTIVE",
    passwordHash: DEFAULT_PWD_HASH,
    createdAt: "2026-01-25T00:00:00Z"
  },
  {
    id: "usr-cust-8",
    email: "suresh.nair@demo.com",
    fullName: "Suresh Nair",
    phone: "+91 98765 11118",
    role: "CUSTOMER",
    monthlyIncome: 110000,
    creditScore: 795,
    address: "T-14, Kakkanad Infopark Road, Kochi",
    city: "Kochi",
    state: "Kerala",
    postalCode: "682030",
    status: "ACTIVE",
    passwordHash: DEFAULT_PWD_HASH,
    createdAt: "2026-01-28T00:00:00Z"
  }
];

// APPLICATIONS IN DIFFERENT WORKFLOW STAGES
export const SEED_APPLICATIONS = [
  // 1. SUBMITTED / PENDING_EMPLOYEE_REVIEW: Ready for Employee Verification
  {
    id: "app-1001",
    applicationNumber: "LN-10001",
    customerId: "usr-cust-1",
    customerName: "Rahul Kumar",
    customerEmail: "customer@demo.com",
    customerPhone: "+91 98765 11111",
    personalDetails: {
      fullName: "Rahul Kumar",
      dob: "1992-05-14",
      gender: "Male",
      mobile: "+91 98765 11111",
      email: "customer@demo.com",
      address: "Flat 302, Green Glen Heights, Bellandur, Bengaluru",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560103"
    },
    identityDetails: {
      aadhaarNumber: "XXXX-XXXX-8921",
      panNumber: "ABCDE1234F",
      aadhaarVerified: false,
      panVerified: false
    },
    employmentDetails: {
      employmentType: "Salaried",
      companyName: "Infosys Limited",
      monthlyIncome: 85000,
      workExperience: "6 Years",
      existingEmi: 8000
    },
    loanDetails: {
      loanType: "Personal Loan",
      requestedAmount: 500000,
      tenureMonths: 36,
      loanPurpose: "Home renovation and interior woodwork"
    },
    bankDetails: {
      bankName: "HDFC Bank",
      accountNumber: "50100234567890",
      ifscCode: "HDFC0001234"
    },
    creditScore: 780,
    creditAssessment: {
      dtiRatio: 28.5,
      riskLevel: "LOW_RISK",
      eligibleAmount: 600000,
      recommendation: "ELIGIBLE"
    },
    documents: {
      aadhaar: { name: "Aadhaar_Card_Front_Back.pdf", status: "PENDING", url: "/docs/aadhaar.pdf" },
      pan: { name: "PAN_Card_Verified.pdf", status: "PENDING", url: "/docs/pan.pdf" },
      salarySlip: { name: "Salary_Slip_Last_3Months.pdf", status: "PENDING", url: "/docs/salary.pdf" },
      bankStatement: { name: "Bank_Statement_6Months.pdf", status: "PENDING", url: "/docs/statement.pdf" }
    },
    status: "SUBMITTED",
    adminRemarks: "",
    rejectionReason: "",
    createdAt: "2026-02-28T09:30:00Z",
    updatedAt: "2026-02-28T09:30:00Z"
  },

  // 2. EMPLOYEE_REVIEW: Currently under verification
  {
    id: "app-1002",
    applicationNumber: "LN-10002",
    customerId: "usr-cust-3",
    customerName: "Vikram Patel",
    customerEmail: "vikram.patel@demo.com",
    customerPhone: "+91 98765 11113",
    personalDetails: {
      fullName: "Vikram Patel",
      dob: "1988-11-20",
      gender: "Male",
      mobile: "+91 98765 11113",
      email: "vikram.patel@demo.com",
      address: "12, Shanti Niketan Society, Navrangpura",
      city: "Ahmedabad",
      state: "Gujarat",
      postalCode: "380009"
    },
    identityDetails: {
      aadhaarNumber: "XXXX-XXXX-4512",
      panNumber: "BKMPA9821L",
      aadhaarVerified: true,
      panVerified: true
    },
    employmentDetails: {
      employmentType: "Salaried",
      companyName: "Adani Enterprises",
      monthlyIncome: 65000,
      workExperience: "5 Years",
      existingEmi: 5000
    },
    loanDetails: {
      loanType: "Vehicle Loan",
      requestedAmount: 400000,
      tenureMonths: 48,
      loanPurpose: "Electric Passenger Vehicle Purchase"
    },
    bankDetails: {
      bankName: "State Bank of India",
      accountNumber: "30291827364",
      ifscCode: "SBIN0004521"
    },
    creditScore: 740,
    creditAssessment: {
      dtiRatio: 22.0,
      riskLevel: "LOW_RISK",
      eligibleAmount: 450000,
      recommendation: "ELIGIBLE"
    },
    documents: {
      aadhaar: { name: "Aadhaar_Vikram.pdf", status: "VERIFIED", url: "/docs/aadhaar.pdf" },
      pan: { name: "PAN_Vikram.pdf", status: "VERIFIED", url: "/docs/pan.pdf" },
      salarySlip: { name: "Salary_Slip.pdf", status: "PENDING", url: "/docs/salary.pdf" },
      bankStatement: { name: "SBI_Statement.pdf", status: "PENDING", url: "/docs/statement.pdf" }
    },
    status: "EMPLOYEE_REVIEW",
    createdAt: "2026-02-27T14:15:00Z",
    updatedAt: "2026-02-28T10:00:00Z"
  },

  // 3. EMPLOYEE_RECOMMENDED / MANAGER_REVIEW: Ready for Manager Approval
  {
    id: "app-1003",
    applicationNumber: "LN-10003",
    customerId: "usr-cust-2",
    customerName: "Anita Sharma",
    customerEmail: "anita.sharma@demo.com",
    customerPhone: "+91 98765 11112",
    personalDetails: {
      fullName: "Anita Sharma",
      dob: "1985-08-12",
      gender: "Female",
      mobile: "+91 98765 11112",
      email: "anita.sharma@demo.com",
      address: "B-404, Oberoi Springs, Andheri West",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400053"
    },
    identityDetails: {
      aadhaarNumber: "XXXX-XXXX-6734",
      panNumber: "CPSHA5432K",
      aadhaarVerified: true,
      panVerified: true
    },
    employmentDetails: {
      employmentType: "Salaried",
      companyName: "Tata Consultancy Services",
      monthlyIncome: 120000,
      workExperience: "10 Years",
      existingEmi: 12000
    },
    loanDetails: {
      loanType: "Home Loan",
      requestedAmount: 3500000,
      tenureMonths: 180,
      loanPurpose: "Residential Apartment Downpayment & Booking"
    },
    bankDetails: {
      bankName: "ICICI Bank",
      accountNumber: "001105002341",
      ifscCode: "ICIC0000011"
    },
    creditScore: 810,
    creditAssessment: {
      dtiRatio: 35.2,
      riskLevel: "LOW_RISK",
      eligibleAmount: 4000000,
      recommendation: "ELIGIBLE"
    },
    documents: {
      aadhaar: { name: "Aadhaar_Anita.pdf", status: "VERIFIED", url: "/docs/aadhaar.pdf" },
      pan: { name: "PAN_Anita.pdf", status: "VERIFIED", url: "/docs/pan.pdf" },
      salarySlip: { name: "TCS_PaySlip.pdf", status: "VERIFIED", url: "/docs/salary.pdf" },
      bankStatement: { name: "ICICI_Statement.pdf", status: "VERIFIED", url: "/docs/statement.pdf" }
    },
    employeeVerification: {
      employeeId: "usr-emp-1",
      employeeName: "Rahul Deshmukh (Verification Officer)",
      verifiedAt: "2026-03-01T11:30:00Z",
      creditScore: 810,
      riskLevel: "LOW_RISK",
      recommendedAmount: 3500000,
      recommendedTenure: 180,
      verificationNotes: "Customer KYC verified against Aadhaar & PAN. Income and 6-month bank inflows verified. Strong repayment track record. Recommended for approval at standard home loan interest rate."
    },
    status: "EMPLOYEE_RECOMMENDED",
    createdAt: "2026-02-25T11:00:00Z",
    updatedAt: "2026-03-01T11:30:00Z"
  },

  // 4. MANAGER_APPROVED / DISBURSEMENT_PENDING: Ready for Test Disbursement
  {
    id: "app-1004",
    applicationNumber: "LN-10004",
    customerId: "usr-cust-5",
    customerName: "Sneha Reddy",
    customerEmail: "sneha.reddy@demo.com",
    customerPhone: "+91 98765 11115",
    personalDetails: {
      fullName: "Sneha Reddy",
      dob: "1990-03-25",
      gender: "Female",
      mobile: "+91 98765 11115",
      email: "sneha.reddy@demo.com",
      address: "Plot 45, Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500033"
    },
    identityDetails: {
      aadhaarNumber: "XXXX-XXXX-9912",
      panNumber: "APRED8765M",
      aadhaarVerified: true,
      panVerified: true
    },
    employmentDetails: {
      employmentType: "Salaried",
      companyName: "Google India",
      monthlyIncome: 145000,
      workExperience: "7 Years",
      existingEmi: 0
    },
    loanDetails: {
      loanType: "Personal Loan",
      requestedAmount: 750000,
      tenureMonths: 36,
      loanPurpose: "Higher education and professional certifications"
    },
    bankDetails: {
      bankName: "Axis Bank",
      accountNumber: "918020045678901",
      ifscCode: "UTIB0000123"
    },
    creditScore: 825,
    creditAssessment: {
      dtiRatio: 18.0,
      riskLevel: "LOW_RISK",
      eligibleAmount: 900000,
      recommendation: "ELIGIBLE"
    },
    documents: {
      aadhaar: { name: "Aadhaar_Sneha.pdf", status: "VERIFIED", url: "/docs/aadhaar.pdf" },
      pan: { name: "PAN_Sneha.pdf", status: "VERIFIED", url: "/docs/pan.pdf" },
      salarySlip: { name: "Google_Salary.pdf", status: "VERIFIED", url: "/docs/salary.pdf" },
      bankStatement: { name: "Axis_Statement.pdf", status: "VERIFIED", url: "/docs/statement.pdf" }
    },
    employeeVerification: {
      employeeId: "usr-emp-2",
      employeeName: "Amit Saxena (Document Verification Officer)",
      verifiedAt: "2026-03-01T14:00:00Z",
      creditScore: 825,
      riskLevel: "LOW_RISK",
      recommendedAmount: 750000,
      recommendedTenure: 36,
      verificationNotes: "Excellent credit profile. Zero current liability. Recommended for full requested loan amount."
    },
    managerDecision: {
      managerId: "usr-mgr-1",
      managerName: "Priya Sharma (Senior Underwriting Manager)",
      decidedAt: "2026-03-02T09:15:00Z",
      approvedAmount: 750000,
      approvedTenure: 36,
      interestRate: 11.5,
      managerRemarks: "Sanctioned at preferential interest rate of 11.5% based on top-tier credit score and zero liabilities. Proceed to disbursement."
    },
    approvedLoanId: "loan-2001",
    status: "DISBURSEMENT_PENDING",
    createdAt: "2026-02-26T10:00:00Z",
    updatedAt: "2026-03-02T09:15:00Z"
  },

  // 5. DISBURSED / ACTIVE: Live Loan with Active EMI Schedule
  {
    id: "app-1005",
    applicationNumber: "LN-10005",
    customerId: "usr-cust-6",
    customerName: "Rajesh Gupta",
    customerEmail: "rajesh.gupta@demo.com",
    customerPhone: "+91 98765 11116",
    personalDetails: {
      fullName: "Rajesh Gupta",
      dob: "1983-09-17",
      gender: "Male",
      mobile: "+91 98765 11116",
      email: "rajesh.gupta@demo.com",
      address: "7A, Lake Gardens",
      city: "Kolkata",
      state: "West Bengal",
      postalCode: "700045"
    },
    identityDetails: {
      aadhaarNumber: "XXXX-XXXX-1123",
      panNumber: "AJGUP6543N",
      aadhaarVerified: true,
      panVerified: true
    },
    employmentDetails: {
      employmentType: "Self-Employed",
      companyName: "Gupta Engineering Works",
      monthlyIncome: 95000,
      workExperience: "12 Years",
      existingEmi: 15000
    },
    loanDetails: {
      loanType: "Business Loan",
      requestedAmount: 600000,
      tenureMonths: 24,
      loanPurpose: "Inventory expansion and machinery upgrade"
    },
    bankDetails: {
      bankName: "Kotak Mahindra Bank",
      accountNumber: "4512345678",
      ifscCode: "KKBK0000123"
    },
    creditScore: 760,
    creditAssessment: {
      dtiRatio: 36.4,
      riskLevel: "MEDIUM_RISK",
      eligibleAmount: 600000,
      recommendation: "ELIGIBLE"
    },
    documents: {
      aadhaar: { name: "Aadhaar_Rajesh.pdf", status: "VERIFIED", url: "/docs/aadhaar.pdf" },
      pan: { name: "PAN_Rajesh.pdf", status: "VERIFIED", url: "/docs/pan.pdf" },
      salarySlip: { name: "ITR_Computation.pdf", status: "VERIFIED", url: "/docs/salary.pdf" },
      bankStatement: { name: "Kotak_Statement.pdf", status: "VERIFIED", url: "/docs/statement.pdf" }
    },
    employeeVerification: {
      employeeId: "usr-emp-1",
      employeeName: "Rahul Deshmukh (Verification Officer)",
      verifiedAt: "2026-02-15T10:30:00Z",
      creditScore: 760,
      riskLevel: "LOW_RISK",
      recommendedAmount: 600000,
      recommendedTenure: 24,
      verificationNotes: "Business GST filings and 2-year ITR audited. Recommended."
    },
    managerDecision: {
      managerId: "usr-mgr-1",
      managerName: "Priya Sharma (Senior Underwriting Manager)",
      decidedAt: "2026-02-16T15:00:00Z",
      approvedAmount: 600000,
      approvedTenure: 24,
      interestRate: 13.5,
      managerRemarks: "Approved for business working capital at 13.5% p.a."
    },
    approvedLoanId: "loan-2002",
    status: "ACTIVE",
    createdAt: "2026-02-10T12:00:00Z",
    updatedAt: "2026-02-17T11:00:00Z"
  },

  // 6. EMPLOYEE_REJECTED: Document mismatch or CIBIL default
  {
    id: "app-1006",
    applicationNumber: "LN-10006",
    customerId: "usr-cust-4",
    customerName: "Deepak Verma",
    customerEmail: "deepak.verma@demo.com",
    customerPhone: "+91 98765 11114",
    personalDetails: {
      fullName: "Deepak Verma",
      dob: "1994-01-10",
      gender: "Male",
      mobile: "+91 98765 11114",
      email: "deepak.verma@demo.com",
      address: "H-89, South Extension Part 1",
      city: "New Delhi",
      state: "Delhi",
      postalCode: "110049"
    },
    identityDetails: {
      aadhaarNumber: "XXXX-XXXX-3344",
      panNumber: "DKVER1122P",
      aadhaarVerified: false,
      panVerified: false
    },
    employmentDetails: {
      employmentType: "Salaried",
      companyName: "Private Agency",
      monthlyIncome: 35000,
      workExperience: "1 Year",
      existingEmi: 22000
    },
    loanDetails: {
      loanType: "Personal Loan",
      requestedAmount: 800000,
      tenureMonths: 36,
      loanPurpose: "Unsecured personal expenses"
    },
    bankDetails: {
      bankName: "Canara Bank",
      accountNumber: "123456789012",
      ifscCode: "CNRB0001234"
    },
    creditScore: 590,
    creditAssessment: {
      dtiRatio: 78.5,
      riskLevel: "HIGH_RISK",
      eligibleAmount: 0,
      recommendation: "NOT_ELIGIBLE"
    },
    documents: {
      aadhaar: { name: "Aadhaar_Mismatch.pdf", status: "REJECTED", url: "/docs/aadhaar.pdf" },
      pan: { name: "PAN_Card.pdf", status: "PENDING", url: "/docs/pan.pdf" }
    },
    employeeVerification: {
      employeeId: "usr-emp-3",
      employeeName: "Neha Kapoor (Risk Analyst)",
      verifiedAt: "2026-02-20T16:00:00Z",
      creditScore: 590,
      riskLevel: "HIGH_RISK",
      recommendedAmount: 0,
      recommendedTenure: 0,
      verificationNotes: "DTI ratio exceeds 75%. Multiple recent defaults on credit bureau. Minimum CIBIL requirement (600) not met."
    },
    status: "EMPLOYEE_REJECTED",
    rejectionReason: "High Debt-to-Income ratio (78.5%) and Credit Bureau defaults (CIBIL < 600)",
    adminRemarks: "Rejected at verification stage due to risk policy thresholds.",
    createdAt: "2026-02-18T08:00:00Z",
    updatedAt: "2026-02-20T16:00:00Z"
  },

  // 7. MANAGER_REJECTED: Manager rejected due to exposure cap
  {
    id: "app-1007",
    applicationNumber: "LN-10007",
    customerId: "usr-cust-7",
    customerName: "Pooja Mehta",
    customerEmail: "pooja.mehta@demo.com",
    customerPhone: "+91 98765 11117",
    personalDetails: {
      fullName: "Pooja Mehta",
      dob: "1991-07-04",
      gender: "Female",
      mobile: "+91 98765 11117",
      email: "pooja.mehta@demo.com",
      address: "301, Koregaon Park Road",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411001"
    },
    identityDetails: {
      aadhaarNumber: "XXXX-XXXX-7788",
      panNumber: "PKMEH3344Q",
      aadhaarVerified: true,
      panVerified: true
    },
    employmentDetails: {
      employmentType: "Salaried",
      companyName: "Wipro Technologies",
      monthlyIncome: 70000,
      workExperience: "4 Years",
      existingEmi: 18000
    },
    loanDetails: {
      loanType: "Personal Loan",
      requestedAmount: 900000,
      tenureMonths: 60,
      loanPurpose: "Luxury vehicle purchase downpayment"
    },
    bankDetails: {
      bankName: "HDFC Bank",
      accountNumber: "50100987654321",
      ifscCode: "HDFC0000050"
    },
    creditScore: 715,
    creditAssessment: {
      dtiRatio: 48.0,
      riskLevel: "MEDIUM_RISK",
      eligibleAmount: 400000,
      recommendation: "MANUAL_REVIEW"
    },
    documents: {
      aadhaar: { name: "Aadhaar_Pooja.pdf", status: "VERIFIED", url: "/docs/aadhaar.pdf" },
      pan: { name: "PAN_Pooja.pdf", status: "VERIFIED", url: "/docs/pan.pdf" },
      salarySlip: { name: "Salary_Slip.pdf", status: "VERIFIED", url: "/docs/salary.pdf" },
      bankStatement: { name: "HDFC_Statement.pdf", status: "VERIFIED", url: "/docs/statement.pdf" }
    },
    employeeVerification: {
      employeeId: "usr-emp-1",
      employeeName: "Rahul Deshmukh (Verification Officer)",
      verifiedAt: "2026-02-22T12:00:00Z",
      creditScore: 715,
      riskLevel: "MEDIUM_RISK",
      recommendedAmount: 450000,
      recommendedTenure: 48,
      verificationNotes: "Customer requested 9L which exceeds maximum policy multiplier for 70k income. Recommended reduced amount of 4.5L."
    },
    managerDecision: {
      managerId: "usr-mgr-2",
      managerName: "Siddharth Sen (Regional Credit Manager)",
      decidedAt: "2026-02-23T14:30:00Z",
      approvedAmount: 0,
      approvedTenure: 0,
      interestRate: 0,
      managerRemarks: "Customer declined revised sanction limit of 4.5L. Unsecured exposure limit reached."
    },
    status: "MANAGER_REJECTED",
    rejectionReason: "Sanctioned amount declined by borrower / Unsecured exposure limit cap reached",
    adminRemarks: "Application closed as Manager Rejected.",
    createdAt: "2026-02-19T10:00:00Z",
    updatedAt: "2026-02-23T14:30:00Z"
  }
];

// SEED LOANS
export const SEED_LOANS = [
  // 1. Pending Disbursement Loan (for app-1004)
  {
    id: "loan-2001",
    loanNumber: "LOAN-10001",
    applicationId: "app-1004",
    applicationNumber: "LN-10004",
    customerId: "usr-cust-5",
    customerName: "Sneha Reddy",
    customerEmail: "sneha.reddy@demo.com",
    loanType: "Personal Loan",
    principalAmount: 750000,
    annualInterestRate: 11.5,
    tenureMonths: 36,
    monthlyEmi: 24734,
    totalInterest: 140424,
    totalPayable: 890424,
    totalPaidAmount: 0,
    remainingPrincipal: 750000,
    disbursedDate: null,
    firstEmiDate: null,
    bankDetails: {
      bankName: "Axis Bank",
      accountNumber: "918020045678901",
      ifscCode: "UTIB0000123"
    },
    status: "DISBURSEMENT_PENDING",
    paidEmisCount: 0,
    totalEmisCount: 36,
    createdAt: "2026-03-02T09:15:00Z"
  },

  // 2. Active Disbursed Loan (for app-1005)
  {
    id: "loan-2002",
    loanNumber: "LOAN-10002",
    applicationId: "app-1005",
    applicationNumber: "LN-10005",
    customerId: "usr-cust-6",
    customerName: "Rajesh Gupta",
    customerEmail: "rajesh.gupta@demo.com",
    loanType: "Business Loan",
    principalAmount: 600000,
    annualInterestRate: 13.5,
    tenureMonths: 24,
    monthlyEmi: 28666,
    totalInterest: 87984,
    totalPayable: 687984,
    totalPaidAmount: 28666,
    remainingPrincipal: 578000,
    disbursedDate: "2026-02-17T11:00:00Z",
    disbursementRef: "TXN-SIM-NEFT-891024",
    disbursedBy: "Priya Sharma (Senior Underwriting Manager)",
    firstEmiDate: "2026-03-17",
    bankDetails: {
      bankName: "Kotak Mahindra Bank",
      accountNumber: "4512345678",
      ifscCode: "KKBK0000123"
    },
    status: "ACTIVE",
    paidEmisCount: 1,
    totalEmisCount: 24,
    createdAt: "2026-02-16T15:00:00Z"
  }
];

// SEED NOTIFICATIONS
export const SEED_NOTIFICATIONS = [
  {
    id: "notif-1",
    userId: "usr-cust-1",
    title: "Application Submitted Successfully",
    message: "Your application LN-10001 for Personal Loan (₹5,00,000) has been submitted and is currently in the verification queue.",
    type: "APPLICATION_SUBMITTED",
    link: "/customer/applications",
    isRead: false,
    createdAt: "2026-02-28T09:30:00Z"
  },
  {
    id: "notif-2",
    userId: "usr-emp-1",
    title: "New Application in Verification Queue",
    message: "New application LN-10001 received from Rahul Kumar for ₹5,00,000 (Personal Loan).",
    type: "NEW_APPLICATION",
    link: "/employee/applications",
    isRead: false,
    createdAt: "2026-02-28T09:31:00Z"
  },
  {
    id: "notif-3",
    userId: "usr-mgr-1",
    title: "Loan Recommended by Verification Officer",
    message: "Application LN-10003 for Anita Sharma (₹35,00,000) has been recommended by Rahul Deshmukh and is awaiting your sanction.",
    type: "EMPLOYEE_RECOMMENDED",
    link: "/manager/applications",
    isRead: false,
    createdAt: "2026-03-01T11:31:00Z"
  },
  {
    id: "notif-4",
    userId: "usr-cust-5",
    title: "Loan Approved — Ready for Disbursement",
    message: "Congratulations! Your loan application LN-10004 has been approved for ₹7,50,000 by Senior Underwriting Manager Priya Sharma.",
    type: "LOAN_APPROVED",
    link: "/customer/applications",
    isRead: false,
    createdAt: "2026-03-02T09:16:00Z"
  },
  {
    id: "notif-5",
    userId: "usr-admin-1",
    title: "Executive System Update",
    message: "System running smoothly. 7 applications registered across all stages. 1 loan awaiting final disbursement.",
    type: "SYSTEM_ALERT",
    link: "/admin/dashboard",
    isRead: false,
    createdAt: "2026-03-02T09:30:00Z"
  }
];

// SYSTEM SETTINGS
export const SEED_SETTINGS = {
  appName: "Loan Management System",
  companyName: "Institutional Lending & Financial Services Ltd",
  interestRates: {
    "Personal Loan": 12.0,
    "Home Loan": 8.5,
    "Vehicle Loan": 9.5,
    "Education Loan": 10.0,
    "Business Loan": 14.0
  },
  maxTenureMonths: {
    "Personal Loan": 60,
    "Home Loan": 360,
    "Vehicle Loan": 84,
    "Education Loan": 120,
    "Business Loan": 120
  },
  processingFeePercent: 1.0,
  minCreditScore: 600,
  maxDtiRatio: 65,
  supportEmail: "support@loanmanagement.com",
  supportPhone: "1800-456-7890"
};
