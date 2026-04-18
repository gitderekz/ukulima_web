import { useState, useEffect } from 'react';
import { usersAPI, locationsAPI, warehousesAPI } from '../../services/api';
import type { User, Location, Warehouse, UserRole } from '../../types';
import { Plus, Edit, Trash2, X, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', role: 'clerk' as UserRole,
    code: '', locationId: '', warehouseId: '', isActive: true
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, locRes, whRes] = await Promise.all([usersAPI.getAll(), locationsAPI.getAll(), warehousesAPI.getAll()]);
      if (usersRes.success && usersRes.data) setUsers(usersRes.data);
      if (locRes.success && locRes.data) setLocations(locRes.data);
      if (whRes.success && whRes.data) setWarehouses(whRes.data);
      if (!usersRes.success || !locRes.success || !whRes.success) {
        toast.error('Failed to load some data');
      }
    } catch (error) {
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, password: '', role: user.role, code: user.code, locationId: user.locationId, warehouseId: user.warehouseId || '', isActive: user.isActive });
    } else {
      setEditingUser(null);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '', role: 'clerk', code: '', locationId: '', warehouseId: '', isActive: true });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data: any = { ...formData };
      if (!data.warehouseId) delete data.warehouseId;
      if (editingUser && !formData.password) delete data.password;

      let response;
      if (editingUser) {
        response = await usersAPI.update(editingUser.id, data);
        if (response.success) {
          toast.success('User updated');
        } else {
          toast.error(response.message || 'Failed to update user');
          return;
        }
      } else {
        response = await usersAPI.create(data);
        if (response.success) {
          toast.success('User created');
        } else {
          toast.error(response.message || 'Failed to create user');
          return;
        }
      }
      loadData();
      setShowModal(false);
    } catch (error) {
      toast.error('Error saving user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this user?')) {
      setLoading(true);
      try {
        const response = await usersAPI.delete(id);
        if (response.success) {
          toast.success('User deleted');
          loadData();
        } else {
          toast.error(response.message || 'Failed to delete user');
        }
      } catch (error) {
        toast.error('Error deleting user');
      } finally {
        setLoading(false);
      }
    }
  }

  const filtered = users.filter(u => u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) || u.code.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage system users</p>
        </div>
        <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2"><Plus className="w-5 h-5" />Add User</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search users..." className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-semibold">Code</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3 text-sm">{user.code}</td>
                <td className="px-4 py-3 text-sm">{user.firstName} {user.lastName}</td>
                <td className="px-4 py-3 text-sm">{user.email}</td>
                <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded capitalize">{user.role}</span></td>
                <td className="px-4 py-3 text-sm"><span className={`px-2 py-1 rounded ${user.isActive ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleOpenModal(user)} className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg mr-2"><Edit className="w-4 h-4 text-blue-600" /></button>
                  <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"><Trash2 className="w-4 h-4 text-red-600" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl my-8">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">{editingUser ? 'Edit User' : 'Add User'}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Code</label>
                  <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password {editingUser && '(leave blank to keep current)'}</label>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} {...(!editingUser && { required: true })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg">
                    <option value="admin">Admin</option>
                    <option value="IT">IT</option>
                    <option value="manager">Manager</option>
                    <option value="officer">Officer</option>
                    <option value="clerk">Clerk</option>
                    <option value="buyer">Buyer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select value={formData.isActive ? 'active' : 'inactive'} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <select value={formData.locationId} onChange={(e) => setFormData({ ...formData, locationId: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg">
                    <option value="">Select Location</option>
                    {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name} ({loc.type})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Warehouse (Optional)</label>
                  <select value={formData.warehouseId} onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg">
                    <option value="">None</option>
                    {warehouses.map(wh => <option key={wh.id} value={wh.id}>{wh.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="submit" className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold">{editingUser ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
