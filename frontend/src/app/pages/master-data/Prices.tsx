import { useState, useEffect } from 'react';
import { pricesAPI, cropsAPI, gradesAPI } from '../../services/api';
import type { CropGradePrice, Crop, Grade } from '../../types';
import { Plus, Edit, Trash2, X, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Prices() {
  const [prices, setPrices] = useState<CropGradePrice[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPrice, setEditingPrice] = useState<CropGradePrice | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ cropId: '', gradeId: '', price: '', effectiveDate: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pricesRes, cropsRes, gradesRes] = await Promise.all([pricesAPI.getAll(), cropsAPI.getAll(), gradesAPI.getAll()]);
      if (pricesRes.success && pricesRes.data) setPrices(pricesRes.data);
      if (cropsRes.success && cropsRes.data) setCrops(cropsRes.data);
      if (gradesRes.success && gradesRes.data) setGrades(gradesRes.data);
      if (!pricesRes.success || !cropsRes.success || !gradesRes.success) {
        toast.error('Failed to load some data');
      }
    } catch (error) {
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (price?: CropGradePrice) => {
    if (price) {
      setEditingPrice(price);
      setFormData({ cropId: price.cropId, gradeId: price.gradeId, price: price.price.toString(), effectiveDate: price.effectiveDate });
    } else {
      setEditingPrice(null);
      setFormData({ cropId: '', gradeId: '', price: '', effectiveDate: new Date().toISOString().split('T')[0] });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { cropId: formData.cropId, gradeId: formData.gradeId, price: parseFloat(formData.price), effectiveDate: formData.effectiveDate };
      let response;
      if (editingPrice) {
        response = await pricesAPI.update(editingPrice.id, data);
        if (response.success) {
          toast.success('Price updated');
        } else {
          toast.error(response.message || 'Failed to update price');
          return;
        }
      } else {
        response = await pricesAPI.create(data);
        if (response.success) {
          toast.success('Price created');
        } else {
          toast.error(response.message || 'Failed to create price');
          return;
        }
      }
      loadData();
      setShowModal(false);
    } catch (error) {
      toast.error('Error saving price');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this price?')) {
      setLoading(true);
      try {
        const response = await pricesAPI.delete(id);
        if (response.success) {
          toast.success('Price deleted');
          loadData();
        } else {
          toast.error(response.message || 'Failed to delete price');
        }
      } catch (error) {
        toast.error('Error deleting price');
      } finally {
        setLoading(false);
      }
    }
  }

  const filtered = prices.filter(p => {
    const crop = crops.find(c => c.id === p.cropId);
    const grade = grades.find(g => g.id === p.gradeId);
    return crop?.name.toLowerCase().includes(searchQuery.toLowerCase()) || grade?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Crop Grade Prices</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage pricing for crop grades</p>
        </div>
        <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2"><Plus className="w-5 h-5" />Add Price</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search prices..." className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-semibold">Crop</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Grade</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Price (TZS/kg)</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Effective Date</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(price => {
              const crop = crops.find(c => c.id === price.cropId);
              const grade = grades.find(g => g.id === price.gradeId);
              return (
                <tr key={price.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-sm">{crop?.name || '-'}</td>
                  <td className="px-4 py-3 text-sm">{grade?.name || '-'}</td>
                  <td className="px-4 py-3 text-sm font-semibold">{price.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">{price.effectiveDate}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleOpenModal(price)} className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg mr-2"><Edit className="w-4 h-4 text-blue-600" /></button>
                    <button onClick={() => handleDelete(price.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"><Trash2 className="w-4 h-4 text-red-600" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">{editingPrice ? 'Edit Price' : 'Add Price'}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Crop</label>
                <select value={formData.cropId} onChange={(e) => setFormData({ ...formData, cropId: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg">
                  <option value="">Select Crop</option>
                  {crops.map(crop => <option key={crop.id} value={crop.id}>{crop.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Grade</label>
                <select value={formData.gradeId} onChange={(e) => setFormData({ ...formData, gradeId: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg">
                  <option value="">Select Grade</option>
                  {grades.map(grade => <option key={grade.id} value={grade.id}>{grade.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price (TZS/kg)</label>
                <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Effective Date</label>
                <input type="date" value={formData.effectiveDate} onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg" />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold">{editingPrice ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
