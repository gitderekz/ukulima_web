import { createBrowserRouter, Navigate } from 'react-router';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Buying from './pages/Buying';
import Rebale from './pages/Rebale';
import Transport from './pages/Transport';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Locations from './pages/master-data/Locations';
import Warehouses from './pages/master-data/Warehouses';
import UsersManagement from './pages/master-data/Users';
import Farmers from './pages/master-data/Farmers';
import Crops from './pages/master-data/Crops';
import Grades from './pages/master-data/Grades';
import Loans from './pages/master-data/Loans';
import Prices from './pages/master-data/Prices';
import Roles from './pages/master-data/Roles';
import LoanAssignment from './pages/LoanAssignment';
import Receipts from './pages/Receipts';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public Route wrapper (redirect to dashboard if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'buying',
        element: <Buying />,
      },
      {
        path: 'rebale',
        element: <Rebale />,
      },
      {
        path: 'transport',
        element: <Transport />,
      },
      {
        path: 'loan-assignment',
        element: <LoanAssignment />,
      },
      {
        path: 'receipts',
        element: <Receipts />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'master-data',
        children: [
          {
            index: true,
            element: <Navigate to="/master-data/locations" replace />,
          },
          {
            path: 'locations',
            element: <Locations />,
          },
          {
            path: 'warehouses',
            element: <Warehouses />,
          },
          {
            path: 'users',
            element: <UsersManagement />,
          },
          {
            path: 'farmers',
            element: <Farmers />,
          },
          {
            path: 'crops',
            element: <Crops />,
          },
          {
            path: 'grades',
            element: <Grades />,
          },
          {
            path: 'loans',
            element: <Loans />,
          },
          {
            path: 'prices',
            element: <Prices />,
          },
          {
            path: 'roles',
            element: <Roles />,
          },
        ],
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">Page not found</p>
          <a href="/dashboard" className="text-green-600 hover:text-green-700 mt-4 inline-block">
            Go to Dashboard
          </a>
        </div>
      </div>
    ),
  },
]);
