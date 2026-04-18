import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Truck,
  FileText,
  MapPin,
  Warehouse,
  Users,
  Sprout,
  Wheat,
  Award,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
} from 'lucide-react';
import type { Notification } from '../types';

export default function Layout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  // Auto-hide sidebar on mobile after route change
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    handleRouteChange(); // Check on mount and route change
  }, [location.pathname]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const loadNotifications = async () => {
    if (user) {
      // TODO: Load notifications from backend API when notifications endpoint is ready
      // For now, keep local state empty
      setNotifications([]);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: t('dashboard'), roles: ['admin', 'IT', 'manager', 'officer', 'clerk', 'buyer'] },
    { path: '/buying', icon: ShoppingCart, label: t('buying'), roles: ['admin', 'IT', 'buyer', 'clerk'] },
    { path: '/rebale', icon: Package, label: t('rebale'), roles: ['admin', 'IT', 'buyer', 'clerk'] },
    { path: '/transport', icon: Truck, label: t('transport'), roles: ['admin', 'IT', 'buyer', 'clerk'] },
    { path: '/loan-assignment', icon: DollarSign, label: 'Loan Assignment', roles: ['admin', 'IT', 'officer'] },
    { path: '/receipts', icon: FileText, label: 'Receipts', roles: ['admin', 'IT', 'buyer', 'clerk', 'officer', 'manager'] },
    { path: '/reports', icon: FileText, label: t('reports'), roles: ['admin', 'IT', 'manager', 'officer'] },
    {
      path: '/master-data',
      icon: Settings,
      label: t('masterData'),
      roles: ['admin', 'IT', 'manager'],
      children: [
        { path: '/master-data/locations', icon: MapPin, label: t('locations') },
        { path: '/master-data/warehouses', icon: Warehouse, label: t('warehouses') },
        { path: '/master-data/users', icon: Users, label: t('users') },
        { path: '/master-data/farmers', icon: Sprout, label: t('farmers') },
        { path: '/master-data/crops', icon: Wheat, label: t('crops') },
        { path: '/master-data/grades', icon: Award, label: t('grades') },
        { path: '/master-data/loans', icon: DollarSign, label: t('loans') },
        { path: '/master-data/prices', icon: DollarSign, label: t('prices') },
        { path: '/master-data/roles', icon: Shield, label: 'Roles' },
      ],
    },
    { path: '/settings', icon: Settings, label: t('settings'), roles: ['admin', 'IT'] },
  ];

  const filteredNavItems = navItems.filter(item =>
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ukulima ERP</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative group">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Globe className="w-5 h-5" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {[
                  { code: 'en', name: 'English' },
                  { code: 'sw', name: 'Swahili' },
                  { code: 'fr', name: 'Français' },
                  { code: 'es', name: 'Español' },
                  { code: 'zh', name: '中文' },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-gray-600 dark:text-gray-400">No new notifications</p>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <p className="font-medium text-gray-900 dark:text-white">{notif.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                title={t('logout')}
              >
                <LogOut className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden`}
        >
          <nav className="p-4 space-y-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');

              if (item.children) {
                return (
                  <div key={item.path}>
                    <div className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">
                      {item.label}
                    </div>
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const isChildActive = location.pathname === child.path;
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            isChildActive
                              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <ChildIcon className="w-5 h-5" />
                          <span className="font-medium">{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
