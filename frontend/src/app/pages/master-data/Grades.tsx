import { useState, useEffect } from 'react';
import { db } from '../../db/database';
import type { Grade } from '../../types';
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function Grades() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => setGrades(await db.grades.findAll());

  const handleOpenModal = (grade?: Grade) => {
    if (grade) {
      setEditingGrade(grade);
      setFormData({ name: grade.name, code: grade.code, description: grade.description || '' });
    } else {
      setEditingGrade(null);
      setFormData({ name: '', code: '', description: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGrade) {
      await db.grades.update(editingGrade.id, formData);
      toast.success('Grade updated');
    } else {
      await db.grades.create(formData);
      toast.success('Grade created');
    }
    loadData();
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this grade?')) {
      await db.grades.delete(id);
      toast.success('Grade deleted');
      loadData();
    }
  };

  const filtered = grades.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.code.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Grades</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage quality grades</p>
        </div>
        <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2"><Plus className="w-5 h-5" />Add Grade</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search grades..." className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-semibold">Code</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(grade => (
              <tr key={grade.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3 text-sm">{grade.code}</td>
                <td className="px-4 py-3 text-sm">{grade.name}</td>
                <td className="px-4 py-3 text-sm">{grade.description || '-'}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleOpenModal(grade)} className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg mr-2"><Edit className="w-4 h-4 text-blue-600" /></button>
                  <button onClick={() => handleDelete(grade.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"><Trash2 className="w-4 h-4 text-red-600" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">{editingGrade ? 'Edit Grade' : 'Add Grade'}</h2>
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
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg" rows={3} />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold">{editingGrade ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
