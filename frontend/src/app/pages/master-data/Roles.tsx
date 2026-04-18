import { useState, useEffect } from 'react';
import { rolesAPI } from '../../services/api';
import type { Role } from '../../types';
import { Plus, Edit, Trash2, X, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    permissions: [] as string[],
    isActive: true,
  });

  const availablePermissions = [
    'dashboard.view',
    'buying.create',
    'buying.view',
    'rebale.create',
    'rebale.view',
    'transport.create',
    'transport.view',
    'loans.assign',
    'loans.view',
    'farmers.create',
    'farmers.view',
    'farmers.edit',
    'reports.view',
    'reports.export',
    'receipts.view',
    'receipts.print',
    'master-data.view',
    'master-data.edit',
    'settings.view',
    'settings.edit',
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await rolesAPI.getAll();
      if (response.success && response.data) {
        setRoles(response.data);
      } else {
        toast.error(response.message || 'Failed to load roles');
      }
    } catch (error) {
      toast.error('Error loading roles');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        code: role.code,
        description: role.description,
        permissions: role.permissions,
        isActive: role.isActive,
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: '',
        code: '',
        description: '',
        permissions: [],
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (editingRole) {
        response = await rolesAPI.update(editingRole.id, formData);
        if (response.success) {
          toast.success('Role updated');
        } else {
          toast.error(response.message || 'Failed to update role');
          return;
        }
      } else {
        response = await rolesAPI.create(formData);
        if (response.success) {
          toast.success('Role created');
        } else {
          toast.error(response.message || 'Failed to create role');
          return;
        }
      }
      loadData();
      setShowModal(false);
    } catch (error) {
      toast.error('Error saving role');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this role?')) {
      setLoading(true);
      try {
        const response = await rolesAPI.delete(id);
        if (response.success) {
          toast.success('Role deleted');
          loadData();
        } else {
          toast.error(response.message || 'Failed to delete role');
        }
      } catch (error) {
        toast.error('Error deleting role');
      } finally {
        setLoading(false);
      }
    }
  }

  const togglePermission = (permission: string) => {
    if (formData.permissions.includes(permission)) {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter((p) => p !== permission),
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permission],
      });
    }
  };

  const filtered = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Roles</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage user roles and permissions</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Role
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-semibold">Code</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Permissions</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((role) => (
              <tr
                key={role.id}
                className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-3 text-sm">{role.code}</td>
                <td className="px-4 py-3 text-sm font-medium">{role.name}</td>
                <td className="px-4 py-3 text-sm">{role.description}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                    {role.permissions.length} permissions
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      role.isActive
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                    }`}
                  >
                    {role.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleOpenModal(role)}
                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg mr-2"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">{editingRole ? 'Edit Role' : 'Add Role'}</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Permissions</label>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {availablePermissions.map((permission) => (
                    <label key={permission} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission)}
                        onChange={() => togglePermission(permission)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                >
                  {editingRole ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold"
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
