// API Service for Ukulima ERP
// This service handles all API communication with the backend

const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  'http://192.168.1.152:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  const authStore = localStorage.getItem('auth-storage');
  console.log('authStore',authStore);
  
  if (authStore) {
    try {
      const { state } = JSON.parse(authStore);
      return state?.token;
    } catch {
      return null;
    }
  }
  return null;
};

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error: any) {
    console.error('API Error:', error);
    return {
      success: false,
      message: error.message || 'Network error',
    };
  }
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  signup: async (userData: any) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  getMe: async () => {
    return apiRequest('/auth/me', {
      method: 'GET',
    });
  },
  
  forgotPassword: async (email: string) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  
  updateProfile: async (userId: string, data: any) => {
    return apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Farmers API
export const farmersAPI = {
  getAll: async (params?: { locationId?: string }) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiRequest('/farmers' + query, { method: 'GET' });
  },
  
  getById: async (id: string) => {
    return apiRequest(`/farmers/${id}`, { method: 'GET' });
  },
  
  search: async (query: string, locationId?: string) => {
    const params = new URLSearchParams({ q: query });
    if (locationId) params.append('locationId', locationId);
    return apiRequest(`/farmers/search?${params.toString()}`, { method: 'GET' });
  },
  
  create: async (data: any) => {
    return apiRequest('/farmers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: async (id: string, data: any) => {
    return apiRequest(`/farmers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/farmers/${id}`, { method: 'DELETE' });
  },
};

// Crops API
export const cropsAPI = {
  getAll: async () => {
    return apiRequest('/crops', { method: 'GET' });
  },
  
  getById: async (id: string) => {
    return apiRequest(`/crops/${id}`, { method: 'GET' });
  },
  
  create: async (data: any) => {
    return apiRequest('/crops', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: async (id: string, data: any) => {
    return apiRequest(`/crops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/crops/${id}`, { method: 'DELETE' });
  },
};

// Grades API
export const gradesAPI = {
  getAll: async () => {
    return apiRequest('/grades', { method: 'GET' });
  },
  
  getById: async (id: string) => {
    return apiRequest(`/grades/${id}`, { method: 'GET' });
  },
  
  create: async (data: any) => {
    return apiRequest('/grades', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: async (id: string, data: any) => {
    return apiRequest(`/grades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/grades/${id}`, { method: 'DELETE' });
  },
};

// Locations API
export const locationsAPI = {
  getAll: async () => {
    return apiRequest('/locations', { method: 'GET' });
  },
  
  getById: async (id: string) => {
    return apiRequest(`/locations/${id}`, { method: 'GET' });
  },
  
  getByType: async (type: string) => {
    return apiRequest(`/locations/type/${type}`, { method: 'GET' });
  },
  
  getChildren: async (parentId: string) => {
    return apiRequest(`/locations/children/${parentId}`, { method: 'GET' });
  },
  
  create: async (data: any) => {
    return apiRequest('/locations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: async (id: string, data: any) => {
    return apiRequest(`/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/locations/${id}`, { method: 'DELETE' });
  },
};

// Warehouses API
export const warehousesAPI = {
  getAll: async () => {
    return apiRequest('/warehouses', { method: 'GET' });
  },
  
  getById: async (id: string) => {
    return apiRequest(`/warehouses/${id}`, { method: 'GET' });
  },
  
  getByLocation: async (locationId: string) => {
    return apiRequest(`/warehouses/location/${locationId}`, { method: 'GET' });
  },
  
  create: async (data: any) => {
    return apiRequest('/warehouses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: async (id: string, data: any) => {
    return apiRequest(`/warehouses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/warehouses/${id}`, { method: 'DELETE' });
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    return apiRequest('/users', { method: 'GET' });
  },
  
  getById: async (id: string) => {
    return apiRequest(`/users/${id}`, { method: 'GET' });
  },
  
  getByRole: async (role: string) => {
    return apiRequest(`/users/role/${role}`, { method: 'GET' });
  },
  
  create: async (data: any) => {
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: async (id: string, data: any) => {
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/users/${id}`, { method: 'DELETE' });
  },
};

// Roles API
export const rolesAPI = {
  getAll: async () => {
    return apiRequest('/roles', { method: 'GET' });
  },
  
  getById: async (id: string) => {
    return apiRequest(`/roles/${id}`, { method: 'GET' });
  },
  
  create: async (data: any) => {
    return apiRequest('/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: async (id: string, data: any) => {
    return apiRequest(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/roles/${id}`, { method: 'DELETE' });
  },
};

// Loans API
export const loansAPI = {
  getAll: async () => {
    return apiRequest('/loans', { method: 'GET' });
  },
  
  getById: async (id: string) => {
    return apiRequest(`/loans/${id}`, { method: 'GET' });
  },
  
  getFarmerLoans: async (farmerId: string) => {
    return apiRequest(`/loans/farmer/${farmerId}`, { method: 'GET' });
  },
  
  create: async (data: any) => {
    return apiRequest('/loans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  assign: async (data: any) => {
    return apiRequest('/loans/assign', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  deduct: async (data: any) => {
    return apiRequest('/loans/deduct', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: async (id: string, data: any) => {
    return apiRequest(`/loans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/loans/${id}`, { method: 'DELETE' });
  },
};

// Prices API
export const pricesAPI = {
  getAll: async () => {
    return apiRequest('/prices', { method: 'GET' });
  },
  
  getById: async (id: string) => {
    return apiRequest(`/prices/${id}`, { method: 'GET' });
  },
  
  getCurrent: async (cropId: string, gradeId: string) => {
    return apiRequest(`/prices/current/${cropId}/${gradeId}`, { method: 'GET' });
  },
  
  create: async (data: any) => {
    return apiRequest('/prices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: async (id: string, data: any) => {
    return apiRequest(`/prices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/prices/${id}`, { method: 'DELETE' });
  },
};

// Purchases API
export const purchasesAPI = {
  getAll: async (params?: { startDate?: string; endDate?: string; farmerId?: string; buyerId?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest('/purchases' + query, { method: 'GET' });
  },
  
  getById: async (id: string) => {
    return apiRequest(`/purchases/${id}`, { method: 'GET' });
  },
  
  getStats: async (params?: { startDate?: string; endDate?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest('/purchases/stats' + query, { method: 'GET' });
  },
  
  create: async (data: any) => {
    return apiRequest('/purchases', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/purchases/${id}`, { method: 'DELETE' });
  },
};

// Rebales API
export const rebalesAPI = {
  getAll: async (params?: { startDate?: string; endDate?: string; status?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest('/rebales' + query, { method: 'GET' });
  },
  
  getById: async (id: string) => {
    return apiRequest(`/rebales/${id}`, { method: 'GET' });
  },
  
  getStats: async (params?: { startDate?: string; endDate?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest('/rebales/stats' + query, { method: 'GET' });
  },
  
  create: async (data: any) => {
    return apiRequest('/rebales', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  createBatch: async (data: any) => {
    return apiRequest('/rebales/batch', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  updateStatus: async (id: string, status: string) => {
    return apiRequest(`/rebales/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/rebales/${id}`, { method: 'DELETE' });
  },
};

// Transports API
export const transportsAPI = {
  getAll: async (params?: { startDate?: string; endDate?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest('/transports' + query, { method: 'GET' });
  },
  
  getById: async (id: string) => {
    return apiRequest(`/transports/${id}`, { method: 'GET' });
  },
  
  getStats: async (params?: { startDate?: string; endDate?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest('/transports/stats' + query, { method: 'GET' });
  },
  
  create: async (data: any) => {
    return apiRequest('/transports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/transports/${id}`, { method: 'DELETE' });
  },
};

// Reports API
export const reportsAPI = {
  purchases: async (params?: { startDate?: string; endDate?: string; locationId?: string; buyerId?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest('/reports/purchases' + query, { method: 'GET' });
  },
  
  rebales: async (params?: { startDate?: string; endDate?: string; warehouseId?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest('/reports/rebales' + query, { method: 'GET' });
  },
  
  transports: async (params?: { startDate?: string; endDate?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest('/reports/transports' + query, { method: 'GET' });
  },
  
  farmers: async (params?: { locationId?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest('/reports/farmers' + query, { method: 'GET' });
  },
  
  loans: async (params?: { status?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest('/reports/loans' + query, { method: 'GET' });
  },
  
  dashboard: async () => {
    return apiRequest('/reports/dashboard', { method: 'GET' });
  },
};

// Sync API
export const syncAPI = {
  download: async () => {
    return apiRequest('/sync/download', { method: 'POST' });
  },
  
  upload: async (data: any) => {
    return apiRequest('/sync/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Export all APIs as a single object
export const api = {
  auth: authAPI,
  farmers: farmersAPI,
  crops: cropsAPI,
  grades: gradesAPI,
  locations: locationsAPI,
  warehouses: warehousesAPI,
  users: usersAPI,
  roles: rolesAPI,
  loans: loansAPI,
  prices: pricesAPI,
  purchases: purchasesAPI,
  rebales: rebalesAPI,
  transports: transportsAPI,
  reports: reportsAPI,
  sync: syncAPI,
};

export default api;