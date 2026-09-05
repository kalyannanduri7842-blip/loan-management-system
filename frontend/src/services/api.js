const API_BASE = '/api';

function getHeaders() {
  const token = localStorage.getItem('loan_auth_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers
    }
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    throw err;
  }
}

export const api = {
  // 1. Authentication
  auth: {
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    me: () => request('/auth/me'),
    forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) })
  },

  // 2. Customer Services
  customer: {
    getDashboard: () => request('/customer/dashboard'),
    submitApplication: (applicationData) => request('/applications', { method: 'POST', body: JSON.stringify(applicationData) }),
    getMyApplications: () => request('/applications/my'),
    getApplicationById: (id) => request(`/applications/${id}`),
    getMyLoans: () => request('/loans/my'),
    getLoanById: (id) => request(`/loans/${id}`),
    getEmiSchedule: (loanId) => request(`/loans/${loanId}/emi-schedule`),
    payEmi: (loanId, payload) => request(`/loans/${loanId}/pay-emi`, { method: 'POST', body: JSON.stringify(payload) }),
    getMyPayments: () => request('/payments/my')
  },

  // 3. Employee Services
  employee: {
    getDashboard: () => request('/employee/dashboard'),
    getApplications: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/employee/applications?${query}`);
    },
    getApplicationById: (id) => request(`/employee/applications/${id}`),
    verifyDocument: (appId, docType, status = 'VERIFIED') => request(`/employee/applications/${appId}/verify-document`, {
      method: 'POST',
      body: JSON.stringify({ docType, status })
    }),
    recommendLoan: (appId, payload) => request(`/employee/applications/${appId}/recommend`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    rejectApplication: (appId, payload) => request(`/employee/applications/${appId}/reject`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    getHistory: () => request('/employee/history')
  },

  // 4. Manager Services
  manager: {
    getDashboard: () => request('/manager/dashboard'),
    getApplications: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/manager/applications?${query}`);
    },
    getApplicationById: (id) => request(`/manager/applications/${id}`),
    approveLoan: (appId, payload) => request(`/manager/applications/${appId}/approve`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    rejectLoan: (appId, payload) => request(`/manager/applications/${appId}/reject`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    disburseLoan: (appIdOrLoanId, payload = {}) => request(`/manager/applications/${appIdOrLoanId}/disburse`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    getDisbursements: () => request('/manager/disbursements')
  },

  // 5. Admin Services
  admin: {
    getDashboard: () => request('/admin/dashboard'),
    getApplications: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/applications?${query}`);
    },
    getApplicationById: (id) => request(`/admin/applications/${id}`),
    getCustomers: () => request('/admin/customers'),
    toggleCustomerStatus: (id) => request(`/admin/customers/${id}/toggle-status`, { method: 'POST' }),
    getEmployees: () => request('/admin/employees'),
    createEmployee: (payload) => request('/admin/employees', { method: 'POST', body: JSON.stringify(payload) }),
    toggleEmployeeStatus: (id) => request(`/admin/employees/${id}/toggle-status`, { method: 'POST' }),
    getManagers: () => request('/admin/managers'),
    createManager: (payload) => request('/admin/managers', { method: 'POST', body: JSON.stringify(payload) }),
    toggleManagerStatus: (id) => request(`/admin/managers/${id}/toggle-status`, { method: 'POST' }),
    getDisbursements: () => request('/admin/disbursements'),
    disburseLoan: (loanId, payload = {}) => request(`/admin/loans/${loanId}/disburse`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    getLoans: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/loans?${query}`);
    },
    getEmiManagement: () => request('/admin/emi-management'),
    collectOfflineEmi: (scheduleId, payload) => request(`/admin/emi/${scheduleId}/collect`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    getReports: () => request('/admin/reports'),
    getAuditLogs: () => request('/admin/audit-logs'),
    getSettings: () => request('/admin/settings'),
    updateSettings: (settings) => request('/admin/settings', { method: 'PUT', body: JSON.stringify(settings) }),
    resetDatabase: () => request('/admin/reset-database', { method: 'POST' })
  },

  // 6. Generic Applications & Loans Access (backward compatibility)
  applications: {
    submit: (data) => request('/applications', { method: 'POST', body: JSON.stringify(data) }),
    getMy: () => request('/applications/my'),
    getById: (id) => request(`/applications/${id}`)
  },
  loans: {
    getMy: () => request('/loans/my'),
    getById: (id) => request(`/loans/${id}`),
    getEmiSchedule: (id) => request(`/loans/${id}/emi-schedule`),
    payEmi: (id, payload) => request(`/loans/${id}/pay-emi`, { method: 'POST', body: JSON.stringify(payload) }),
    getMyPayments: () => request('/payments/my')
  },

  // 7. Notifications
  notifications: {
    getMy: () => request('/notifications/my'),
    markRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => request('/notifications/mark-all-read', { method: 'PUT' })
  },

  // 8. Public Tools
  public: {
    calculateEmi: (payload) => request('/public/calculate-emi', { method: 'POST', body: JSON.stringify(payload) }),
    getLoanTypes: () => request('/public/loan-types')
  }
};
