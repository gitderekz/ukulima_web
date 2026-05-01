import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { farmersAPI, cropsAPI, gradesAPI, pricesAPI, purchasesAPI, locationsAPI, authAPI } from '../../services/api';
import type { Farmer, Crop, Grade, FarmerLoan } from '../types';
import { Search, Plus, Trash2, Edit, Printer, X } from 'lucide-react';
import { toast } from 'sonner';
import { log } from 'node:console';
import { formatLocation } from '../components/ui/utils';

interface BaleForm {
  baleTag: string;
  mass: string;
  priceId: string;
  price: number;
  cropId: string;
  gradeId: string;
}

interface AccumulatedBale extends BaleForm {
  id: string;
  totalAmount: number;
}

export default function Buying() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [farmerSearch, setFarmerSearch] = useState('');
  const [farmerResults, setFarmerResults] = useState<Farmer[]>([]);

  const [priceSearch, setPriceSearch] = useState('');
  const [priceResults, setPriceResults] = useState<any[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [activeLoan, setActiveLoan] = useState<FarmerLoan | null>(null);
  const [loanDeduction, setLoanDeduction] = useState<number>(0);
  const [deductionPercentage, setDeductionPercentage] = useState<number>(70);

  const [baleForm, setBaleForm] = useState<BaleForm>({
    baleTag: '',
    mass: '',
    priceId: '',
    price: 0,
    cropId: '',
    gradeId: '',
  });

  const [accumulatedBales, setAccumulatedBales] = useState<AccumulatedBale[]>([]);
  const [editingBaleId, setEditingBaleId] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings =
          localStorage.getItem("app_settings");

        if (savedSettings) {
          const parsed =
            JSON.parse(savedSettings);

          setDeductionPercentage(
            parsed.deductionPercentage || 70
          );
        }

      } catch (error) {
        console.error(
          "Failed to load settings",
          error
        );
      }
    };

    loadSettings();

  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cropsRes, gradesRes] = await Promise.all([cropsAPI.getAll(), gradesAPI.getAll()]);
      if (cropsRes.success && cropsRes.data) setCrops(cropsRes.data);
      if (gradesRes.success && gradesRes.data) setGrades(gradesRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const searchFarmer = async (query: string) => {
    setFarmerSearch(query);
    if (query.length < 2) {
      setFarmerResults([]);
      return;
    }
    try {
      const response = await farmersAPI.search(query, user?.locationId);
      if (response.success && response.data) {
        setFarmerResults(response.data);
      }
    } catch (error) {
      toast.error('Failed to search farmers');
    }
  };

  const selectFarmer = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    /* Find active loan */
    const loan =
      farmer.FarmerLoans?.find(
        (l) => l.remainingDebt > 0
      ) || null;
      console.log('DEBT: ',loan);
      

    setActiveLoan(loan);
    setFarmerSearch(`${farmer.firstName} ${farmer.lastName} (${farmer.code})`);
    setFarmerResults([]);
  };

  const searchPrice = async (query: string) => {
    setPriceSearch(query);
    if (query.length < 1) {
      setPriceResults([]);
      return;
    }
    try {
      const response = await pricesAPI.getAll();
      if (response.success && response.data) {
        const filtered = response.data.filter((p: any) =>
          p.Crop?.name?.toLowerCase().includes(query.toLowerCase()) ||
          p.Grade?.name?.toLowerCase().includes(query.toLowerCase())
        );
        setPriceResults(filtered);
      }
    } catch (error) {
      toast.error('Failed to search prices');
    }
  };

  const selectPrice = (price: any) => {
    const crop = crops.find((c) => c.id === price.cropId);
    const grade = grades.find((g) => g.id === price.gradeId);

    setBaleForm({
      ...baleForm,
      priceId: price.id,
      price: price.price,
      cropId: price.cropId,
      gradeId: price.gradeId,
    });
    setPriceSearch(`${crop?.name} - ${grade?.name} (TZS ${price.price}/kg)`);
    setPriceResults([]);
  };

  const handleNextBale = async () => {
    if (!selectedFarmer) {
      toast.error('Please select a farmer');
      return;
    }

    if (!baleForm.baleTag || !baleForm.mass || !baleForm.priceId) {
      toast.error('Please fill all fields');
      return;
    }

    const mass = parseFloat(baleForm.mass);
    if (isNaN(mass) || mass <= 0) {
      toast.error('Invalid mass value');
      return;
    }

    // Check if bale tag is unique
    const existingTag = accumulatedBales.find((b) => b.baleTag === baleForm.baleTag);
    if (existingTag && !editingBaleId) {
      toast.error('Bale tag must be unique');
      return;
    }

    const totalAmount = mass * baleForm.price;

    if (editingBaleId) {
      // Update existing bale (local state - no API call needed yet)
      setAccumulatedBales(
        accumulatedBales.map((b) =>
          b.id === editingBaleId
            ? { ...baleForm, id: b.id, totalAmount }
            : b
        )
      );
      toast.success('Bale updated');
      setEditingBaleId(null);
    } else {
      // Add new bale (local state - no API call needed yet)
      const newBale: AccumulatedBale = {
        ...baleForm,
        id: `temp-${Date.now()}`,
        totalAmount,
      };

      setAccumulatedBales([...accumulatedBales, newBale]);
      toast.success('Bale added');
    }

    // Clear form
    setBaleForm({
      baleTag: '',
      mass: '',
      priceId: baleForm.priceId,
      price: baleForm.price,
      cropId: baleForm.cropId,
      gradeId: baleForm.gradeId,
    });
  };

  const editBale = (bale: AccumulatedBale) => {
    setBaleForm({
      baleTag: bale.baleTag,
      mass: bale.mass,
      priceId: bale.priceId,
      price: bale.price,
      cropId: bale.cropId,
      gradeId: bale.gradeId,
    });
    setEditingBaleId(bale.id);
    const crop = crops.find((c) => c.id === bale.cropId);
    const grade = grades.find((g) => g.id === bale.gradeId);
    setPriceSearch(`${crop?.name} - ${grade?.name} (TZS ${bale.price}/kg)`);
  };

  const deleteBale = (id: string) => {
    setAccumulatedBales(accumulatedBales.filter((b) => b.id !== id));
    toast.success('Bale removed');
  };

  const calculateTotal = () => {
    return accumulatedBales.reduce((sum, b) => sum + b.totalAmount, 0);
  };

  

  useEffect(() => {
    if (!activeLoan) {
      setLoanDeduction(0);
      return;
    }

    const totalAmount = calculateTotal();

    const deduction = (totalAmount * deductionPercentage) / 100;

    const finalDeduction = Math.min(
      deduction,
      activeLoan.remainingDebt
    );

    setLoanDeduction(finalDeduction);

  }, [
    accumulatedBales,
    deductionPercentage,
    activeLoan,
  ]);

  const handlePrintReceipt = async () => {
    if (!selectedFarmer || accumulatedBales.length === 0) {
      toast.error('No bales to process');
      return;
    }

    setLoading(true);
    try {
      const totalAmount = calculateTotal();
      const totalMass = accumulatedBales.reduce((sum, b) => sum + parseFloat(b.mass), 0);

      // Create purchase
      const receiptNumber = `RCP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      
      // const purchaseData = {
      //   farmerId: selectedFarmer.id,
      //   buyerId: user?.id || '',
      //   warehouseId: user?.warehouseId || '',
      //   purchaseDate: new Date().toISOString(),
      //   totalAmount: totalAmount,
      //   numberOfBales: accumulatedBales.length,
      //   totalMass: totalMass,
      //   status: 'completed',
      // };
      console.log('Loans: ',selectedFarmer.FarmerLoans);
      
      const purchaseData = {
        farmerId: selectedFarmer.id,
        buyerId: user?.id || '',
        warehouseId: user?.warehouseId || null,
        purchaseDate: new Date().toISOString(),
        totalAmount: totalAmount,
        numberOfBales: accumulatedBales.length,
        totalMass: totalMass,
        loanDeducted: loanDeduction,
        farmerLoanId: activeLoan?.id || null, // if exists
        status: 'completed',
        receiptNumber: receiptNumber,
        clerkId: user?.id || null,
        amountPaid:totalAmount - loanDeduction,

        bales: accumulatedBales.map((b) => ({
          baleTag: b.baleTag,
          cropId: b.cropId,
          gradeId: b.gradeId,
          mass: parseFloat(b.mass),
          price: b.price,
          totalAmount: b.totalAmount,
        })),
      };

      const response = await purchasesAPI.create(purchaseData);
      
      if (response.success && response.data) {
        toast.success('Purchase created successfully');
        const fm = selectedFarmer;
        
        setReceiptData({
          ...response.data,
          farmer:selectedFarmer,
          buyer:user,
          bales:accumulatedBales,
          receiptNumber,
          totalMass,
          totalDebt:activeLoan?.totalAmount??0,
          remainingDebt:activeLoan?.remainingDebt??0,
        });
        console.log('selectedFarmer: ',fm);
        console.log('totalDebt: ',activeLoan?.totalAmount??0);
        console.log('remainingDebt: ',activeLoan?.remainingDebt??0);
        
        
        // Reset form
        setAccumulatedBales([]);
        setSelectedFarmer(null);
        setFarmerSearch('');
        setPriceSearch('');
        setBaleForm({
          baleTag: '',
          mass: '',
          priceId: '',
          price: 0,
          cropId: '',
          gradeId: '',
        });

        setShowReceipt(true);
      } else {
        toast.error(response.message || 'Failed to create purchase');
      }
    } catch (error) {
      toast.error('Error creating purchase');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReceipt = async () => {
    setReceiptData({
      receiptNumber,
      farmer: selectedFarmer,
      buyer: user,
      bales: accumulatedBales,
      totalMass,
      totalAmount,
      totalDebt,
      loanDeducted,
      amountPaid,
      remainingDebt: totalDebt - loanDeducted,
      date: new Date().toLocaleString(),
    });

    setShowReceipt(true);
    toast.success('Purchase completed successfully');
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setSelectedFarmer(null);
    setFarmerSearch('');
    setAccumulatedBales([]);
    setPriceSearch('');
    setBaleForm({
      baleTag: '',
      mass: '',
      priceId: '',
      price: 0,
      cropId: '',
      gradeId: '',
    });
  };

  // Receipt Modal
  const ReceiptModal = ({ data }: { data: any }) => (
    <div className="receipt-modal">
      <h3>Receipt</h3>
    </div>
  );

  const [locationInfo, setLocationInfo] = useState({ zone: '', cpp: '' });

  const getLocationPath1 = async () => {
    console.log('BUYER LOCATION:',user);
    
    try {
      const res = await locationsAPI.getById(user?.locationId);
      if (res.success && res.data) {
        console.log('Location data:', res.data);
        return {
          zone: res.data.zone || '',
          cpp: res.data.cpp || '',
        };
      }
    } catch (err) {
      console.error('Failed to load location', err);
    }

    return { zone: '', cpp: '' };
  };

  const getLocationPath = async () => {
    const res = await locationsAPI.getPath(user?.locationId);

    if (res.success) {
      return res.data;
    }

    return { zone: '', cpp: '' };
  };

  // // useEffect(() => {
  // //   if (user) {
  // //     getLocationPath().then(setLocationInfo);
  // //   }
  // // }, [user]);
  // useEffect(() => {
  //   if (user?.locationId) {
  //     getLocationPath().then((res) => {
  //       setLocationInfo(formatLocation(res));
  //     });
  //   }
  // }, [user]);
  useEffect(() => {
    if (user?.locationId) {
      getLocationPath().then((data) => {
        setLocationInfo({
          zone: data.zone || '',
          cpp: data.cpp || '',
        });
      });
    }
  }, [user]);

  if (showReceipt && receiptData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Purchase Receipt</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{receiptData.receiptNumber}</p>
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
                <p className="font-semibold text-gray-900 dark:text-white">{receiptData.purchaseDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Buyer</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {receiptData.buyer?.firstName} {receiptData.buyer?.lastName} ({receiptData.buyer?.code})
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
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Bales Purchased</p>
              <div className="space-y-2">
                {receiptData.bales.map((bale: AccumulatedBale) => {
                  const crop = crops.find((c) => c.id === bale.cropId);
                  const grade = grades.find((g) => g.id === bale.gradeId);
                  return (
                    <div key={bale.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{bale.baleTag}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {crop?.name} - {grade?.name} | {bale.mass} kg @ TZS {bale.price}/kg
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">TZS {bale.totalAmount.toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Mass</span>
                <span className="font-semibold text-gray-900 dark:text-white">{receiptData.totalMass} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                <span className="font-semibold text-gray-900 dark:text-white">TZS {receiptData.totalAmount.toLocaleString()}</span>
              </div>

              {/* {activeLoan && (
                <div className="mt-2 space-y-1">

                  <div className="flex justify-between">
                    <span>Remaining Debt</span>
                    <span>
                      TZS {activeLoan.remainingDebt.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Deduction ({deductionPercentage}%)</span>
                    <span>
                      TZS {loanDeduction.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between font-semibold">
                    <span>Amount To Pay</span>
                    <span>
                      TZS {(calculateTotal() - loanDeduction).toLocaleString()}
                    </span>
                  </div>

                </div>
              )} */}

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Debt</span>
                <span className="font-semibold text-red-600 dark:text-red-400">TZS {receiptData.totalDebt.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Loan Deducted ({deductionPercentage}%)</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">TZS {receiptData.loanDeducted.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Remaining Debt</span>
                <span className="font-semibold text-red-600 dark:text-red-400">TZS {receiptData.remainingDebt.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="font-bold text-gray-900 dark:text-white">Amount Paid to Farmer</span>
                <span className="font-bold text-green-600 dark:text-green-400">TZS {receiptData.amountPaid.toLocaleString()}</span>
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('buyingForm')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Capture farmer bales and generate receipts</p>
      </div>

      {/* Auto-filled Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">Buyer Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-blue-700 dark:text-blue-400">Zone</p>
            <p className="font-semibold text-blue-900 dark:text-blue-200">{locationInfo.zone}</p>
          </div>
          <div>
            <p className="text-blue-700 dark:text-blue-400">CPP</p>
            <p className="font-semibold text-blue-900 dark:text-blue-200">{locationInfo.cpp}</p>
          </div>
          <div>
            <p className="text-blue-700 dark:text-blue-400">Buyer Name</p>
            <p className="font-semibold text-blue-900 dark:text-blue-200">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
          <div>
            <p className="text-blue-700 dark:text-blue-400">Buyer Code</p>
            <p className="font-semibold text-blue-900 dark:text-blue-200">{user?.code}</p>
          </div>
        </div>
      </div>

      {/* Buying Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        {/* Farmer Selection */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('farmerDetails')}</h3>
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">{farmer.code}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Crop/Grade Selection */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('cropDetails')}</h3>
          <div className="relative mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={priceSearch}
                onChange={(e) => searchPrice(e.target.value)}
                placeholder="Search crop and grade..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            {priceResults.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {priceResults.map((price) => {
                  const crop = crops.find((c) => c.id === price.cropId);
                  const grade = grades.find((g) => g.id === price.gradeId);
                  return (
                    <button
                      key={price.id}
                      onClick={() => selectPrice(price)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <p className="font-medium text-gray-900 dark:text-white">
                        {crop?.name} - {grade?.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">TZS {price.price}/kg</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('baleTag')}
              </label>
              <input
                type="text"
                value={baleForm.baleTag}
                onChange={(e) => setBaleForm({ ...baleForm, baleTag: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="BL-2026-0001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('mass')}
              </label>
              <input
                type="number"
                step="0.01"
                value={baleForm.mass}
                onChange={(e) => setBaleForm({ ...baleForm, mass: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="50.00"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        {baleForm.mass && baleForm.price > 0 && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-400 mb-1">Bale Amount</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-300">
              TZS {(parseFloat(baleForm.mass) * baleForm.price).toLocaleString()}
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleNextBale}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {editingBaleId ? 'Update Bale' : t('nextBale')}
        </button>
      </div>

      {/* Accumulated Bales */}
      {accumulatedBales.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Accumulated Bales</h3>
          <div className="space-y-2 mb-6">
            {accumulatedBales.map((bale) => {
              const crop = crops.find((c) => c.id === bale.cropId);
              const grade = grades.find((g) => g.id === bale.gradeId);
              return (
                <div
                  key={bale.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{bale.baleTag}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {crop?.name} - {grade?.name} | {bale.mass} kg @ TZS {bale.price}/kg
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-gray-900 dark:text-white">TZS {bale.totalAmount.toLocaleString()}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editBale(bale)}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => deleteBale(bale.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount</span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                TZS {calculateTotal().toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={handlePrintReceipt}
            disabled={!selectedFarmer}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="w-5 h-5" />
            {t('printReceipt')}
          </button>
        </div>
      )}
    </div>
  );
}

// import React, { useEffect, useState } from 'react';
// // import { toast } from 'react-toastify';
// // import purchasesAPI from '@/api/purchasesAPI';
// // import farmersAPI from '@/api/farmersAPI';
// // import { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useAuthStore } from '../store/authStore';
// import { farmersAPI, cropsAPI, gradesAPI, pricesAPI, purchasesAPI, locationsAPI } from '../../services/api';
// import type { Farmer, Crop, Grade, FarmerLoan } from '../types';
// import { Search, Plus, Trash2, Edit, Printer, X } from 'lucide-react';
// import { toast } from 'sonner';
// import { log } from 'node:console';
// import { formatLocation } from '../components/ui/utils';

// interface FarmerLoan {
//   id: string;
//   remainingDebt: number;
// }

// interface Farmer {
//   id: string;
//   firstName: string;
//   lastName: string;
//   code: string;
//   FarmerLoans?: FarmerLoan[];
// }

// interface Bale {
//   baleTag: string;
//   mass: string;
//   priceId: string;
//   price: number;
//   cropId: string;
//   gradeId: string;
//   totalAmount: number;
// }

// interface User {
//   id: string;
//   warehouseId?: string;
// }

// const Buying: React.FC = () => {
//   const [user, setUser] = useState<User | null>(null);

//   const [farmerSearch, setFarmerSearch] = useState('');
//   const [farmerResults, setFarmerResults] = useState<Farmer[]>([]);
//   const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

//   const [activeLoan, setActiveLoan] = useState<FarmerLoan | null>(null);

//   const [accumulatedBales, setAccumulatedBales] = useState<Bale[]>([]);

//   const [baleForm, setBaleForm] = useState<Bale>({
//     baleTag: '',
//     mass: '',
//     priceId: '',
//     price: 0,
//     cropId: '',
//     gradeId: '',
//     totalAmount: 0,
//   });

//   const [loading, setLoading] = useState(false);
//   const [showReceipt, setShowReceipt] = useState(false);
//   const [receiptData, setReceiptData] = useState<any>(null);

//   // ==========================
//   // SEARCH FARMERS
//   // ==========================

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (farmerSearch.length >= 2) {
//         searchFarmers(farmerSearch);
//       }
//     }, 400);

//     return () => clearTimeout(delayDebounce);
//   }, [farmerSearch]);

//   const searchFarmers = async (query: string) => {
//     try {
//       const response = await farmersAPI.search(query);

//       if (response.success) {
//         setFarmerResults(response.data);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // ==========================
//   // SELECT FARMER
//   // ==========================

//   const selectFarmer = (farmer: Farmer) => {
//     setSelectedFarmer(farmer);

//     const loan =
//       farmer.FarmerLoans?.find(
//         (l: FarmerLoan) => l.remainingDebt > 0
//       ) || null;

//     setActiveLoan(loan);

//     setFarmerSearch(
//       `${farmer.firstName} ${farmer.lastName} (${farmer.code})`
//     );

//     setFarmerResults([]);
//   };

//   // ==========================
//   // ADD BALE
//   // ==========================

//   const addBale = () => {
//     if (!baleForm.baleTag || !baleForm.mass) {
//       toast.error('Enter bale details');
//       return;
//     }

//     const totalAmount =
//       parseFloat(baleForm.mass) * baleForm.price;

//     const newBale: Bale = {
//       ...baleForm,
//       totalAmount,
//     };

//     setAccumulatedBales((prev) => [
//       ...prev,
//       newBale,
//     ]);

//     setBaleForm({
//       baleTag: '',
//       mass: '',
//       priceId: '',
//       price: 0,
//       cropId: '',
//       gradeId: '',
//       totalAmount: 0,
//     });
//   };

//   // ==========================
//   // CALCULATIONS
//   // ==========================

//   const calculateTotal = () => {
//     return accumulatedBales.reduce(
//       (sum, b) => sum + b.totalAmount,
//       0
//     );
//   };

//   const calculateTotalMass = () => {
//     return accumulatedBales.reduce(
//       (sum, b) => sum + parseFloat(b.mass),
//       0
//     );
//   };

//   const calculateLoanDeduction = (
//     totalAmount: number
//   ) => {
//     if (!activeLoan) return 0;

//     return Math.min(
//       activeLoan.remainingDebt,
//       totalAmount
//     );
//   };

//   // ==========================
//   // PRINT RECEIPT / CREATE PURCHASE
//   // ==========================

//   const handlePrintReceipt = async () => {
//     if (!selectedFarmer || accumulatedBales.length === 0) {
//       toast.error('No bales to process');
//       return;
//     }

//     setLoading(true);

//     try {
//       const totalAmount = calculateTotal();

//       const totalMass = calculateTotalMass();

//       const loanDeducted =
//         calculateLoanDeduction(
//           totalAmount
//         );

//       const amountPaid =
//         totalAmount - loanDeducted;

//       const totalDebt =
//         activeLoan?.remainingDebt || 0;

//       const remainingDebt =
//         totalDebt - loanDeducted;

//       const receiptNumber = `RCP-${new Date().getFullYear()}-${String(
//         Math.floor(Math.random() * 10000)
//       ).padStart(4, '0')}`;

//       const purchaseData = {
//         farmerId: selectedFarmer.id,
//         buyerId: user?.id || '',
//         warehouseId: user?.warehouseId || null,
//         purchaseDate: new Date().toISOString(),
//         totalAmount,
//         numberOfBales: accumulatedBales.length,
//         totalMass,
//         loanDeducted,
//         farmerLoanId: activeLoan?.id || null,
//         status: 'completed',
//         bales: accumulatedBales.map((b) => ({
//           baleTag: b.baleTag,
//           cropId: b.cropId,
//           gradeId: b.gradeId,
//           mass: parseFloat(b.mass),
//           price: b.price,
//           totalAmount: b.totalAmount,
//         })),
//       };

//       const response =
//         await purchasesAPI.create(
//           purchaseData
//         );

//       if (response.success && response.data) {
//         toast.success(
//           'Purchase created successfully'
//         );

//         setReceiptData({
//           receiptNumber,
//           farmer: selectedFarmer,
//           buyer: user,
//           bales: accumulatedBales,
//           totalMass,
//           totalAmount,
//           totalDebt,
//           loanDeducted,
//           amountPaid,
//           remainingDebt,
//           date: new Date().toLocaleString(),
//         });

//         setShowReceipt(true);

//         // RESET
//         setAccumulatedBales([]);
//         setSelectedFarmer(null);
//         setFarmerSearch('');

//         setBaleForm({
//           baleTag: '',
//           mass: '',
//           priceId: '',
//           price: 0,
//           cropId: '',
//           gradeId: '',
//           totalAmount: 0,
//         });
//       } else {
//         toast.error(
//           response.message ||
//             'Failed to create purchase'
//         );
//       }
//     } catch (error) {
//       console.error(error);

//       toast.error(
//         'Error creating purchase'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================
//   // UI (Simplified)
//   // ==========================

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">
//         Buying
//       </h1>

//       <input
//         type="text"
//         placeholder="Search farmer"
//         value={farmerSearch}
//         onChange={(e) =>
//           setFarmerSearch(e.target.value)
//         }
//         className="border p-2 w-full"
//       />

//       {farmerResults.length > 0 && (
//         <div className="border mt-2">
//           {farmerResults.map((f) => (
//             <div
//               key={f.id}
//               className="p-2 cursor-pointer hover:bg-gray-100"
//               onClick={() =>
//                 selectFarmer(f)
//               }
//             >
//               {f.firstName} {f.lastName} ({f.code})
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="mt-4">
//         <button
//           onClick={addBale}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Add Bale
//         </button>

//         <button
//           onClick={handlePrintReceipt}
//           disabled={loading}
//           className="bg-green-600 text-white px-4 py-2 rounded ml-2"
//         >
//           {loading
//             ? 'Processing...'
//             : 'Print Receipt'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Buying;
