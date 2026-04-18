import { useState, useEffect } from 'react';
import { locationsAPI } from '../../services/api';
import type { Location, LocationType } from '../../types';
import { Plus, Edit, Trash2, X, Search, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', type: 'street' as LocationType, parentId: '' });
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await locationsAPI.getAll();
      if (response.success && response.data) {
        setLocations(response.data);
      } else {
        toast.error(response.message || 'Failed to load locations');
      }
    } catch (error) {
      toast.error('Error loading locations');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (location?: Location) => {
    if (location) {
      setEditingLocation(location);
      setFormData({ name: location.name, code: location.code, type: location.type, parentId: location.parentId || '' });
    } else {
      setEditingLocation(null);
      setFormData({ name: '', code: '', type: 'street', parentId: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...formData, parentId: formData.parentId || null };
      let response;
      if (editingLocation) {
        response = await locationsAPI.update(editingLocation.id, data);
        if (response.success) {
          toast.success('Location updated');
        } else {
          toast.error(response.message || 'Failed to update location');
          return;
        }
      } else {
        response = await locationsAPI.create(data);
        if (response.success) {
          toast.success('Location created');
        } else {
          toast.error(response.message || 'Failed to create location');
          return;
        }
      }
      loadData();
      setShowModal(false);
    } catch (error) {
      toast.error('Error saving location');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this location?')) {
      setLoading(true);
      try {
        const response = await locationsAPI.delete(id);
        if (response.success) {
          toast.success('Location deleted');
          loadData();
        } else {
          toast.error(response.message || 'Failed to delete location');
        }
      } catch (error) {
        toast.error('Error deleting location');
      } finally {
        setLoading(false);
      }
    }
  }

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  const getLocationHierarchy = () => {
    const hierarchy: any[] = [];
    const topLevel = locations.filter(l => !l.parentId);

    const buildTree = (parent: Location, level: number = 0): any => {
      const children = locations.filter(l => l.parentId === parent.id);
      return {
        ...parent,
        level,
        children: children.map(child => buildTree(child, level + 1))
      };
    };

    topLevel.forEach(loc => {
      hierarchy.push(buildTree(loc));
    });

    return hierarchy;
  };

  const renderLocationTree = (items: any[]) => {
    return items.map(item => (
      <div key={item.id}>
        <div className="flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700" style={{ paddingLeft: `${item.level * 24 + 12}px` }}>
          {item.children.length > 0 && (
            <button onClick={() => toggleExpand(item.id)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
              <ChevronRight className={`w-4 h-4 transition-transform ${expandedNodes.has(item.id) ? 'rotate-90' : ''}`} />
            </button>
          )}
          {item.children.length === 0 && <div className="w-6" />}
          <div className="flex-1 grid grid-cols-4 gap-4">
            <div className="text-sm font-medium">{item.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{item.code}</div>
            <div className="text-sm"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs capitalize">{item.type}</span></div>
            <div className="text-right">
              <button onClick={() => handleOpenModal(item)} className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg mr-2"><Edit className="w-4 h-4 text-blue-600" /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"><Trash2 className="w-4 h-4 text-red-600" /></button>
            </div>
          </div>
        </div>
        {expandedNodes.has(item.id) && item.children.length > 0 && renderLocationTree(item.children)}
      </div>
    ));
  };

  const typeOrder: LocationType[] = ['zone', 'cpp', 'region', 'district', 'ward', 'street'];
  const getParentTypeOptions = (selectedType: LocationType) => {
    const currentIndex = typeOrder.indexOf(selectedType);
    if (currentIndex <= 0) return [];
    return typeOrder.slice(0, currentIndex);
  };

  const hierarchy = getLocationHierarchy();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Locations</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage hierarchical locations (Street → Ward → District → Region → CPP → Zone)</p>
        </div>
        <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2"><Plus className="w-5 h-5" />Add Location</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-4 gap-4 font-semibold text-sm text-gray-700 dark:text-gray-300">
            <div>Name</div>
            <div>Code</div>
            <div>Type</div>
            <div className="text-right">Actions</div>
          </div>
        </div>
        <div>
          {hierarchy.length > 0 ? renderLocationTree(hierarchy) : <p className="p-6 text-center text-gray-500">No locations found</p>}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">{editingLocation ? 'Edit Location' : 'Add Location'}</h2>
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
                <label className="block text-sm font-medium mb-2">Type</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as LocationType, parentId: '' })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg">
                  <option value="zone">Zone (Top Level)</option>
                  <option value="cpp">CPP</option>
                  <option value="region">Region</option>
                  <option value="district">District</option>
                  <option value="ward">Ward</option>
                  <option value="street">Street (Lowest Level)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Parent Location (Optional for Zone)</label>
                <select value={formData.parentId} onChange={(e) => setFormData({ ...formData, parentId: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg">
                  <option value="">None (Top Level)</option>
                  {locations.filter(l => getParentTypeOptions(formData.type).includes(l.type)).map(loc => <option key={loc.id} value={loc.id}>{loc.name} ({loc.type})</option>)}
                </select>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold">{editingLocation ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
