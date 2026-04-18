import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { farmersAPI, locationsAPI } from '../../services/api';
import type { Farmer, Location } from '../../types';
import { Plus, Edit, Trash2, X, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { FadeIn, ScaleIn, StaggerChildren } from '../../components/animations';

export default function Farmers() {
  const { t } = useTranslation();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    code: '',
    phone: '',
    locationId: '',
    email: '',
    idNumber: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [farmersRes, locationsRes] = await Promise.all([
        farmersAPI.getAll(),
        locationsAPI.getAll()
      ]);
      
      if (farmersRes.success && farmersRes.data) {
        setFarmers(farmersRes.data);
      } else {
        toast.error(farmersRes.message || 'Failed to load farmers');
      }
      
      if (locationsRes.success && locationsRes.data) {
        setLocations(locationsRes.data);
      } else {
        toast.error(locationsRes.message || 'Failed to load locations');
      }
    } catch (error) {
      toast.error('Failed to load data');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (farmer?: Farmer) => {
    if (farmer) {
      setEditingFarmer(farmer);
      setFormData({
        firstName: farmer.firstName,
        lastName: farmer.lastName,
        code: farmer.code,
        phone: farmer.phone,
        locationId: farmer.locationId,
        email: farmer.email || '',
        idNumber: farmer.idNumber || '',
      });
    } else {
      setEditingFarmer(null);
      setFormData({
        firstName: '',
        lastName: '',
        code: '',
        phone: '',
        locationId: '',
        email: '',
        idNumber: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFarmer(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (editingFarmer) {
        result = await farmersAPI.update(editingFarmer.id, formData);
        if (result.success) {
          toast.success('Farmer updated successfully');
        } else {
          toast.error(result.message || 'Failed to update farmer');
        }
      } else {
        result = await farmersAPI.create(formData);
        if (result.success) {
          toast.success('Farmer created successfully');
        } else {
          toast.error(result.message || 'Failed to create farmer');
        }
      }

      if (result.success) {
        loadData();
        handleCloseModal();
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this farmer?')) {
      setLoading(true);
      try {
        const result = await farmersAPI.delete(id);
        if (result.success) {
          toast.success('Farmer deleted successfully');
          loadData();
        } else {
          toast.error(result.message || 'Failed to delete farmer');
        }
      } catch (error) {
        toast.error('An error occurred');
        console.error('Delete error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredFarmers = farmers.filter(
    (f) =>
      f.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('farmers')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage farmer records</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Farmer
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search farmers..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Code</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Location</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Total Debt</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFarmers.map((farmer) => {
                const location = locations.find((l) => l.id === farmer.locationId);
                return (
                  <tr key={farmer.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{farmer.code}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {farmer.firstName} {farmer.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{farmer.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{location?.name || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">TZS {farmer.totalDebt.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(farmer)}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(farmer.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingFarmer ? 'Edit Farmer' : 'Add Farmer'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <select
                  value={formData.locationId}
                  onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Location</option>
                  {locations.filter(l => l.type === 'street').map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name} ({location.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ID Number</label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                >
                  {editingFarmer ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}