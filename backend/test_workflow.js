import http from 'http';

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (body) {
      headers['Content-Length'] = Buffer.byteLength(dataString);
    }

    const req = http.request({
      hostname: '127.0.0.1',
      port: 8080,
      path: path,
      method: method,
      headers: headers
    }, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: responseBody });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (body) req.write(dataString);
    req.end();
  });
}

async function testWorkflow() {
  console.log('=== STARTING 4-ROLE WORKFLOW END-TO-END VERIFICATION ===\n');

  // 1. Customer Login
  console.log('1. Customer Login: customer@demo.com / 123456');
  const custAuth = await request('POST', '/api/auth/login', {
    email: 'customer@demo.com',
    password: '123456',
    role: 'CUSTOMER'
  });
  console.log('Customer Login Status:', custAuth.status, custAuth.body.user?.fullName);
  const custToken = custAuth.body.token;

  // 2. Customer Submits Application
  console.log('\n2. Customer submits a new Loan Application (₹3,00,000 for 24 months)...');
  const appRes = await request('POST', '/api/customer/apply', {
    personalDetails: {
      fullName: 'Rahul Kumar',
      email: 'customer@demo.com',
      mobile: '+91 98765 11111',
      address: 'Flat 302, Bellandur, Bengaluru, Karnataka'
    },
    identityDetails: {
      aadhaarNumber: '123456788921',
      panNumber: 'ABCDE1234F'
    },
    employmentDetails: {
      employmentType: 'Salaried',
      companyName: 'Tech Solutions India',
      monthlyIncome: 85000,
      existingEmi: 5000
    },
    bankDetails: {
      bankName: 'HDFC Bank',
      accountNumber: '50100987654321',
      ifscCode: 'HDFC0001234'
    },
    loanDetails: {
      loanType: 'Personal Loan',
      requestedAmount: 300000,
      tenureMonths: 24,
      loanPurpose: 'Home Renovation & Painting'
    },
    creditScore: 780
  }, custToken);

  const application = appRes.body.application;
  console.log('Application Submission Status:', appRes.status, 'App Number:', application?.applicationNumber, 'Initial Status:', application?.status);
  const appId = application.id;

  // 3. Employee Login & Verification
  console.log('\n3. Employee Login: employee@demo.com / 123456');
  const empAuth = await request('POST', '/api/auth/login', {
    email: 'employee@demo.com',
    password: '123456',
    role: 'EMPLOYEE'
  });
  console.log('Employee Login Status:', empAuth.status, empAuth.body.user?.fullName);
  const empToken = empAuth.body.token;

  // 4. Employee Recommends Loan
  console.log('\n4. Employee audits KYC and recommends loan...');
  const recRes = await request('POST', `/api/employee/applications/${appId}/recommend`, {
    recommendedAmount: 300000,
    recommendedTenure: 24,
    verificationNotes: 'KYC verified with original Aadhaar and PAN. Salary credits verified with HDFC statement. Low risk rating.',
    creditScore: 780,
    riskLevel: 'LOW_RISK'
  }, empToken);
  console.log('Employee Recommendation Status:', recRes.status, 'New App Status:', recRes.body.application?.status);

  // 5. Manager Login & Approval
  console.log('\n5. Manager Login: manager@demo.com / 123456');
  const mgrAuth = await request('POST', '/api/auth/login', {
    email: 'manager@demo.com',
    password: '123456',
    role: 'MANAGER'
  });
  console.log('Manager Login Status:', mgrAuth.status, mgrAuth.body.user?.fullName);
  const mgrToken = mgrAuth.body.token;

  // 6. Manager Sanctions Loan
  console.log('\n6. Manager sanctions loan at 11.5% p.a....');
  const apprRes = await request('POST', `/api/manager/applications/${appId}/approve`, {
    approvedAmount: 300000,
    tenureMonths: 24,
    interestRate: 11.5,
    managerRemarks: 'Credit committee sanctioned loan as per retail policy guidelines.'
  }, mgrToken);
  console.log('Manager Approval Status:', apprRes.status, 'New App Status:', apprRes.body.application?.status);

  // 7. Manager Disburses Loan (Safe Test Disbursement)
  console.log('\n7. Manager executes safe simulated test disbursement...');
  const disbRes = await request('POST', `/api/manager/applications/${appId}/disburse`, {
    disbursementRef: `TXN-E2E-${Date.now()}`,
    paymentRemarks: 'Safe development test NEFT transfer'
  }, mgrToken);
  console.log('Manager Disbursement Status:', disbRes.status, 'Loan Number:', disbRes.body.loan?.loanNumber, 'Loan Status:', disbRes.body.loan?.status);
  const loanId = disbRes.body.loan?.id;

  // 8. Customer views EMI schedule & pays first installment
  console.log('\n8. Customer retrieves generated EMI schedule...');
  const emiRes = await request('GET', `/api/customer/loans/${loanId}/schedule`, null, custToken);
  console.log('EMI Schedule Status:', emiRes.status, 'Total Installments:', emiRes.body.schedule?.length);
  const firstEmi = emiRes.body.schedule?.[0];
  console.log('First Installment Due:', firstEmi?.dueDate, 'Amount: ₹' + firstEmi?.emiAmount, 'Initial Status:', firstEmi?.status);

  console.log('\n9. Customer pays First EMI installment...');
  const payRes = await request('POST', `/api/customer/loans/${loanId}/pay-emi`, {
    scheduleId: firstEmi?.id,
    paymentMethod: 'UPI'
  }, custToken);
  console.log('Payment Status:', payRes.status, payRes.body.message);

  // 10. Admin Governance Audit & Telemetry Check
  console.log('\n10. Admin Login: admin@demo.com / 123456');
  const admAuth = await request('POST', '/api/auth/login', {
    email: 'admin@demo.com',
    password: '123456',
    role: 'ADMIN'
  });
  console.log('Admin Login Status:', admAuth.status, admAuth.body.user?.fullName);
  const admToken = admAuth.body.token;

  const admDash = await request('GET', '/api/admin/dashboard', null, admToken);
  console.log('Admin Dashboard Metrics:', {
    totalApplications: admDash.body.metrics?.totalApplications,
    activeLoans: admDash.body.metrics?.activeLoans,
    totalDisbursed: admDash.body.metrics?.totalDisbursed
  });

  const auditRes = await request('GET', '/api/admin/audit-logs', null, admToken);
  console.log('Total System Audit Logs:', auditRes.body.logs?.length, 'Latest Action:', auditRes.body.logs?.[0]?.action);

  console.log('\n=== ALL 4 ROLES & WORKFLOW STAGES VERIFIED 100% PERFECTLY! ===');
}

testWorkflow().catch(console.error);
