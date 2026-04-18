import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { reportsAPI, farmersAPI, gradesAPI, cropsAPI, usersAPI } from '../../services/api';
import type { Farmer, Crop, Grade, User } from '../types';
import { FileText, Download, Filter, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

type ReportType =
  | 'buying-general'
  | 'buying-farmer'
  | 'buying-grade'
  | 'rebale-general'
  | 'rebale-grade'
  | 'transport-general'
  | 'transport-driver'
  | 'transport-grade'
  | 'loan-deduction-general'
  | 'loan-deduction-farmer';

export default function Reports() {
  const { t } = useTranslation();

  const [reportType, setReportType] = useState<ReportType>('buying-general');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFarmer, setSelectedFarmer] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');

  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState<'excel' | 'csv' | 'pdf'>('excel');

  useEffect(() => {
    loadMasterData();
  }, []);

  const loadMasterData = async () => {
    try {
      const [farmersRes, gradesRes, cropsRes, usersRes] = await Promise.all([
        farmersAPI.getAll(),
        gradesAPI.getAll(),
        cropsAPI.getAll(),
        usersAPI.getAll(),
      ]);
      
      if (farmersRes.success && farmersRes.data) setFarmers(farmersRes.data);
      if (gradesRes.success && gradesRes.data) setGrades(gradesRes.data);
      if (cropsRes.success && cropsRes.data) setCrops(cropsRes.data);
      if (usersRes.success && usersRes.data) setUsers(usersRes.data);
    } catch (error) {
      toast.error('Failed to load report data');
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      let data: any[] = [];

      switch (reportType) {
        case 'buying-general':
          data = await generateBuyingGeneralReport();
          break;
        case 'buying-farmer':
          data = await generateBuyingFarmerReport();
          break;
        case 'buying-grade':
          data = await generateBuyingGradeReport();
          break;
        case 'rebale-general':
          data = await generateRebaleGeneralReport();
          break;
        case 'rebale-grade':
          data = await generateRebaleGradeReport();
          break;
        case 'transport-general':
          data = await generateTransportGeneralReport();
          break;
        case 'transport-driver':
          data = await generateTransportDriverReport();
          break;
        case 'transport-grade':
          data = await generateTransportGradeReport();
          break;
        case 'loan-deduction-general':
          data = await generateLoanDeductionGeneralReport();
          break;
        case 'loan-deduction-farmer':
          data = await generateLoanDeductionFarmerReport();
          break;
      }

      setReportData(data);
      toast.success('Report generated successfully');

      // Auto-export based on selected format
      if (data.length > 0) {
        setTimeout(() => {
          if (exportFormat === 'excel') {
            exportToExcel();
          } else if (exportFormat === 'csv') {
            exportToCSV();
          } else if (exportFormat === 'pdf') {
            exportToPDF();
          }
        }, 500);
      }
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const generateBuyingGeneralReport = async () => {
    try {
      const response = await reportsAPI.getPurchaseReport(startDate, endDate);
      if (response.success && response.data) {
        return response.data.map((p: any) => {
          const farmer = farmers.find((f: any) => f.id === p.farmerId);
          const buyer = users.find((u: any) => u.id === p.buyerId);
          return {
            'Receipt No': p.id.substring(0, 10),
            Date: p.purchaseDate,
            Farmer: farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown',
            'Farmer Code': farmer?.code,
            Buyer: buyer ? `${buyer.firstName} ${buyer.lastName}` : 'Unknown',
            'Total Mass (kg)': p.totalWeight || 0,
            'Total Amount (TZS)': p.totalCost || 0,
          };
        });
      }
    } catch (error) {
      toast.error('Failed to generate report');
    }
    return [];
  };

  const generateBuyingFarmerReport = async () => {
    if (!selectedFarmer) {
      toast.error('Please select a farmer');
      return [];
    }

    try {
      const response = await purchasesAPI.getByFarmerId(selectedFarmer);
      if (response.success && response.data) {
        const farmer = farmers.find((f: any) => f.id === selectedFarmer);
        return response.data.map((p: any) => {
          const buyer = users.find((u: any) => u.id === p.buyerId);
          return {
            'Receipt No': p.id.substring(0, 10),
            Date: p.purchaseDate,
            Farmer: `${farmer?.firstName} ${farmer?.lastName}`,
            Buyer: buyer ? `${buyer.firstName} ${buyer.lastName}` : 'Unknown',
            'Total Mass (kg)': p.totalWeight || 0,
            'Total Amount (TZS)': p.totalCost || 0,
          };
        });
      }
    } catch (error) {
      toast.error('Failed to generate report');
    }
    return [];
  };

  const generateBuyingGradeReport = async () => {
    if (!selectedGrade) {
      toast.error('Please select a grade');
      return [];
    }

    try {
      const response = await purchasesAPI.getAll();
      if (response.success && response.data) {
        const grade = grades.find((g: any) => g.id === selectedGrade);
        return response.data.map((p: any) => {
          const farmer = farmers.find((f: any) => f.id === p.farmerId);
          return {
            Date: p.purchaseDate,
            Farmer: farmer ? `${farmer.firstName} ${farmer.lastName}` : '-',
            Grade: grade?.name,
            'Total Mass (kg)': p.totalWeight || 0,
            'Total Amount (TZS)': p.totalCost || 0,
          };
        });
      }
    } catch (error) {
      toast.error('Failed to generate report');
    }
    return [];
  };

  const generateRebaleGeneralReport = async () => {
    try {
      const response = await rebalesAPI.getAll();
      if (response.success && response.data) {
        return response.data.map((r: any) => {
          const crop = crops.find((c: any) => c.id === r.cropId);
          const grade = grades.find((g: any) => g.id === r.gradeId);

          return {
            'Rebale Tag': r.rebaleTag,
            Date: r.createdAt?.split('T')[0],
            'Crop': crop?.name,
            'Grade': grade?.name,
            'Total Mass (kg)': r.mass,
            'Status': r.status,
          };
        });
      }
    } catch (error) {
      toast.error('Failed to generate report');
    }
    return [];
  };

  const generateRebaleGradeReport = async () => {
    if (!selectedGrade) {
      toast.error('Please select a grade');
      return [];
    }

    try {
      const response = await rebalesAPI.getAll();
      if (response.success && response.data) {
        const grade = grades.find((g: any) => g.id === selectedGrade);
        const filtered = response.data.filter((r: any) => r.gradeId === selectedGrade);

        return filtered.map((r: any) => {
          const crop = crops.find((c: any) => c.id === r.cropId);

          return {
            'Rebale Tag': r.rebaleTag,
            Date: r.createdAt?.split('T')[0],
            Crop: crop?.name,
            Grade: grade?.name,
            'Total Mass (kg)': r.mass,
            'Status': r.status,
          };
        });
      }
    } catch (error) {
      toast.error('Failed to generate report');
    }
    return [];
  };

  const generateTransportFarmerReport = async () => {
    if (!selectedFarmer) {
      toast.error('Please select farmer');
      return [];
    }

    try {
      const response = await purchasesAPI.getAll();
      if (response.success && response.data) {
        const filtered = response.data.filter((t: any) => t.farmerId === selectedFarmer);
        return filtered.map((t: any) => {
          const buyer = users.find((u: any) => u.id === t.buyerId);
          return {
            'Receipt No': t.receiptNumber || t.id,
            Date: t.transportDate || t.createdAt,
            'Driver Name': t.driverName || '-',
            'Driver Phone': t.driverPhone || '-',
            'Truck Plate': t.truckPlate || '-',
            'Total Mass (kg)': t.totalMass || 0,
            'Total Amount (TZS)': t.totalAmount || 0,
            'Processed By': `${buyer?.firstName} ${buyer?.lastName}`,
          };
        });
      }
    } catch (error) {
      toast.error('Failed to generate report');
    }
    return [];
  };

  const generateTransportGeneralReport = async () => {
    try {
      const response = await transportsAPI.getAll();
      if (response.success && response.data) {
        return response.data.map((t: any) => ({
          Date: t.createdAt?.split('T')[0],
          'Driver Name': t.driverName,
          'Truck Plate': t.truckPlate,
          'Total Amount (TZS)': t.totalAmount || 0,
          Status: t.status,
        }));
      }
    } catch (error) {
      toast.error('Failed to generate report');
    }
    return [];
  };

  const generateTransportDriverReport = async () => {
    if (!selectedDriver) {
      toast.error('Please enter driver name');
      return [];
    }

    try {
      const response = await transportsAPI.getAll();
      if (response.success && response.data) {
        const filtered = response.data.filter((t: any) =>
          t.driverName?.toLowerCase().includes(selectedDriver.toLowerCase())
        );

        return filtered.map((t: any) => ({
          Date: t.createdAt?.split('T')[0],
          'Driver Name': t.driverName,
          'Driver Phone': t.driverPhone,
          'Truck Plate': t.truckPlate,
          'Total Amount (TZS)': t.totalAmount || 0,
        }));
      }
    } catch (error) {
      toast.error('Failed to generate report');
    }
    return [];
  };

  const generateTransportGradeReport = async () => {
    if (!selectedGrade) {
      toast.error('Please select a grade');
      return [];
    }

    try {
      const [transportsRes, rebalesRes] = await Promise.all([
        transportsAPI.getAll(),
        rebalesAPI.getAll(),
      ]);

      if (transportsRes.success && rebalesRes.success) {
        const grade = grades.find((g: any) => g.id === selectedGrade);

        return (rebalesRes.data || [])
          .filter((r: any) => r.gradeId === selectedGrade)
          .map((r: any) => ({
            'Rebale Tag': r.rebaleTag,
            Date: r.createdAt?.split('T')[0],
            Grade: grade?.name,
            'Total Mass (kg)': r.mass,
            Status: r.status,
          }));
      }
    } catch (error) {
      toast.error('Failed to generate report');
    }
    return [];
  };

  const generateLoanDeductionGeneralReport = async () => {
    try {
      const response = await reportsAPI.getLoanReport();
      if (response.success && response.data) {
        return response.data.map((item: any) => ({
          Date: item.createdAt?.split('T')[0],
          Farmer: item.farmerName || '-',
          'Loan Amount (TZS)': item.loanAmount || 0,
          Status: item.status,
        }));
      }
    } catch (error) {
      toast.error('Failed to generate report');
    }
    return [];
  };

  const generateLoanDeductionFarmerReport = async () => {
    if (!selectedFarmer) {
      toast.error('Please select a farmer');
      return [];
    }

    try {
      const response = await loansAPI.getByFarmerId(selectedFarmer);
      if (response.success && response.data) {
        const farmer = farmers.find((f: any) => f.id === selectedFarmer);

        return response.data.map((l: any) => ({
          Date: l.createdAt?.split('T')[0],
          Farmer: `${farmer?.firstName} ${farmer?.lastName}`,
          'Loan Amount (TZS)': l.loanAmount || 0,
          Status: l.status,
        }));
      }
    } catch (error) {
      toast.error('Failed to generate report');
    }
    return [];
  };

  const exportToExcel = () => {
    if (reportData.length === 0) {
      toast.error('No data to export');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    const fileName = `${reportType}_${startDate}_to_${endDate}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success('Exported to Excel');
  };

  const exportToCSV = () => {
    if (reportData.length === 0) {
      toast.error('No data to export');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_${startDate}_to_${endDate}.csv`;
    a.click();
    toast.success('Exported to CSV');
  };

  const exportToPDF = () => {
    if (reportData.length === 0) {
      toast.error('No data to export');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${reportType.toUpperCase()} Report`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Period: ${startDate} to ${endDate}`, 14, 30);

    let yPos = 40;
    const pageHeight = doc.internal.pageSize.height;

    // Headers
    const headers = Object.keys(reportData[0]);
    doc.setFontSize(9);
    headers.forEach((header, index) => {
      doc.text(header, 14 + index * 35, yPos);
    });

    yPos += 5;

    // Data rows
    reportData.forEach((row) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }

      headers.forEach((header, index) => {
        const value = String(row[header] || '-');
        doc.text(value.substring(0, 15), 14 + index * 35, yPos);
      });

      yPos += 7;
    });

    doc.save(`${reportType}_${startDate}_to_${endDate}.pdf`);
    toast.success('Exported to PDF');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('reports')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Generate and export system reports</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Report Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <optgroup label="Buying Reports">
                <option value="buying-general">Buying - General</option>
                <option value="buying-farmer">Buying - By Farmer</option>
                <option value="buying-grade">Buying - By Grade</option>
              </optgroup>
              <optgroup label="Rebale Reports">
                <option value="rebale-general">Rebale - General</option>
                <option value="rebale-grade">Rebale - By Grade</option>
              </optgroup>
              <optgroup label="Transport Reports">
                <option value="transport-general">Transport - General</option>
                <option value="transport-driver">Transport - By Driver</option>
                <option value="transport-grade">Transport - By Grade</option>
              </optgroup>
              <optgroup label="Loan Reports">
                <option value="loan-deduction-general">Loan Deduction - General</option>
                <option value="loan-deduction-farmer">Loan Deduction - By Farmer</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {(reportType === 'buying-farmer' || reportType === 'loan-deduction-farmer') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Farmer</label>
              <select
                value={selectedFarmer}
                onChange={(e) => setSelectedFarmer(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Select Farmer --</option>
                {farmers.map((farmer) => (
                  <option key={farmer.id} value={farmer.id}>
                    {farmer.firstName} {farmer.lastName} ({farmer.code})
                  </option>
                ))}
              </select>
            </div>
          )}

          {(reportType === 'buying-grade' || reportType === 'rebale-grade' || reportType === 'transport-grade') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Grade</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Select Grade --</option>
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    {grade.name} ({grade.code})
                  </option>
                ))}
              </select>
            </div>
          )}

          {reportType === 'transport-driver' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Driver Name</label>
              <input
                type="text"
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                placeholder="Enter driver name"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Export Format</label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'excel' | 'csv' | 'pdf')}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="excel">Excel (.xlsx)</option>
              <option value="csv">CSV (.csv)</option>
              <option value="pdf">PDF (.pdf)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-5 h-5" />
              {loading ? 'Generating...' : 'Generate & Export'}
            </button>
          </div>
        </div>
      </div>

      {/* Report Results */}
      {reportData.length > 0 && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Report Results ({reportData.length} records)</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    {Object.keys(reportData[0]).map((header) => (
                      <th key={header} className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      {Object.values(row).map((value: any, i) => (
                        <td key={i} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
