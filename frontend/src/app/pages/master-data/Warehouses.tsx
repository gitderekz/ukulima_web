import { useState, useEffect } from 'react';
import { warehousesAPI, locationsAPI } from '../../services/api';
import type { Warehouse, Location } from '../../types';
import { Plus, Edit, Trash2, X, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', locationId: '', capacity: '', currentStock: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [whRes, locRes] = await Promise.all([warehousesAPI.getAll(), locationsAPI.getAll()]);
      if (whRes.success && whRes.data) {
        setWarehouses(whRes.data as Warehouse[]);
      } else {
        toast.error(whRes.message || 'Failed to load warehouses');
      }
      if (locRes.success && locRes.data) {
        setLocations(locRes.data as Location[]);
      } else {
        toast.error(locRes.message || 'Failed to load locations');
      }
    } catch (error) {
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (warehouse?: Warehouse) => {
    if (warehouse) {
      setEditingWarehouse(warehouse);
      setFormData({ name: warehouse.name, code: warehouse.code, locationId: warehouse.locationId, capacity: warehouse.capacity.toString(), currentStock: warehouse.currentStock.toString() });
    } else {
      setEditingWarehouse(null);
      setFormData({ name: '', code: '', locationId: '', capacity: '', currentStock: '0' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...formData, capacity: parseFloat(formData.capacity), currentStock: parseFloat(formData.currentStock) };
      let response;
      if (editingWarehouse) {
        response = await warehousesAPI.update(editingWarehouse.id, data);
        if (response.success) {
          toast.success('Warehouse updated');
        } else {
          toast.error(response.message || 'Failed to update warehouse');
          return;
        }
      } else {
        response = await warehousesAPI.create(data);
        if (response.success) {
          toast.success('Warehouse created');
        } else {
          toast.error(response.message || 'Failed to create warehouse');
          return;
        }
      }
      loadData();
      setShowModal(false);
    } catch (error) {
      toast.error('Error saving warehouse');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this warehouse?')) {
      setLoading(true);
      try {
        const response = await warehousesAPI.delete(id);
        if (response.success) {
          toast.success('Warehouse deleted');
          loadData();
        } else {
          toast.error(response.message || 'Failed to delete warehouse');
        }
      } catch (error) {
        toast.error('Error deleting warehouse');
      } finally {
        setLoading(false);
      }
    }
  }

  const filtered = warehouses.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()) || w.code.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Warehouses</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage warehouses</p>
        </div>
        <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2"><Plus className="w-5 h-5" />Add Warehouse</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search warehouses..." className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-semibold">Code</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Location</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Capacity</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Current Stock</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Utilization</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(warehouse => {
              const location = locations.find(l => l.id === warehouse.locationId);
              const utilization = warehouse.capacity > 0 ? Math.round((warehouse.currentStock / warehouse.capacity) * 100) : 0;
              return (
                <tr key={warehouse.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-sm">{warehouse.code}</td>
                  <td className="px-4 py-3 text-sm">{warehouse.name}</td>
                  <td className="px-4 py-3 text-sm">{location?.name || '-'}</td>
                  <td className="px-4 py-3 text-sm">{warehouse.capacity.toLocaleString()} kg</td>
                  <td className="px-4 py-3 text-sm">{warehouse.currentStock.toLocaleString()} kg</td>
                  <td className="px-4 py-3 text-sm">{utilization}%</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleOpenModal(warehouse)} className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg mr-2"><Edit className="w-4 h-4 text-blue-600" /></button>
                    <button onClick={() => handleDelete(warehouse.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"><Trash2 className="w-4 h-4 text-red-600" /></button>
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
              <h2 className="text-2xl font-bold">{editingWarehouse ? 'Edit Warehouse' : 'Add Warehouse'}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Code</label>
                <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <select value={formData.locationId} onChange={(e) => setFormData({ ...formData, locationId: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg">
                  <option value="">Select Location</option>
                  {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name} ({loc.type})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Capacity (kg)</label>
                  <input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Current Stock (kg)</label>
                  <input type="number" value={formData.currentStock} onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg" />
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold">{editingWarehouse ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
