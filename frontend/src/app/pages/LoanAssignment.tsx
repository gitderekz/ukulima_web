import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { db } from '../db/database';
import type { Farmer, Loan, FarmerLoan } from '../types';
import { Search, Plus, Printer, X, TrendingUp, DollarSign, Users } from 'lucide-react';
import { toast } from 'sonner';

interface LoanQuantity {
  loanId: string;
  quantity: number;
}

export default function LoanAssignment() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [farmerSearch, setFarmerSearch] = useState('');
  const [farmerResults, setFarmerResults] = useState<Farmer[]>([]);

  const [loans, setLoans] = useState<Loan[]>([]);
  const [loanQuantities, setLoanQuantities] = useState<LoanQuantity[]>([]);

  const [todayAssignments, setTodayAssignments] = useState<FarmerLoan[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);

  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const [stats, setStats] = useState({
    totalAssignments: 0,
    totalAmount: 0,
    uniqueFarmers: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [loansData, farmersData] = await Promise.all([db.loans.findAll(), db.farmers.findAll()]);
    setLoans(loansData);
    setFarmers(farmersData);

    // Initialize quantities
    setLoanQuantities(loansData.map((l) => ({ loanId: l.id, quantity: 0 })));

    // Load today's assignments
    await loadTodayAssignments();
  };

  const loadTodayAssignments = async () => {
    const allAssignments = await db.farmerLoans.findAll();
    const today = new Date().toISOString().split('T')[0];
    const todayData = allAssignments.filter((a) => a.issuedDate === today);
    setTodayAssignments(todayData);

    // Calculate stats
    const totalAmount = todayData.reduce((sum, a) => sum + a.totalAmount, 0);
    const uniqueFarmers = new Set(todayData.map((a) => a.farmerId)).size;

    setStats({
      totalAssignments: todayData.length,
      totalAmount,
      uniqueFarmers,
    });
  };

  const searchFarmer = async (query: string) => {
    setFarmerSearch(query);
    if (query.length < 2) {
      setFarmerResults([]);
      return;
    }
    // Filter by user's location for extension officers
    const userLocationId = user?.locationId;
    const results = await db.farmers.search(query, userLocationId);
    setFarmerResults(results);
  };

  const selectFarmer = async (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setFarmerSearch(`${farmer.firstName} ${farmer.lastName} (${farmer.code})`);
    setFarmerResults([]);

    // Load existing loans for this farmer
    const existingLoans = await db.farmerLoans.findByFarmer(farmer.id);

    // Pre-fill quantities if farmer has existing loans today
    const today = new Date().toISOString().split('T')[0];
    const todayLoans = existingLoans.filter((l) => l.issuedDate === today);

    if (todayLoans.length > 0) {
      const updatedQuantities = loanQuantities.map((lq) => {
        const existing = todayLoans.find((tl) => tl.loanId === lq.loanId);
        return existing ? { ...lq, quantity: existing.quantity } : lq;
      });
      setLoanQuantities(updatedQuantities);
      toast.info('Loaded existing loans for today');
    } else {
      // Reset quantities
      setLoanQuantities(loans.map((l) => ({ loanId: l.id, quantity: 0 })));
    }
  };

  const handleQuantityChange = (loanId: string, quantity: number) => {
    setLoanQuantities(
      loanQuantities.map((lq) => (lq.loanId === loanId ? { ...lq, quantity: Math.max(0, quantity) } : lq))
    );
  };

  const calculateTotal = () => {
    return loanQuantities.reduce((sum, lq) => {
      const loan = loans.find((l) => l.id === lq.loanId);
      return sum + (loan ? loan.price * lq.quantity : 0);
    }, 0);
  };

  const handleAssignLoans = async () => {
    if (!selectedFarmer) {
      toast.error('Please select a farmer');
      return;
    }

    const activeLoans = loanQuantities.filter((lq) => lq.quantity > 0);

    if (activeLoans.length === 0) {
      toast.error('Please enter at least one loan quantity');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const createdLoans: FarmerLoan[] = [];

    // Check if farmer already has loans assigned today
    const existingLoans = await db.farmerLoans.findByFarmer(selectedFarmer.id);
    const todayLoans = existingLoans.filter((l) => l.issuedDate === today);

    for (const lq of activeLoans) {
      const loan = loans.find((l) => l.id === lq.loanId);
      if (!loan) continue;

      const totalAmount = loan.price * lq.quantity;

      // Check if this loan was already assigned today
      const existingTodayLoan = todayLoans.find((tl) => tl.loanId === lq.loanId);

      if (existingTodayLoan) {
        // Update existing loan
        const updated = await db.farmerLoans.update(existingTodayLoan.id, {
          quantity: lq.quantity,
          totalAmount,
          remainingDebt: totalAmount,
        });
        createdLoans.push(updated);
      } else {
        // Create new loan
        const created = await db.farmerLoans.create({
          farmerId: selectedFarmer.id,
          loanId: lq.loanId,
          quantity: lq.quantity,
          totalAmount,
          remainingDebt: totalAmount,
          issuedDate: today,
        });
        createdLoans.push(created);
      }
    }

    // Update farmer's total debt
    const allFarmerLoans = await db.farmerLoans.findByFarmer(selectedFarmer.id);
    const newTotalDebt = allFarmerLoans.reduce((sum, l) => sum + l.remainingDebt, 0);
    await db.farmers.update(selectedFarmer.id, { totalDebt: newTotalDebt });

    // Create audit log
    await db.auditLogs.create({
      userId: user?.id || '',
      action: 'ASSIGN_LOANS',
      entityType: 'farmer_loan',
      entityId: createdLoans.map((l) => l.id).join(','),
      details: `Assigned ${createdLoans.length} loans to farmer ${selectedFarmer.code}`,
      ipAddress: '127.0.0.1',
    });

    // Prepare receipt data
    const loansWithDetails = createdLoans.map((fl) => ({
      ...fl,
      loan: loans.find((l) => l.id === fl.loanId)!,
    }));

    setReceiptData({
      farmer: selectedFarmer,
      loans: loansWithDetails,
      totalAmount: calculateTotal(),
      officer: user,
      date: new Date().toLocaleString(),
      issuedDate: today,
    });

    setShowReceipt(true);
    toast.success('Loans assigned successfully');
    loadTodayAssignments();
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setSelectedFarmer(null);
    setFarmerSearch('');
    setLoanQuantities(loans.map((l) => ({ loanId: l.id, quantity: 0 })));
  };

  if (showReceipt && receiptData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loan Assignment Receipt</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{receiptData.issuedDate}</p>
            </div>
            <button
              onClick={closeReceipt}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Date & Time</p>
                <p className="font-semibold text-gray-900 dark:text-white">{receiptData.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Extension Officer</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {receiptData.officer?.firstName} {receiptData.officer?.lastName} ({receiptData.officer?.code})
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Farmer Details</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {receiptData.farmer.firstName} {receiptData.farmer.lastName}
              </p>
              <p className="text-gray-600 dark:text-gray-400">{receiptData.farmer.code}</p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Loans Assigned</p>
              <div className="space-y-2">
                {receiptData.loans.map((fl: any) => (
                  <div key={fl.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{fl.loan.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {fl.quantity} {fl.loan.unit}(s) @ TZS {fl.loan.price.toLocaleString()}/{fl.loan.unit}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">TZS {fl.totalAmount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
              <div className="flex justify-between text-lg">
                <span className="font-bold text-gray-900 dark:text-white">Total Loan Amount</span>
                <span className="font-bold text-red-600 dark:text-red-400">TZS {receiptData.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-5 h-5" />
                Print Receipt
              </button>
              <button
                onClick={closeReceipt}
                className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loan Assignment</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Assign loans to farmers</p>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats.uniqueFarmers}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Farmers (Today)</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats.totalAssignments}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Assignments (Today)</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-red-600 dark:text-red-300" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            TZS {(stats.totalAmount / 1000).toFixed(1)}K
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Amount (Today)</div>
        </div>
      </div>

      {/* Farmer Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Select Farmer</h3>
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={farmerSearch}
              onChange={(e) => searchFarmer(e.target.value)}
              placeholder="Search farmer by name or code..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          {farmerResults.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {farmerResults.map((farmer) => (
                <button
                  key={farmer.id}
                  onClick={() => selectFarmer(farmer)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <p className="font-medium text-gray-900 dark:text-white">
                    {farmer.firstName} {farmer.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {farmer.code} | Current Debt: TZS {farmer.totalDebt.toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loan Assignment Form */}
      {selectedFarmer && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-400 mb-1">Selected Farmer</p>
            <p className="font-semibold text-blue-900 dark:text-blue-300">
              {selectedFarmer.firstName} {selectedFarmer.lastName} ({selectedFarmer.code})
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              Current Total Debt: TZS {selectedFarmer.totalDebt.toLocaleString()}
            </p>
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Assign Loans (Enter Quantities)</h3>

          <div className="space-y-3 mb-6">
            {loans.map((loan) => {
              const lq = loanQuantities.find((l) => l.loanId === loan.id);
              const amount = lq ? loan.price * lq.quantity : 0;

              return (
                <div key={loan.id} className="grid grid-cols-3 gap-4 items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="col-span-2">
                    <p className="font-medium text-gray-900 dark:text-white">{loan.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      TZS {loan.price.toLocaleString()}/{loan.unit}
                    </p>
                  </div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      value={lq?.quantity || 0}
                      onChange={(e) => handleQuantityChange(loan.id, parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Qty"
                    />
                    {amount > 0 && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        = TZS {amount.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-400 mb-1">Total Loan Amount</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-300">TZS {calculateTotal().toLocaleString()}</p>
          </div>

          <button
            onClick={handleAssignLoans}
            disabled={calculateTotal() === 0}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            Assign Loans
          </button>
        </div>
      )}

      {/* Today's Assignments List */}
      {todayAssignments.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Today's Loan Assignments</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Farmer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Loan</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Quantity</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Remaining</th>
                </tr>
              </thead>
              <tbody>
                {todayAssignments.map((assignment) => {
                  const farmer = farmers.find((f) => f.id === assignment.farmerId);
                  const loan = loans.find((l) => l.id === assignment.loanId);
                  return (
                    <tr key={assignment.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {farmer?.firstName} {farmer?.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{loan?.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {assignment.quantity} {loan?.unit}(s)
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        TZS {assignment.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        TZS {assignment.remainingDebt.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
