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
  auth: {
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    me: () => request('/auth/me'),
    forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) })
  },
  applications: {
    submit: (applicationData) => request('/applications', { method: 'POST', body: JSON.stringify(applicationData) }),
    getMy: () => request('/applications/my'),
    getById: (id) => request(`/applications/${id}`)
  },
  loans: {
    getMy: () => request('/loans/my'),
    getById: (id) => request(`/loans/${id}`),
    getEmiSchedule: (id) => request(`/loans/${id}/emi-schedule`),
    payEmi: (id, payload) => request(`/loans/${id}/pay-emi`, { method: 'POST', body: JSON.stringify(payload) }),
    getMyPayments: () => request('/payments/my'),
    getDashboardMetrics: () => request('/customer/dashboard-metrics')
  },
  notifications: {
    getMy: () => request('/notifications/my'),
    markRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => request('/notifications/mark-all-read', { method: 'PUT' })
  },
  admin: {
    getDashboard: () => request('/admin/dashboard'),
    getApplications: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/applications?${query}`);
    },
    getApplicationById: (id) => request(`/admin/applications/${id}`),
    verifyDocument: (appId, docType, status) => request(`/admin/applications/${appId}/documents/${docType}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),
    approveLoan: (appId, payload) => request(`/admin/applications/${appId}/approve`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    rejectLoan: (appId, payload) => request(`/admin/applications/${appId}/reject`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
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
    getCustomers: () => request('/admin/customers'),
    getSettings: () => request('/admin/settings'),
    updateSettings: (settings) => request('/admin/settings', { method: 'PUT', body: JSON.stringify(settings) })
  },
  public: {
    calculateEmi: (payload) => request('/public/calculate-emi', { method: 'POST', body: JSON.stringify(payload) }),
    getLoanTypes: () => request('/public/loan-types')
  }
};
