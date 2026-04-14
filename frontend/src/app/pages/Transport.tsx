import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { db } from '../db/database';
import type { Rebale, Crop, Grade } from '../types';
import { Search, Trash2, Printer, X, Truck } from 'lucide-react';
import { toast } from 'sonner';

interface TransportForm {
  driverName: string;
  driverPhone: string;
  truckPlate1: string;
  truckPlate2: string;
  selectedRebales: Rebale[];
}

export default function Transport() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  const [rebaleSearch, setRebaleSearch] = useState('');
  const [rebaleResults, setRebaleResults] = useState<Rebale[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);

  const [transportForm, setTransportForm] = useState<TransportForm>({
    driverName: '',
    driverPhone: '',
    truckPlate1: '',
    truckPlate2: '',
    selectedRebales: [],
  });

  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [cropsData, gradesData] = await Promise.all([db.crops.findAll(), db.grades.findAll()]);
    setCrops(cropsData);
    setGrades(gradesData);
  };

  const searchRebale = async (query: string) => {
    setRebaleSearch(query);
    if (query.length < 2) {
      setRebaleResults([]);
      return;
    }

    const allRebales = await db.rebales.findAll();
    // Only show stored rebales that haven't been transported yet
    const availableRebales = allRebales.filter(
      (r) => r.status === 'stored' && r.rebaleTag.toLowerCase().includes(query.toLowerCase())
    );
    setRebaleResults(availableRebales);
  };

  const selectRebale = (rebale: Rebale) => {
    // Check if rebale already selected
    if (transportForm.selectedRebales.find((r) => r.id === rebale.id)) {
      toast.error('Rebale already added');
      return;
    }

    setTransportForm({
      ...transportForm,
      selectedRebales: [...transportForm.selectedRebales, rebale],
    });

    setRebaleSearch('');
    setRebaleResults([]);
    toast.success('Rebale added to transport');
  };

  const removeRebale = (rebaleId: string) => {
    setTransportForm({
      ...transportForm,
      selectedRebales: transportForm.selectedRebales.filter((r) => r.id !== rebaleId),
    });
    toast.success('Rebale removed');
  };

  const calculateTotals = () => {
    const totalMass = transportForm.selectedRebales.reduce((sum, r) => sum + r.totalMass, 0);
    const totalAmount = transportForm.selectedRebales.reduce((sum, r) => sum + r.totalAmount, 0);
    return { totalMass, totalAmount };
  };

  const handleCreateTransport = async () => {
    if (!transportForm.driverName) {
      toast.error('Please enter driver name');
      return;
    }

    if (!transportForm.driverPhone) {
      toast.error('Please enter driver phone');
      return;
    }

    if (!transportForm.truckPlate1) {
      toast.error('Please enter truck plate number');
      return;
    }

    if (transportForm.selectedRebales.length === 0) {
      toast.error('Please select at least one rebale');
      return;
    }

    // Validate phone number
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(transportForm.driverPhone.replace(/\s/g, ''))) {
      toast.error('Invalid phone number');
      return;
    }

    const { totalMass, totalAmount } = calculateTotals();

    // Generate receipt number
    const receiptNumber = `TRP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    // Create transport record
    const transport = await db.transports.create({
      receiptNumber,
      rebaleIds: transportForm.selectedRebales.map((r) => r.id),
      driverName: transportForm.driverName,
      driverPhone: transportForm.driverPhone,
      truckPlate1: transportForm.truckPlate1,
      truckPlate2: transportForm.truckPlate2,
      totalMass,
      totalAmount,
      buyerId: user?.id || '',
      warehouseId: user?.warehouseId || '',
      transportDate: new Date().toISOString().split('T')[0],
    });

    // Update rebale status to transported
    for (const rebale of transportForm.selectedRebales) {
      await db.rebales.update(rebale.id, { status: 'transported' });
    }

    // Create audit log
    await db.auditLogs.create({
      userId: user?.id || '',
      action: 'CREATE_TRANSPORT',
      entityType: 'transport',
      entityId: transport.id,
      details: `Created transport ${receiptNumber} with ${transportForm.selectedRebales.length} rebales`,
      ipAddress: '127.0.0.1',
    });

    setReceiptData({
      receiptNumber,
      driverName: transportForm.driverName,
      driverPhone: transportForm.driverPhone,
      truckPlate1: transportForm.truckPlate1,
      truckPlate2: transportForm.truckPlate2,
      rebales: transportForm.selectedRebales,
      totalMass,
      totalAmount,
      buyer: user,
      date: new Date().toLocaleString(),
    });

    setShowReceipt(true);
    toast.success('Transport created successfully');
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setTransportForm({
      driverName: '',
      driverPhone: '',
      truckPlate1: '',
      truckPlate2: '',
      selectedRebales: [],
    });
    setRebaleSearch('');
  };

  if (showReceipt && receiptData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transport Receipt</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{receiptData.receiptNumber}</p>
            </div>
            <button
              onClick={closeReceipt}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Date & Time</p>
                <p className="font-semibold text-gray-900 dark:text-white">{receiptData.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Processed By</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {receiptData.buyer?.firstName} {receiptData.buyer?.lastName} ({receiptData.buyer?.code})
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Driver & Vehicle Information</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Driver Name</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{receiptData.driverName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Driver Phone</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{receiptData.driverPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Truck Plate 1</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{receiptData.truckPlate1}</p>
                </div>
                {receiptData.truckPlate2 && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Truck Plate 2</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{receiptData.truckPlate2}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Loaded Rebales ({receiptData.rebales.length})</p>
              <div className="space-y-2">
                {receiptData.rebales.map((rebale: Rebale) => {
                  const crop = crops.find((c) => c.id === rebale.cropId);
                  const grade = grades.find((g) => g.id === rebale.gradeId);
                  return (
                    <div key={rebale.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{rebale.rebaleTag}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {crop?.name} - {grade?.name} | {rebale.totalMass} kg
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">TZS {rebale.totalAmount.toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Mass</span>
                <span className="font-semibold text-gray-900 dark:text-white">{receiptData.totalMass} kg</span>
              </div>
              <div className="flex justify-between text-lg border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="font-bold text-gray-900 dark:text-white">Total Value</span>
                <span className="font-bold text-green-600 dark:text-green-400">TZS {receiptData.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-5 h-5" />
                Print Receipt
              </button>
              <button
                onClick={closeReceipt}
                className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { totalMass, totalAmount } = calculateTotals();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('transport')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Load rebales to truck for factory transport</p>
      </div>

      {/* Driver & Vehicle Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Driver & Vehicle Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Driver Name *
            </label>
            <input
              type="text"
              value={transportForm.driverName}
              onChange={(e) => setTransportForm({ ...transportForm, driverName: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Michael Otieno"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Driver Phone *
            </label>
            <input
              type="tel"
              value={transportForm.driverPhone}
              onChange={(e) => setTransportForm({ ...transportForm, driverPhone: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="+255712345678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Truck Plate 1 *
            </label>
            <input
              type="text"
              value={transportForm.truckPlate1}
              onChange={(e) => setTransportForm({ ...transportForm, truckPlate1: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="T123ABC"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Truck Plate 2 (Optional)
            </label>
            <input
              type="text"
              value={transportForm.truckPlate2}
              onChange={(e) => setTransportForm({ ...transportForm, truckPlate2: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="T124XYZ"
            />
          </div>
        </div>
      </div>

      {/* Rebale Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Load Rebales</h3>

        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={rebaleSearch}
              onChange={(e) => searchRebale(e.target.value)}
              placeholder="Search rebale by tag..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          {rebaleResults.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {rebaleResults.map((rebale) => {
                const crop = crops.find((c) => c.id === rebale.cropId);
                const grade = grades.find((g) => g.id === rebale.gradeId);
                return (
                  <button
                    key={rebale.id}
                    onClick={() => selectRebale(rebale)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">{rebale.rebaleTag}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {crop?.name} - {grade?.name} | {rebale.totalMass} kg
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {transportForm.selectedRebales.length > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-400 mb-1">Load Summary</p>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-400">Rebales Count</p>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-300">{transportForm.selectedRebales.length}</p>
              </div>
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-400">Total Mass</p>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-300">{totalMass} kg</p>
              </div>
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-400">Total Value</p>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-300">TZS {totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loaded Rebales */}
      {transportForm.selectedRebales.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Loaded Rebales</h3>
          <div className="space-y-2 mb-6">
            {transportForm.selectedRebales.map((rebale) => {
              const crop = crops.find((c) => c.id === rebale.cropId);
              const grade = grades.find((g) => g.id === rebale.gradeId);
              return (
                <div
                  key={rebale.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{rebale.rebaleTag}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {crop?.name} - {grade?.name} | {rebale.totalMass} kg
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-gray-900 dark:text-white">TZS {rebale.totalAmount.toLocaleString()}</p>
                    <button
                      onClick={() => removeRebale(rebale.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleCreateTransport}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Truck className="w-5 h-5" />
            Create Transport
          </button>
        </div>
      )}
    </div>
  );
}
