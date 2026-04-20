// import { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { purchasesAPI, rebalesAPI, transportsAPI, loansAPI, farmersAPI, usersAPI, cropsAPI, gradesAPI } from '../../services/api';
// import type { Farmer, User, Crop, Grade } from '../types';
// import { Search, FileText, Printer } from 'lucide-react';
// import { toast } from 'sonner';

// type ReceiptType = 'buying' | 'rebale' | 'transport' | 'loan';

// interface ReceiptItem {
//   id: string;
//   type: ReceiptType;
//   receiptNumber: string;
//   date: string;
//   farmerName?: string;
//   amount: number;
//   entity: any;
// }

// export default function Receipts() {
//   const { t } = useTranslation();

//   const [receipts, setReceipts] = useState<ReceiptItem[]>([]);
//   const [filteredReceipts, setFilteredReceipts] = useState<ReceiptItem[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterType, setFilterType] = useState<'all' | ReceiptType>('all');
//   const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
//   const [loading, setLoading] = useState(false);

//   const [farmers, setFarmers] = useState<Farmer[]>([]);
//   const [users, setUsers] = useState<User[]>([]);
//   const [crops, setCrops] = useState<Crop[]>([]);
//   const [grades, setGrades] = useState<Grade[]>([]);

//   useEffect(() => {
//     loadData();
//   }, [filterDate]);

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const [farmersRes, usersRes, cropsRes, gradesRes, purchasesRes] = await Promise.all([
//         farmersAPI.getAll(),
//         usersAPI.getAll(),
//         cropsAPI.getAll(),
//         gradesAPI.getAll(),
//         purchasesAPI.getAll(),
//       ]);

//       if (farmersRes.success && farmersRes.data) setFarmers(farmersRes.data);
//       if (usersRes.success && usersRes.data) setUsers(usersRes.data);
//       if (cropsRes.success && cropsRes.data) setCrops(cropsRes.data);
//       if (gradesRes.success && gradesRes.data) setGrades(gradesRes.data);

//       // Combine all receipts
//       const allReceipts: ReceiptItem[] = [];
      
//       if (purchasesRes.success && purchasesRes.data) {
//         purchasesRes.data.forEach((p: any) => {
//           const farmer = farmersRes.data?.find((f: any) => f.id === p.farmerId);
//           allReceipts.push({
//             id: p.id,
//             type: 'buying',
//             receiptNumber: p.id.substring(0, 10),
//             date: p.purchaseDate,
//             farmerName: `${farmer?.firstName} ${farmer?.lastName}`,
//             amount: p.totalCost,
//             entity: p,
//           });
//         });
//       }
      
//       setReceipts(allReceipts);
//     } catch (error) {
//       toast.error('Failed to load receipts');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadReceipts = async () => {
//     const allReceipts: ReceiptItem[] = [];

//     try {
//       // Load buying receipts
//       const purchasesRes = await purchasesAPI.getAll();
//       if (purchasesRes.success && purchasesRes.data) {
//         purchasesRes.data.forEach((p: any) => {
//           const today = new Date().toISOString().split('T')[0];
//           if (p.purchaseDate?.startsWith(today)) {
//             const farmer = farmers.find((f) => f.id === p.farmerId);
//             allReceipts.push({
//               id: p.id,
//               type: 'buying',
//               receiptNumber: p.id.substring(0, 10),
//               date: p.purchaseDate,
//               farmerName: farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown',
//               amount: p.totalCost,
//               entity: p,
//             });
//           }
//         });
//       }

//       // Load rebale receipts
//       const rebalesRes = await rebalesAPI.getAll();
//       if (rebalesRes.success && rebalesRes.data) {
//         rebalesRes.data.forEach((r: any) => {
//           const today = new Date().toISOString().split('T')[0];
//           if (r.createdAt?.startsWith(today)) {
//             allReceipts.push({
//               id: r.id,
//               type: 'rebale',
//               receiptNumber: r.rebaleTag,
//               date: r.createdAt,
//               amount: r.mass * (r.price || 0),
//               entity: r,
//             });
//           }
//         });
//       }

//       // Load transport receipts
//       const transportsRes = await transportsAPI.getAll();
//       if (transportsRes.success && transportsRes.data) {
//         transportsRes.data.forEach((t: any) => {
//           const today = new Date().toISOString().split('T')[0];
//           if (t.createdAt?.startsWith(today)) {
//             allReceipts.push({
//               id: t.id,
//               type: 'transport',
//               receiptNumber: t.id.substring(0, 10),
//               date: t.createdAt,
//               amount: t.totalAmount || 0,
//               entity: t,
//             });
//           }
//         });
//       }

//       // Load loan receipts
//       const loansRes = await loansAPI.getAll();
//       if (loansRes.success && loansRes.data) {
//         loansRes.data.forEach((l: any) => {
//           const today = new Date().toISOString().split('T')[0];
//           if (l.createdAt?.startsWith(today)) {
//             const farmer = farmers.find((f) => f.id === l.farmerId);
//             allReceipts.push({
//               id: l.id,
//               type: 'loan',
//               receiptNumber: l.id.substring(0, 10),
//               date: l.createdAt,
//               farmerName: farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown',
//               amount: l.loanAmount || 0,
//               entity: l,
//             });
//           }
//         });
//       }

//       setReceipts(allReceipts);
//       setFilteredReceipts(allReceipts);
//     } catch (error) {
//       toast.error('Failed to load receipts');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     let filtered = receipts;

//     if (filterType !== 'all') {
//       filtered = filtered.filter((r) => r.type === filterType);
//     }

//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(
//         (r) =>
//           r.receiptNumber.toLowerCase().includes(query) ||
//           (r.farmerName && r.farmerName.toLowerCase().includes(query))
//       );
//     }

//     setFilteredReceipts(filtered);
//   }, [searchQuery, filterType, receipts]);

//   const viewReceipt = (receipt: ReceiptItem) => {
//     toast.info('Opening receipt...');
//     // This would open a detailed view or regenerate the receipt
//     console.log('Receipt:', receipt);
//   };

//   const getTypeColor = (type: ReceiptType) => {
//     switch (type) {
//       case 'buying':
//         return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
//       case 'rebale':
//         return 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300';
//       case 'transport':
//         return 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300';
//       case 'loan':
//         return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
//       default:
//         return 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300';
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Receipts</h1>
//         <p className="text-gray-600 dark:text-gray-400 mt-1">View and regenerate receipts</p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
//           <div className="flex items-center justify-between mb-2">
//             <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
//               <FileText className="w-6 h-6 text-blue-600 dark:text-blue-300" />
//             </div>
//           </div>
//           <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{filteredReceipts.length}</div>
//           <div className="text-sm text-gray-600 dark:text-gray-400">Total Receipts</div>
//         </div>

//         <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
//           <div className="text-2xl font-bold text-green-900 dark:text-green-300 mb-1">
//             {filteredReceipts.filter((r) => r.type === 'buying').length}
//           </div>
//           <div className="text-sm text-gray-600 dark:text-gray-400">Buying Receipts</div>
//         </div>

//         <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
//           <div className="text-2xl font-bold text-purple-900 dark:text-purple-300 mb-1">
//             {filteredReceipts.filter((r) => r.type === 'rebale').length}
//           </div>
//           <div className="text-sm text-gray-600 dark:text-gray-400">Rebale Receipts</div>
//         </div>

//         <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
//           <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-300 mb-1">
//             {filteredReceipts.filter((r) => r.type === 'transport').length}
//           </div>
//           <div className="text-sm text-gray-600 dark:text-gray-400">Transport Receipts</div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
//             <input
//               type="date"
//               value={filterDate}
//               onChange={(e) => setFilterDate(e.target.value)}
//               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
//             <select
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value as any)}
//               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
//             >
//               <option value="all">All Types</option>
//               <option value="buying">Buying</option>
//               <option value="rebale">Rebale</option>
//               <option value="transport">Transport</option>
//               <option value="loan">Loan Assignment</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
//             <div className="relative">
//               <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search receipts..."
//                 className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Receipts List */}
//       <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
//         <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
//           Receipts for {filterDate} ({filteredReceipts.length})
//         </h3>

