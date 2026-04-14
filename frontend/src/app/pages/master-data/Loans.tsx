import { useState, useEffect } from 'react';
import { db } from '../../db/database';
import type { Loan } from '../../types';
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function Loans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [formData, setFormData] = useState({ name: '', type: 'fertilizer' as 'fertilizer' | 'seed' | 'tool' | 'other', price: '', unit: '', description: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => setLoans(await db.loans.findAll());

  const handleOpenModal = (loan?: Loan) => {
    if (loan) {
      setEditingLoan(loan);
      setFormData({ name: loan.name, type: loan.type, price: loan.price.toString(), unit: loan.unit, description: loan.description || '' });
    } else {
      setEditingLoan(null);
      setFormData({ name: '', type: 'fertilizer', price: '', unit: '', description: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...formData, price: parseFloat(formData.price) };
    if (editingLoan) {
      await db.loans.update(editingLoan.id, data);
      toast.success('Loan updated');
    } else {
      await db.loans.create(data);
      toast.success('Loan created');
    }
    loadData();
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this loan?')) {
      await db.loans.delete(id);
      toast.success('Loan deleted');
      loadData();
    }
  };

  const filtered = loans.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loans</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage loan products</p>
        </div>
        <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2"><Plus className="w-5 h-5" />Add Loan</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search loans..." className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Unit</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(loan => (
              <tr key={loan.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3 text-sm">{loan.name}</td>
                <td className="px-4 py-3 text-sm capitalize">{loan.type}</td>
                <td className="px-4 py-3 text-sm">TZS {loan.price.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">{loan.unit}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleOpenModal(loan)} className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg mr-2"><Edit className="w-4 h-4 text-blue-600" /></button>
                  <button onClick={() => handleDelete(loan.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"><Trash2 className="w-4 h-4 text-red-600" /></button>
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
              <h2 className="text-2xl font-bold">{editingLoan ? 'Edit Loan' : 'Add Loan'}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg">
                  <option value="fertilizer">Fertilizer</option>
                  <option value="seed">Seed</option>
                  <option value="tool">Tool</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price (TZS)</label>
                  <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Unit</label>
                  <input type="text" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg" rows={3} />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold">{editingLoan ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
