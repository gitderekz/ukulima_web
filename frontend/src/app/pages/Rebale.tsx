import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { cropsAPI, gradesAPI, rebalesAPI } from '../../services/api';
import type { Crop, Grade } from '../types';
import { Search, Plus, Trash2, Printer, X, Edit, Package } from 'lucide-react';
import { toast } from 'sonner';

interface RebaleFormData {
  rebaleTag: string;
  cropId: string;
  gradeId: string;
  mass: string;
  price: number;
}

interface AccumulatedRebale extends RebaleFormData {
  id: string;
  totalAmount: number;
}

type RebaleMode = 'track' | 'manual';

export default function Rebale() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  const [mode, setMode] = useState<RebaleMode>('manual');
  const [baleSearch, setBaleSearch] = useState('');
  const [baleResults, setBaleResults] = useState<any[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);

  const [rebaleForm, setRebaleForm] = useState<RebaleFormData>({
    rebaleTag: '',
    cropId: '',
    gradeId: '',
    mass: '',
    price: 0,
  });

  const [selectedBales, setSelectedBales] = useState<any[]>([]);
  const [accumulatedRebales, setAccumulatedRebales] = useState<AccumulatedRebale[]>([]);
  const [editingRebaleId, setEditingRebaleId] = useState<string | null>(null);

  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cropsRes, gradesRes] = await Promise.all([cropsAPI.getAll(), gradesAPI.getAll()]);
      if (cropsRes.success && cropsRes.data) setCrops(cropsRes.data);
      if (gradesRes.success && gradesRes.data) setGrades(gradesRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const searchBale = async (query: string) => {
    setBaleSearch(query);
    if (query.length < 2) {
      setBaleResults([]);
      return;
    }

    try {
      // Search for rebales in pending status
      const response = await rebalesAPI.getByStatus('pending');
      if (response.success && response.data) {
        const filtered = response.data.filter((r: any) =>
          r.rebaleTag.toLowerCase().includes(query.toLowerCase())
        );
        setBaleResults(filtered);
      }
    } catch (error) {
      toast.error('Failed to search rebales');
    }
  };

  const selectBale = async (bale: any) => {
    if (selectedBales.find((b) => b.id === bale.id)) {
      toast.error('Rebale already added');
      return;
    }

    if (selectedBales.length === 0) {
      setRebaleForm({
        rebaleTag: '',
        cropId: bale.cropId,
        gradeId: bale.gradeId,
        mass: '',
        price: bale.price || 0,
      });
      setSelectedBales([bale]);
    } else {
      if (bale.cropId !== rebaleForm.cropId || bale.gradeId !== rebaleForm.gradeId) {
        toast.error('All bales must have the same crop and grade');
        return;
      }
      setSelectedBales([...selectedBales, bale]);
    }

    setBaleSearch('');
    setBaleResults([]);
    toast.success('Bale added');
  };

  const removeBale = (baleId: string) => {
    const newBales = selectedBales.filter((b) => b.id !== baleId);
    setSelectedBales(newBales);

    if (newBales.length === 0) {
      setRebaleForm({
        rebaleTag: '',
        cropId: '',
        gradeId: '',
        mass: '',
        price: 0,
        sourceBaleIds: [],
      });
    } else {
      setRebaleForm({
        ...rebaleForm,
        sourceBaleIds: newBales.map((b) => b.id),
      });
    }
    toast.success('Bale removed');
  };

  const handleNextRebale = async () => {
    if (!rebaleForm.rebaleTag) {
      toast.error('Please enter rebale tag');
      return;
    }

    if (mode === 'manual') {
      if (!rebaleForm.cropId || !rebaleForm.gradeId || !rebaleForm.mass || !rebaleForm.price) {
        toast.error('Please fill all fields');
        return;
      }
    } else {
      if (selectedBales.length === 0) {
        toast.error('Please select at least one bale');
        return;
      }
    }

    // Check if rebale tag is unique
    const existingTag = accumulatedRebales.find((r) => r.rebaleTag === rebaleForm.rebaleTag);
    if (existingTag && !editingRebaleId) {
      toast.error('Rebale tag already exists');
      return;
    }

    const mass = mode === 'manual'
      ? parseFloat(rebaleForm.mass)
      : selectedBales.reduce((sum, b) => sum + b.mass, 0);

    if (isNaN(mass) || mass <= 0) {
      toast.error('Invalid mass value');
      return;
    }

    const totalAmount = mass * rebaleForm.price;

    if (editingRebaleId) {
      setAccumulatedRebales(
        accumulatedRebales.map((r) =>
          r.id === editingRebaleId
            ? { ...rebaleForm, id: r.id, mass: mass.toString(), totalAmount }
            : r
        )
      );
      toast.success('Rebale updated');
      setEditingRebaleId(null);
    } else {
      const newRebale: AccumulatedRebale = {
        ...rebaleForm,
        id: `temp-${Date.now()}`,
        mass: mass.toString(),
        totalAmount,
      };

      setAccumulatedRebales([...accumulatedRebales, newRebale]);
      toast.success('Rebale added');
    }

    // Clear form
    setRebaleForm({
      rebaleTag: '',
      cropId: mode === 'manual' ? rebaleForm.cropId : '',
      gradeId: mode === 'manual' ? rebaleForm.gradeId : '',
      mass: '',
      price: mode === 'manual' ? rebaleForm.price : 0,
      sourceBaleIds: [],
    });
    setSelectedBales([]);
  };

  const editRebale = (rebale: AccumulatedRebale) => {
    setRebaleForm({
      rebaleTag: rebale.rebaleTag,
      cropId: rebale.cropId,
      gradeId: rebale.gradeId,
      mass: rebale.mass,
      price: rebale.price,
      sourceBaleIds: rebale.sourceBaleIds || [],
    });
    setEditingRebaleId(rebale.id);
  };

  const deleteRebale = (id: string) => {
    setAccumulatedRebales(accumulatedRebales.filter((r) => r.id !== id));
    toast.success('Rebale removed');
  };

  const calculateTotals = () => {
    const totalMass = accumulatedRebales.reduce((sum, r) => sum + parseFloat(r.mass), 0);
    const totalAmount = accumulatedRebales.reduce((sum, r) => sum + r.totalAmount, 0);
    return { totalMass, totalAmount };
  };

  const handlePrintReceipt = async () => {
    if (accumulatedRebales.length === 0) {
      toast.error('No rebales to process');
      return;
    }

    setLoading(true);
    try {
      // Create rebale records via API
      for (const rebale of accumulatedRebales) {
        const rebaleData = {
          rebaleTag: rebale.rebaleTag,
          cropId: rebale.cropId,
          gradeId: rebale.gradeId,
          mass: parseFloat(rebale.mass),
          status: 'completed',
        };

        const response = await rebalesAPI.create(rebaleData);
        if (!response.success) {
          toast.error(`Failed to create rebale: ${response.error}`);
          setLoading(false);
          return;
        }
      }

      const { totalMass, totalAmount } = calculateTotals();

      setReceiptData({
        rebales: accumulatedRebales.map((r) => ({
          ...r,
          crop: crops.find((c) => c.id === r.cropId),
          grade: grades.find((g) => g.id === r.gradeId),
        })),
        totalMass,
        totalAmount,
        buyer: user,
        date: new Date().toLocaleString(),
        count: accumulatedRebales.length,
      });

      setShowReceipt(true);
      toast.success('Rebales created successfully');
    } catch (error) {
      toast.error('Failed to create rebales');
    } finally {
      setLoading(false);
    }
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setAccumulatedRebales([]);
    setRebaleForm({
      rebaleTag: '',
      cropId: '',
      gradeId: '',
      mass: '',
      price: 0,
      sourceBaleIds: [],
    });
    setSelectedBales([]);
  };

  if (showReceipt && receiptData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rebale Batch Receipt</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{receiptData.count} Rebales Created</p>
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
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Rebales Created ({receiptData.count})</p>
              <div className="space-y-2">
                {receiptData.rebales.map((rebale: any) => (
                  <div key={rebale.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{rebale.rebaleTag}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {rebale.crop?.name} - {rebale.grade?.name} | {rebale.mass} kg @ TZS {rebale.price}/kg
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">TZS {rebale.totalAmount.toLocaleString()}</p>
                  </div>
                ))}
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('rebale')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Combine small bales into large bales</p>
      </div>

      {/* Mode Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Rebale Mode</h3>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setMode('manual');
              setSelectedBales([]);
              setRebaleForm({ rebaleTag: '', cropId: '', gradeId: '', mass: '', price: 0, sourceBaleIds: [] });
            }}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
              mode === 'manual'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Package className="w-5 h-5 inline mr-2" />
            Manual Entry (No Tracking)
          </button>
          <button
            onClick={() => {
              setMode('track');
              setRebaleForm({ rebaleTag: '', cropId: '', gradeId: '', mass: '', price: 0, sourceBaleIds: [] });
            }}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
              mode === 'track'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Search className="w-5 h-5 inline mr-2" />
            Track Source Bales
          </button>
        </div>
      </div>

      {/* Rebale Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          {mode === 'manual' ? 'Enter Rebale Details' : 'Select Source Bales'}
        </h3>

        {mode === 'track' && (
          <div className="relative mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={baleSearch}
                onChange={(e) => searchBale(e.target.value)}
                placeholder="Search bale by tag..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            {baleResults.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {baleResults.map((bale) => {
                  const baleCrop = crops.find((c) => c.id === bale.cropId);
                  const baleGrade = grades.find((g) => g.id === bale.gradeId);
                  return (
                    <button
                      key={bale.id}
                      onClick={() => selectBale(bale)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <p className="font-medium text-gray-900 dark:text-white">{bale.baleTag}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {baleCrop?.name} - {baleGrade?.name} | {bale.mass} kg
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {mode === 'track' && selectedBales.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">Selected Bales ({selectedBales.length})</p>
            <div className="space-y-2">
              {selectedBales.map((bale) => (
                <div key={bale.id} className="flex justify-between items-center text-sm">
                  <span className="text-blue-900 dark:text-blue-300">{bale.baleTag} - {bale.mass} kg</span>
                  <button onClick={() => removeBale(bale.id)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rebale Tag</label>
            <input
              type="text"
              value={rebaleForm.rebaleTag}
              onChange={(e) => setRebaleForm({ ...rebaleForm, rebaleTag: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="RB-2026-0001"
            />
          </div>

          {mode === 'manual' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Crop</label>
                <select
                  value={rebaleForm.cropId}
                  onChange={(e) => setRebaleForm({ ...rebaleForm, cropId: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Crop</option>
                  {crops.map((crop) => (
                    <option key={crop.id} value={crop.id}>{crop.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Grade</label>
                <select
                  value={rebaleForm.gradeId}
                  onChange={(e) => {
                    const gradeId = e.target.value;
                    setRebaleForm({ ...rebaleForm, gradeId });
                    // Auto-fill price
                    if (rebaleForm.cropId && gradeId) {
                      db.cropGradePrices.findByCropAndGrade(rebaleForm.cropId, gradeId).then((p) => {
                        if (p) setRebaleForm((prev) => ({ ...prev, price: p.price }));
                      });
                    }
                  }}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Grade</option>
                  {grades.map((grade) => (
                    <option key={grade.id} value={grade.id}>{grade.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mass (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={rebaleForm.mass}
                  onChange={(e) => setRebaleForm({ ...rebaleForm, mass: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="100.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price (TZS/kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={rebaleForm.price}
                  onChange={(e) => setRebaleForm({ ...rebaleForm, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="8500"
                />
              </div>
            </>
          )}
        </div>

        {mode === 'manual' && rebaleForm.mass && rebaleForm.price > 0 && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-400 mb-1">Rebale Amount</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-300">
              TZS {(parseFloat(rebaleForm.mass) * rebaleForm.price).toLocaleString()}
            </p>
          </div>
        )}

        <button
          onClick={handleNextRebale}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {editingRebaleId ? 'Update Rebale' : 'Add Rebale'}
        </button>
      </div>

      {/* Accumulated Rebales */}
      {accumulatedRebales.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Accumulated Rebales ({accumulatedRebales.length})</h3>
          <div className="space-y-2 mb-6">
            {accumulatedRebales.map((rebale) => {
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
                      {crop?.name} - {grade?.name} | {rebale.mass} kg @ TZS {rebale.price}/kg
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-gray-900 dark:text-white">TZS {rebale.totalAmount.toLocaleString()}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editRebale(rebale)}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => deleteRebale(rebale.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Rebales</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{accumulatedRebales.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Mass</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{totalMass} kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">TZS {totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handlePrintReceipt}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-5 h-5" />
            Print Receipt
          </button>
        </div>
      )}
    </div>
  );
}