//         {filteredReceipts.length === 0 ? (
//           <div className="text-center py-12">
//             <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-600 dark:text-gray-400">No receipts found for the selected date and filters</p>
//           </div>
//         ) : (
//           <div className="space-y-2">
//             {filteredReceipts.map((receipt) => (
//               <div
//                 key={`${receipt.type}-${receipt.id}`}
//                 className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
//               >
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-1">
//                     <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getTypeColor(receipt.type)}`}>
//                       {receipt.type}
//                     </span>
//                     <p className="font-semibold text-gray-900 dark:text-white">{receipt.receiptNumber}</p>
//                   </div>
//                   {receipt.farmerName && (
//                     <p className="text-sm text-gray-600 dark:text-gray-400">{receipt.farmerName}</p>
//                   )}
//                 </div>

//                 <div className="flex items-center gap-4">
//                   <div className="text-right">
//                     <p className="font-semibold text-gray-900 dark:text-white">TZS {receipt.amount.toLocaleString()}</p>
//                     <p className="text-xs text-gray-500 dark:text-gray-500">{receipt.date}</p>
//                   </div>
//                   <button
//                     onClick={() => viewReceipt(receipt)}
//                     className="p-2 bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 rounded-lg transition-colors"
//                     title="View/Print Receipt"
//                   >
//                     <Printer className="w-5 h-5 text-green-600 dark:text-green-300" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { purchasesAPI, rebalesAPI, transportsAPI, loansAPI, farmersAPI, usersAPI, cropsAPI, gradesAPI } from '../../services/api';
import type { Farmer, User, Crop, Grade } from '../types';
import { Search, FileText, Printer, X, Package, Truck, DollarSign, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

type ReceiptType = 'buying' | 'rebale' | 'transport' | 'loan';

interface ReceiptItem {
  id: string | number;
  type: ReceiptType;
  receiptNumber: string;
  date: string;
  farmerName?: string;
  farmerCode?: string;
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
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptItem | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    loadMasterData();
  }, []);

  useEffect(() => {
    if (farmers.length > 0) {
      loadReceipts();
    }
  }, [filterDate, farmers]);

  const loadMasterData = async () => {
    setLoading(true);
    try {
      const [farmersRes, usersRes, cropsRes, gradesRes] = await Promise.all([
        farmersAPI.getAll(),
        usersAPI.getAll(),
        cropsAPI.getAll(),
        gradesAPI.getAll(),
      ]);

      if (farmersRes.success && farmersRes.data) setFarmers(farmersRes.data);
      if (usersRes.success && usersRes.data) setUsers(usersRes.data);
      if (cropsRes.success && cropsRes.data) setCrops(cropsRes.data);
      if (gradesRes.success && gradesRes.data) setGrades(gradesRes.data);
    } catch (error) {
      console.error('Failed to load master data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadReceipts = async () => {
    setLoading(true);
    const allReceipts: ReceiptItem[] = [];

    try {
      // Load buying receipts (purchases)
      const purchasesRes = await purchasesAPI.getAll();
      if (purchasesRes.success && purchasesRes.data) {
        purchasesRes.data.forEach((p: any) => {
          const purchaseDate = new Date(p.purchaseDate).toISOString().split('T')[0];
          if (purchaseDate === filterDate) {
            const farmer = farmers.find((f) => f.id === p.farmerId);
            allReceipts.push({
              id: p.id,
              type: 'buying',
              receiptNumber: p.receiptNumber || `RCP-${p.id}`,
              date: p.purchaseDate,
              farmerName: farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown',
              farmerCode: farmer?.code,
              amount: parseFloat(p.totalAmount || 0),
              entity: p,
            });
          }
        });
      }

      // Load rebale receipts
      const rebalesRes = await rebalesAPI.getAll();
      if (rebalesRes.success && rebalesRes.data) {
        rebalesRes.data.forEach((r: any) => {
          const rebaleDate = new Date(r.rebaleDate || r.createdAt).toISOString().split('T')[0];
          if (rebaleDate === filterDate) {
            allReceipts.push({
              id: r.id,
              type: 'rebale',
              receiptNumber: r.rebaleTag,
              date: r.rebaleDate || r.createdAt,
              amount: parseFloat(r.totalAmount || 0),
              entity: r,
            });
          }
        });
      }

      // Load transport receipts
      const transportsRes = await transportsAPI.getAll();
      if (transportsRes.success && transportsRes.data) {
        transportsRes.data.forEach((t: any) => {
          const transportDate = new Date(t.transportDate || t.createdAt).toISOString().split('T')[0];
          if (transportDate === filterDate) {
            allReceipts.push({
              id: t.id,
              type: 'transport',
              receiptNumber: t.receiptNumber || `TRN-${t.id}`,
              date: t.transportDate || t.createdAt,
              amount: parseFloat(t.totalAmount || 0),
              entity: t,
            });
          }
        });
      }

      // Load loan receipts
      const loansRes = await loansAPI.getAll();
      if (loansRes.success && loansRes.data) {
        loansRes.data.forEach((l: any) => {
          const loanDate = new Date(l.createdAt).toISOString().split('T')[0];
          if (loanDate === filterDate) {
            const farmer = farmers.find((f) => f.id === l.farmerId);
            allReceipts.push({
              id: l.id,
              type: 'loan',
              receiptNumber: `LOAN-${l.id}`,
              date: l.createdAt,
              farmerName: farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown',
              farmerCode: farmer?.code,
              amount: parseFloat(l.totalAmount || l.loanAmount || 0),
              entity: l,
            });
          }
        });
      }

      // Sort by date (newest first)
      allReceipts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setReceipts(allReceipts);
      setFilteredReceipts(allReceipts);
    } catch (error) {
      console.error('Failed to load receipts:', error);
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
          (r.farmerName && r.farmerName.toLowerCase().includes(query)) ||
          (r.farmerCode && r.farmerCode.toLowerCase().includes(query))
      );
    }

    setFilteredReceipts(filtered);
  }, [searchQuery, filterType, receipts]);

  const viewReceipt = (receipt: ReceiptItem) => {
    setSelectedReceipt(receipt);
    setShowReceiptModal(true);
  };

  const printReceipt = () => {
    window.print();
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

  const getTypeIcon = (type: ReceiptType) => {
    switch (type) {
      case 'buying':
        return <ShoppingBag className="w-5 h-5" />;
      case 'rebale':
        return <Package className="w-5 h-5" />;
      case 'transport':
        return <Truck className="w-5 h-5" />;
      case 'loan':
        return <DollarSign className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const ReceiptModal = () => {
    if (!selectedReceipt) return null;

    const { type, receiptNumber, date, amount, entity, farmerName, farmerCode } = selectedReceipt;
    const formattedDate = new Date(date).toLocaleString();

    const renderBuyingReceipt = () => (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Receipt Number</p>
            <p className="font-semibold text-gray-900 dark:text-white">{receiptNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-semibold text-gray-900 dark:text-white">{formattedDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Farmer</p>
            <p className="font-semibold text-gray-900 dark:text-white">{farmerName}</p>
            {farmerCode && <p className="text-xs text-gray-500">{farmerCode}</p>}
          </div>
          <div>
            <p className="text-sm text-gray-500">Buyer</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {entity.buyer?.firstName} {entity.buyer?.lastName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Mass</p>
            <p className="font-semibold text-gray-900 dark:text-white">{parseFloat(entity.totalMass).toFixed(2)} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="font-semibold text-green-600 dark:text-green-400">TZS {parseFloat(entity.totalAmount).toLocaleString()}</p>
          </div>
          {parseFloat(entity.loanDeducted) > 0 && (
            <>
              <div>
                <p className="text-sm text-gray-500">Loan Deducted</p>
                <p className="font-semibold text-red-600 dark:text-red-400">TZS {parseFloat(entity.loanDeducted).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount Paid</p>
                <p className="font-semibold text-blue-600 dark:text-blue-400">TZS {parseFloat(entity.amountPaid).toLocaleString()}</p>
              </div>
            </>
          )}
        </div>
      </div>
    );

    const renderRebaleReceipt = () => (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Rebale Tag</p>
            <p className="font-semibold text-gray-900 dark:text-white">{entity.rebaleTag}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-semibold text-gray-900 dark:text-white">{formattedDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Crop</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {crops.find(c => c.id === entity.cropId)?.name || '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Grade</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {grades.find(g => g.id === entity.gradeId)?.name || '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Mass</p>
            <p className="font-semibold text-gray-900 dark:text-white">{parseFloat(entity.totalMass).toFixed(2)} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Price per kg</p>
            <p className="font-semibold text-gray-900 dark:text-white">TZS {parseFloat(entity.price).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="font-semibold text-green-600 dark:text-green-400">TZS {parseFloat(entity.totalAmount).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-semibold capitalize text-gray-900 dark:text-white">{entity.status}</p>
          </div>
        </div>
      </div>
    );

    const renderTransportReceipt = () => (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Receipt Number</p>
            <p className="font-semibold text-gray-900 dark:text-white">{entity.receiptNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-semibold text-gray-900 dark:text-white">{formattedDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Driver Name</p>
            <p className="font-semibold text-gray-900 dark:text-white">{entity.driverName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Driver Phone</p>
            <p className="font-semibold text-gray-900 dark:text-white">{entity.driverPhone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Truck Plate 1</p>
            <p className="font-semibold text-gray-900 dark:text-white">{entity.truckPlate1}</p>
          </div>
          {entity.truckPlate2 && (
            <div>
              <p className="text-sm text-gray-500">Truck Plate 2</p>
              <p className="font-semibold text-gray-900 dark:text-white">{entity.truckPlate2}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Total Mass</p>
            <p className="font-semibold text-gray-900 dark:text-white">{parseFloat(entity.totalMass).toFixed(2)} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="font-semibold text-green-600 dark:text-green-400">TZS {parseFloat(entity.totalAmount).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-semibold capitalize text-gray-900 dark:text-white">{entity.status}</p>
          </div>
        </div>
        
        {/* Associated Rebales */}
        {entity.Rebales && entity.Rebales.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Loaded Rebales</p>
            <div className="space-y-1">
              {entity.Rebales.map((rebale: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span>{rebale.rebaleTag}</span>
                  <span>{parseFloat(rebale.totalMass).toFixed(2)} kg</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );

    const renderLoanReceipt = () => (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Loan ID</p>
            <p className="font-semibold text-gray-900 dark:text-white">{entity.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-semibold text-gray-900 dark:text-white">{formattedDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Farmer</p>
            <p className="font-semibold text-gray-900 dark:text-white">{farmerName}</p>
            {farmerCode && <p className="text-xs text-gray-500">{farmerCode}</p>}
          </div>
          <div>
            <p className="text-sm text-gray-500">Loan Amount</p>
            <p className="font-semibold text-red-600 dark:text-red-400">TZS {parseFloat(entity.totalAmount || entity.loanAmount || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Remaining Debt</p>
            <p className="font-semibold text-orange-600 dark:text-orange-400">TZS {parseFloat(entity.remainingDebt || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-semibold capitalize text-gray-900 dark:text-white">{entity.status || 'Active'}</p>
          </div>
        </div>
      </div>
    );

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getTypeColor(type)}`}>
                {getTypeIcon(type)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                  {type} Receipt
                </h2>
                <p className="text-sm text-gray-500">{receiptNumber}</p>
              </div>
            </div>
            <button
              onClick={() => setShowReceiptModal(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {type === 'buying' && renderBuyingReceipt()}
            {type === 'rebale' && renderRebaleReceipt()}
            {type === 'transport' && renderTransportReceipt()}
            {type === 'loan' && renderLoanReceipt()}
          </div>

          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 flex gap-4">
            <button
              onClick={printReceipt}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-5 h-5" />
              Print Receipt
            </button>
            <button
              onClick={() => setShowReceiptModal(false)}
              className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const stats = {
    total: filteredReceipts.length,
    buying: filteredReceipts.filter((r) => r.type === 'buying').length,
    rebale: filteredReceipts.filter((r) => r.type === 'rebale').length,
    transport: filteredReceipts.filter((r) => r.type === 'transport').length,
    loan: filteredReceipts.filter((r) => r.type === 'loan').length,
    totalAmount: filteredReceipts.reduce((sum, r) => sum + r.amount, 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Receipts</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">View and regenerate receipts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Receipts</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.buying}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Buying</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.rebale}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Rebale</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.transport}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Transport</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.loan}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Loan</div>
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
                placeholder="Search by receipt #, farmer name, or code..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Receipts List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Receipts for {new Date(filterDate).toLocaleDateString()} ({filteredReceipts.length})
        </h3>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading receipts...</p>
          </div>
        ) : filteredReceipts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No receipts found for the selected date and filters</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredReceipts.map((receipt) => (
              <div
                key={`${receipt.type}-${receipt.id}`}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => viewReceipt(receipt)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize flex items-center gap-1 ${getTypeColor(receipt.type)}`}>
                      {getTypeIcon(receipt.type)}
                      {receipt.type}
                    </span>
                    <p className="font-semibold text-gray-900 dark:text-white">{receipt.receiptNumber}</p>
                  </div>
                  {receipt.farmerName && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {receipt.farmerName} {receipt.farmerCode && `(${receipt.farmerCode})`}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">TZS {receipt.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{new Date(receipt.date).toLocaleTimeString()}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      viewReceipt(receipt);
                    }}
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

      {/* Receipt Modal */}
      {showReceiptModal && <ReceiptModal />}
    </div>
  );
}