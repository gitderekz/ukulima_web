import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Warehouse,
  TrendingUp,
  DollarSign,
  Package,
  Truck,
  AlertCircle,
} from 'lucide-react';
import { reportsAPI, farmersAPI, warehousesAPI, purchasesAPI, transportsAPI } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { PageTransition, StaggerChildren, StaggerItem, ScaleIn } from '../components/animations';
import { toast } from 'sonner';

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalFarmers: 0,
    totalWarehouses: 0,
    totalPurchases: 0,
    totalRevenue: 0,
    todayPurchases: 0,
    pendingBales: 0,
    totalTransports: 0,
    warehouseCapacity: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [farmersRes, warehousesRes, purchasesRes, transportsRes] = await Promise.all([
        farmersAPI.getAll(),
        warehousesAPI.getAll(),
        purchasesAPI.getAll(),
        transportsAPI.getAll(),
      ]);

      if (!farmersRes.success || !warehousesRes.success || !purchasesRes.success || !transportsRes.success) {
        toast.error('Failed to load dashboard data');
        return;
      }

      const farmers = farmersRes.data || [];
      const warehouses = warehousesRes.data || [];
      const purchases = purchasesRes.data || [];
      const transports = transportsRes.data || [];

      const today = new Date().toISOString().split('T')[0];
      const todayPurchases = purchases.filter((p: any) => p.purchaseDate?.startsWith(today)).length;

      const totalRevenue = purchases.reduce((sum: number, p: any) => sum + (p.totalAmount || 0), 0);
      const pendingBales = 0; // Placeholder - bales not in API yet

      const totalCapacity = warehouses.reduce((sum: number, w: any) => sum + (w.capacity || 0), 0);
      const totalStock = warehouses.reduce((sum: number, w: any) => sum + (w.currentStock || 0), 0);
      const capacityPercentage = totalCapacity > 0 ? Math.round((totalStock / totalCapacity) * 100) : 0;

      setStats({
        totalFarmers: farmers.length,
        totalWarehouses: warehouses.length,
        totalPurchases: purchases.length,
        totalRevenue,
        todayPurchases,
        pendingBales,
        totalTransports: transports.length,
        warehouseCapacity: capacityPercentage,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Error loading dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Mon', purchases: 12, revenue: 850000 },
    { name: 'Tue', purchases: 19, revenue: 1200000 },
    { name: 'Wed', purchases: 15, revenue: 980000 },
    { name: 'Thu', purchases: 22, revenue: 1450000 },
    { name: 'Fri', purchases: 18, revenue: 1100000 },
    { name: 'Sat', purchases: 8, revenue: 620000 },
    { name: 'Sun', purchases: 5, revenue: 380000 },
  ];

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    subtitle?: string;
  }) => (
    <ScaleIn whileHover hoverScale={1.03} className="h-full">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-shadow hover:shadow-lg h-full">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center transition-transform hover:scale-110`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{title}</div>
        {subtitle && <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</div>}
      </div>
    </ScaleIn>
  );

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('dashboard')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome to Ukulima ERP System</p>
        </div>

        {/* Stats Grid */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StaggerItem>
            <StatCard title="Total Farmers" value={stats.totalFarmers} icon={Users} color="bg-blue-500" />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              title="Total Purchases"
              value={stats.totalPurchases}
              icon={Package}
              color="bg-green-500"
              subtitle={`${stats.todayPurchases} today`}
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              title="Total Revenue"
              value={`TZS ${(stats.totalRevenue / 1000000).toFixed(1)}M`}
              icon={DollarSign}
              color="bg-purple-500"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              title="Warehouse Capacity"
              value={`${stats.warehouseCapacity}%`}
              icon={Warehouse}
              color="bg-orange-500"
            />
          </StaggerItem>
        </StaggerChildren>

        {/* Secondary Stats */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6" delay={0.4}>
          <StaggerItem>
            <StatCard title="Pending Bales" value={stats.pendingBales} icon={AlertCircle} color="bg-yellow-500" />
          </StaggerItem>
          <StaggerItem>
            <StatCard title="Total Transports" value={stats.totalTransports} icon={Truck} color="bg-indigo-500" />
          </StaggerItem>
          <StaggerItem>
            <StatCard title="Active Warehouses" value={stats.totalWarehouses} icon={TrendingUp} color="bg-teal-500" />
          </StaggerItem>
        </StaggerChildren>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchases Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Purchases</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="purchases" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>
    </PageTransition>
  );
}
