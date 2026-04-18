const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api'|| 'http://192.168.1.152:5000/api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
  error?: string;
}

// Get token from localStorage
const getToken = () => {
  const authStore = localStorage.getItem('auth-storage');
  if (!authStore) return null;

  const parsed = JSON.parse(authStore);
  return parsed?.state?.token;
};

// Fetch wrapper with auth headers
const fetchAPI = async (endpoint: string, options: RequestInit = {}): Promise<ApiResponse<any>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Request failed',
        error: data.error || response.statusText,
      };
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: 'Network error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (data: any) =>
    fetchAPI('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return Promise.resolve({ success: true, message: 'Logged out' });
  },

  getMe: () => fetchAPI('/auth/me'),

  forgotPassword: (email: string) =>
    fetchAPI('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    fetchAPI('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
};

// Farmers API
export const farmersAPI = {
  getAll: (locationId?: string) => {
    const query = locationId ? `?locationId=${locationId}` : '';
    return fetchAPI(`/farmers${query}`);
  },

  search: (q: string, locationId?: string) => {
    const query = new URLSearchParams();
    if (q) query.append('q', q);
    if (locationId) query.append('locationId', locationId);
    return fetchAPI(`/farmers/search?${query.toString()}`);
  },

  getById: (id: string) => fetchAPI(`/farmers/${id}`),

  create: (data: any) =>
    fetchAPI('/farmers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchAPI(`/farmers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/farmers/${id}`, {
      method: 'DELETE',
    }),
};

// Crops API
export const cropsAPI = {
  getAll: () => fetchAPI('/crops'),

  getById: (id: string) => fetchAPI(`/crops/${id}`),

  create: (data: any) =>
    fetchAPI('/crops', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchAPI(`/crops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/crops/${id}`, {
      method: 'DELETE',
    }),
};

// Grades API
export const gradesAPI = {
  getAll: () => fetchAPI('/grades'),

  getById: (id: string) => fetchAPI(`/grades/${id}`),

  create: (data: any) =>
    fetchAPI('/grades', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchAPI(`/grades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/grades/${id}`, {
      method: 'DELETE',
    }),
};

// Locations API
export const locationsAPI = {
  getAll: () => fetchAPI('/locations'),

  getByParentId: (parentId?: string) => {
    const query = parentId ? `?parentId=${parentId}` : '';
    return fetchAPI(`/locations${query}`);
  },

  getById: (id: string) => fetchAPI(`/locations/${id}`),

  getPath: (id: string) =>
  fetchAPI(`/locations/${id}/path`),

  create: (data: any) =>
    fetchAPI('/locations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchAPI(`/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/locations/${id}`, {
      method: 'DELETE',
    }),
};

// Warehouses API
export const warehousesAPI = {
  getAll: (locationId?: string) => {
    const query = locationId ? `?locationId=${locationId}` : '';
    return fetchAPI(`/warehouses${query}`);
  },

  getById: (id: string) => fetchAPI(`/warehouses/${id}`),

  create: (data: any) =>
    fetchAPI('/warehouses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchAPI(`/warehouses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/warehouses/${id}`, {
      method: 'DELETE',
    }),
};

// Users API
export const usersAPI = {
  getAll: (role?: string) => {
    const query = role ? `?role=${role}` : '';
    return fetchAPI(`/users${query}`);
  },

  getById: (id: string) => fetchAPI(`/users/${id}`),

  create: (data: any) =>
    fetchAPI('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchAPI(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/users/${id}`, {
      method: 'DELETE',
    }),

  changePassword: (oldPassword: string, newPassword: string) =>
    fetchAPI('/users/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    }),
};

// Roles API
export const rolesAPI = {
  getAll: () => fetchAPI('/roles'),

  getById: (id: string) => fetchAPI(`/roles/${id}`),

  create: (data: any) =>
    fetchAPI('/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchAPI(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/roles/${id}`, {
      method: 'DELETE',
    }),
};

// Prices API
export const pricesAPI = {
  getAll: () => fetchAPI('/prices'),

  getByCropAndGrade: (cropId: string, gradeId: string) =>
    fetchAPI(`/prices?cropId=${cropId}&gradeId=${gradeId}`),

  getCurrentPrices: () => fetchAPI('/prices/current'),

  getById: (id: string) => fetchAPI(`/prices/${id}`),

  create: (data: any) =>
    fetchAPI('/prices', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchAPI(`/prices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/prices/${id}`, {
      method: 'DELETE',
    }),
};

// Loans API
export const loansAPI = {
  getAll: () => fetchAPI('/loans'),

  getByFarmerId: (farmerId: string) =>
    fetchAPI(`/loans?farmerId=${farmerId}`),

  getById: (id: string) => fetchAPI(`/loans/${id}`),

  create: (data: any) =>
    fetchAPI('/loans', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchAPI(`/loans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/loans/${id}`, {
      method: 'DELETE',
    }),
};

// Purchases API
export const purchasesAPI = {
  getAll: (status?: string) => {
    const query = status ? `?status=${status}` : '';
    return fetchAPI(`/purchases${query}`);
  },

  getByFarmerId: (farmerId: string) =>
    fetchAPI(`/purchases?farmerId=${farmerId}`),

  getById: (id: string) => fetchAPI(`/purchases/${id}`),

  create: (data: any) =>
    fetchAPI('/purchases', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchAPI(`/purchases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/purchases/${id}`, {
      method: 'DELETE',
    }),
};

// Rebales API
export const rebalesAPI = {
  getAll: () => fetchAPI('/rebales'),

  getByStatus: (status: string) =>
    fetchAPI(`/rebales?status=${status}`),

  getById: (id: string) => fetchAPI(`/rebales/${id}`),

  create: (data: any) =>
    fetchAPI('/rebales', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchAPI(`/rebales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/rebales/${id}`, {
      method: 'DELETE',
    }),
};

// Transports API
export const transportsAPI = {
  getAll: () => fetchAPI('/transports'),

  getByStatus: (status: string) =>
    fetchAPI(`/transports?status=${status}`),

  getById: (id: string) => fetchAPI(`/transports/${id}`),

  create: (data: any) =>
    fetchAPI('/transports', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchAPI(`/transports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/transports/${id}`, {
      method: 'DELETE',
    }),
};

// Reports API
export const reportsAPI = {
  getDashboard: () => fetchAPI('/reports/dashboard'),

  getPurchaseReport: (startDate?: string, endDate?: string) => {
    const query = new URLSearchParams();
    if (startDate) query.append('startDate', startDate);
    if (endDate) query.append('endDate', endDate);
    return fetchAPI(`/reports/purchases?${query.toString()}`);
  },

  getLoanReport: () => fetchAPI('/reports/loans'),

  getLocationReport: (locationId?: string) => {
    const query = locationId ? `?locationId=${locationId}` : '';
    return fetchAPI(`/reports/locations${query}`);
  },

  getWarehouseReport: (warehouseId?: string) => {
    const query = warehouseId ? `?warehouseId=${warehouseId}` : '';
    return fetchAPI(`/reports/warehouses${query}`);
  },
};

export default {
  authAPI,
  farmersAPI,
  cropsAPI,
  gradesAPI,
  locationsAPI,
  warehousesAPI,
  usersAPI,
  rolesAPI,
  pricesAPI,
  loansAPI,
  purchasesAPI,
  rebalesAPI,
  transportsAPI,
  reportsAPI,
};
