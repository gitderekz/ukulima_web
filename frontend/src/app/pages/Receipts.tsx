import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { purchasesAPI, rebalesAPI, transportsAPI, loansAPI, farmersAPI, usersAPI, cropsAPI, gradesAPI } from '../../services/api';
import type { Farmer, User, Crop, Grade } from '../types';
import { Search, FileText, Printer } from 'lucide-react';
import { toast } from 'sonner';

type ReceiptType = 'buying' | 'rebale' | 'transport' | 'loan';

interface ReceiptItem {
  id: string;
  type: ReceiptType;
  receiptNumber: string;
  date: string;
  farmerName?: string;
  amount: number;
  entity: any;
}

export default function Receipts() {
  const { t } = useTranslation();

  const [receipts, setReceipts] = useState<ReceiptItem[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<ReceiptItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | ReceiptType>('all');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    loadData();
  }, [filterDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [farmersRes, usersRes, cropsRes, gradesRes, purchasesRes] = await Promise.all([
        farmersAPI.getAll(),
        usersAPI.getAll(),
        cropsAPI.getAll(),
        gradesAPI.getAll(),
        purchasesAPI.getAll(),
      ]);

      if (farmersRes.success && farmersRes.data) setFarmers(farmersRes.data);
      if (usersRes.success && usersRes.data) setUsers(usersRes.data);
      if (cropsRes.success && cropsRes.data) setCrops(cropsRes.data);
      if (gradesRes.success && gradesRes.data) setGrades(gradesRes.data);

      // Combine all receipts
      const allReceipts: ReceiptItem[] = [];
      
      if (purchasesRes.success && purchasesRes.data) {
        purchasesRes.data.forEach((p: any) => {
          const farmer = farmersRes.data?.find((f: any) => f.id === p.farmerId);
          allReceipts.push({
            id: p.id,
            type: 'buying',
            receiptNumber: p.id.substring(0, 10),
            date: p.purchaseDate,
            farmerName: `${farmer?.firstName} ${farmer?.lastName}`,
            amount: p.totalCost,
            entity: p,
          });
        });
      }
      
      setReceipts(allReceipts);
    } catch (error) {
      toast.error('Failed to load receipts');
    } finally {
      setLoading(false);
    }
  };

  const loadReceipts = async () => {
    const allReceipts: ReceiptItem[] = [];

    try {
      // Load buying receipts
      const purchasesRes = await purchasesAPI.getAll();
      if (purchasesRes.success && purchasesRes.data) {
        purchasesRes.data.forEach((p: any) => {
          const today = new Date().toISOString().split('T')[0];
          if (p.purchaseDate?.startsWith(today)) {
            const farmer = farmers.find((f) => f.id === p.farmerId);
            allReceipts.push({
              id: p.id,
              type: 'buying',
              receiptNumber: p.id.substring(0, 10),
              date: p.purchaseDate,
              farmerName: farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown',
              amount: p.totalCost,
              entity: p,
            });
          }
        });
      }

      // Load rebale receipts
      const rebalesRes = await rebalesAPI.getAll();
      if (rebalesRes.success && rebalesRes.data) {
        rebalesRes.data.forEach((r: any) => {
          const today = new Date().toISOString().split('T')[0];
          if (r.createdAt?.startsWith(today)) {
            allReceipts.push({
              id: r.id,
              type: 'rebale',
              receiptNumber: r.rebaleTag,
              date: r.createdAt,
              amount: r.mass * (r.price || 0),
              entity: r,
            });
          }
        });
      }

      // Load transport receipts
      const transportsRes = await transportsAPI.getAll();
      if (transportsRes.success && transportsRes.data) {
        transportsRes.data.forEach((t: any) => {
          const today = new Date().toISOString().split('T')[0];
          if (t.createdAt?.startsWith(today)) {
            allReceipts.push({
              id: t.id,
              type: 'transport',
              receiptNumber: t.id.substring(0, 10),
              date: t.createdAt,
              amount: t.totalAmount || 0,
              entity: t,
            });
          }
        });
      }

      // Load loan receipts
      const loansRes = await loansAPI.getAll();
      if (loansRes.success && loansRes.data) {
        loansRes.data.forEach((l: any) => {
          const today = new Date().toISOString().split('T')[0];
          if (l.createdAt?.startsWith(today)) {
            const farmer = farmers.find((f) => f.id === l.farmerId);
            allReceipts.push({
              id: l.id,
              type: 'loan',
              receiptNumber: l.id.substring(0, 10),
              date: l.createdAt,
              farmerName: farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown',
              amount: l.loanAmount || 0,
              entity: l,
            });
          }
        });
      }

      setReceipts(allReceipts);
      setFilteredReceipts(allReceipts);
    } catch (error) {
      toast.error('Failed to load receipts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = receipts;

    if (filterType !== 'all') {
      filtered = filtered.filter((r) => r.type === filterType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.receiptNumber.toLowerCase().includes(query) ||
          (r.farmerName && r.farmerName.toLowerCase().includes(query))
      );
    }

    setFilteredReceipts(filtered);
  }, [searchQuery, filterType, receipts]);

  const viewReceipt = (receipt: ReceiptItem) => {
    toast.info('Opening receipt...');
    // This would open a detailed view or regenerate the receipt
    console.log('Receipt:', receipt);
  };

  const getTypeColor = (type: ReceiptType) => {
    switch (type) {
      case 'buying':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'rebale':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300';
      case 'transport':
        return 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300';
      case 'loan':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Receipts</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">View and regenerate receipts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{filteredReceipts.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Receipts</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-900 dark:text-green-300 mb-1">
            {filteredReceipts.filter((r) => r.type === 'buying').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Buying Receipts</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-300 mb-1">
            {filteredReceipts.filter((r) => r.type === 'rebale').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Rebale Receipts</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-300 mb-1">
            {filteredReceipts.filter((r) => r.type === 'transport').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Transport Receipts</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Types</option>
              <option value="buying">Buying</option>
              <option value="rebale">Rebale</option>
              <option value="transport">Transport</option>
              <option value="loan">Loan Assignment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search receipts..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Receipts List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Receipts for {filterDate} ({filteredReceipts.length})
        </h3>

        {filteredReceipts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No receipts found for the selected date and filters</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredReceipts.map((receipt) => (
              <div
                key={`${receipt.type}-${receipt.id}`}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getTypeColor(receipt.type)}`}>
                      {receipt.type}
                    </span>
                    <p className="font-semibold text-gray-900 dark:text-white">{receipt.receiptNumber}</p>
                  </div>
                  {receipt.farmerName && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{receipt.farmerName}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">TZS {receipt.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{receipt.date}</p>
                  </div>
                  <button
                    onClick={() => viewReceipt(receipt)}
                    className="p-2 bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 rounded-lg transition-colors"
                    title="View/Print Receipt"
                  >
                    <Printer className="w-5 h-5 text-green-600 dark:text-green-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
