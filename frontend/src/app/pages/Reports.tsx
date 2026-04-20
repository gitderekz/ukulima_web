// // import { useState, useEffect } from 'react';
// // import { useTranslation } from 'react-i18next';
// // import { reportsAPI, farmersAPI, gradesAPI, cropsAPI, usersAPI } from '../../services/api';
// // import type { Farmer, Crop, Grade, User } from '../types';
// // import { FileText, Download, Filter, Calendar } from 'lucide-react';
// // import { toast } from 'sonner';
// // import * as XLSX from 'xlsx';
// // import jsPDF from 'jspdf';

// // type ReportType =
// //   | 'buying-general'
// //   | 'buying-farmer'
// //   | 'buying-grade'
// //   | 'rebale-general'
// //   | 'rebale-grade'
// //   | 'transport-general'
// //   | 'transport-driver'
// //   | 'transport-grade'
// //   | 'loan-deduction-general'
// //   | 'loan-deduction-farmer';

// // export default function Reports() {
// //   const { t } = useTranslation();

// //   const [reportType, setReportType] = useState<ReportType>('buying-general');
// //   const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
// //   const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
// //   const [selectedFarmer, setSelectedFarmer] = useState('');
// //   const [selectedGrade, setSelectedGrade] = useState('');
// //   const [selectedDriver, setSelectedDriver] = useState('');

// //   const [farmers, setFarmers] = useState<Farmer[]>([]);
// //   const [grades, setGrades] = useState<Grade[]>([]);
// //   const [crops, setCrops] = useState<Crop[]>([]);
// //   const [users, setUsers] = useState<User[]>([]);

// //   const [reportData, setReportData] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [exportFormat, setExportFormat] = useState<'excel' | 'csv' | 'pdf'>('excel');

// //   useEffect(() => {
// //     loadMasterData();
// //   }, []);

// //   const loadMasterData = async () => {
// //     try {
// //       const [farmersRes, gradesRes, cropsRes, usersRes] = await Promise.all([
// //         farmersAPI.getAll(),
// //         gradesAPI.getAll(),
// //         cropsAPI.getAll(),
// //         usersAPI.getAll(),
// //       ]);
      
// //       if (farmersRes.success && farmersRes.data) setFarmers(farmersRes.data);
// //       if (gradesRes.success && gradesRes.data) setGrades(gradesRes.data);
// //       if (cropsRes.success && cropsRes.data) setCrops(cropsRes.data);
// //       if (usersRes.success && usersRes.data) setUsers(usersRes.data);
// //     } catch (error) {
// //       toast.error('Failed to load report data');
// //     }
// //   };

// //   const generateReport = async () => {
// //     setLoading(true);
// //     try {
// //       let data: any[] = [];

// //       switch (reportType) {
// //         case 'buying-general':
// //           data = await generateBuyingGeneralReport();
// //           break;
// //         case 'buying-farmer':
// //           data = await generateBuyingFarmerReport();
// //           break;
// //         case 'buying-grade':
// //           data = await generateBuyingGradeReport();
// //           break;
// //         case 'rebale-general':
// //           data = await generateRebaleGeneralReport();
// //           break;
// //         case 'rebale-grade':
// //           data = await generateRebaleGradeReport();
// //           break;
// //         case 'transport-general':
// //           data = await generateTransportGeneralReport();
// //           break;
// //         case 'transport-driver':
// //           data = await generateTransportDriverReport();
// //           break;
// //         case 'transport-grade':
// //           data = await generateTransportGradeReport();
// //           break;
// //         case 'loan-deduction-general':
// //           data = await generateLoanDeductionGeneralReport();
// //           break;
// //         case 'loan-deduction-farmer':
// //           data = await generateLoanDeductionFarmerReport();
// //           break;
// //       }

// //       setReportData(data);
// //       toast.success('Report generated successfully');

// //       // Auto-export based on selected format
// //       if (data.length > 0) {
// //         setTimeout(() => {
// //           if (exportFormat === 'excel') {
// //             exportToExcel();
// //           } else if (exportFormat === 'csv') {
// //             exportToCSV();
// //           } else if (exportFormat === 'pdf') {
// //             exportToPDF();
// //           }
// //         }, 500);
// //       }
// //     } catch (error) {
// //       toast.error('Failed to generate report');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const generateBuyingGeneralReport = async () => {
// //     try {
// //       const response = await reportsAPI.getPurchaseReport(startDate, endDate);
// //       if (response.success && response.data) {
// //         return response.data.map((p: any) => {
// //           const farmer = farmers.find((f: any) => f.id === p.farmerId);
// //           const buyer = users.find((u: any) => u.id === p.buyerId);
// //           return {
// //             'Receipt No': p.id.substring(0, 10),
// //             Date: p.purchaseDate,
// //             Farmer: farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown',
// //             'Farmer Code': farmer?.code,
// //             Buyer: buyer ? `${buyer.firstName} ${buyer.lastName}` : 'Unknown',
// //             'Total Mass (kg)': p.totalWeight || 0,
// //             'Total Amount (TZS)': p.totalCost || 0,
// //           };
// //         });
// //       }
// //     } catch (error) {
// //       toast.error('Failed to generate report');
// //     }
// //     return [];
// //   };

// //   const generateBuyingFarmerReport = async () => {
// //     if (!selectedFarmer) {
// //       toast.error('Please select a farmer');
// //       return [];
// //     }

// //     try {
// //       const response = await purchasesAPI.getByFarmerId(selectedFarmer);
// //       if (response.success && response.data) {
// //         const farmer = farmers.find((f: any) => f.id === selectedFarmer);
// //         return response.data.map((p: any) => {
// //           const buyer = users.find((u: any) => u.id === p.buyerId);
// //           return {
// //             'Receipt No': p.id.substring(0, 10),
// //             Date: p.purchaseDate,
// //             Farmer: `${farmer?.firstName} ${farmer?.lastName}`,
// //             Buyer: buyer ? `${buyer.firstName} ${buyer.lastName}` : 'Unknown',
// //             'Total Mass (kg)': p.totalWeight || 0,
// //             'Total Amount (TZS)': p.totalCost || 0,
// //           };
// //         });
// //       }
// //     } catch (error) {
// //       toast.error('Failed to generate report');
// //     }
// //     return [];
// //   };

// //   const generateBuyingGradeReport = async () => {
// //     if (!selectedGrade) {
// //       toast.error('Please select a grade');
// //       return [];
// //     }

// //     try {
// //       const response = await purchasesAPI.getAll();
// //       if (response.success && response.data) {
// //         const grade = grades.find((g: any) => g.id === selectedGrade);
// //         return response.data.map((p: any) => {
// //           const farmer = farmers.find((f: any) => f.id === p.farmerId);
// //           return {
// //             Date: p.purchaseDate,
// //             Farmer: farmer ? `${farmer.firstName} ${farmer.lastName}` : '-',
// //             Grade: grade?.name,
// //             'Total Mass (kg)': p.totalWeight || 0,
// //             'Total Amount (TZS)': p.totalCost || 0,
// //           };
// //         });
// //       }
// //     } catch (error) {
// //       toast.error('Failed to generate report');
// //     }
// //     return [];
// //   };

// //   const generateRebaleGeneralReport = async () => {
// //     try {
// //       const response = await rebalesAPI.getAll();
// //       if (response.success && response.data) {
// //         return response.data.map((r: any) => {
// //           const crop = crops.find((c: any) => c.id === r.cropId);
// //           const grade = grades.find((g: any) => g.id === r.gradeId);

// //           return {
// //             'Rebale Tag': r.rebaleTag,
// //             Date: r.createdAt?.split('T')[0],
// //             'Crop': crop?.name,
// //             'Grade': grade?.name,
// //             'Total Mass (kg)': r.mass,
// //             'Status': r.status,
// //           };
// //         });
// //       }
// //     } catch (error) {
// //       toast.error('Failed to generate report');
// //     }
// //     return [];
// //   };

// //   const generateRebaleGradeReport = async () => {
// //     if (!selectedGrade) {
// //       toast.error('Please select a grade');
// //       return [];
// //     }

// //     try {
// //       const response = await rebalesAPI.getAll();
// //       if (response.success && response.data) {
// //         const grade = grades.find((g: any) => g.id === selectedGrade);
// //         const filtered = response.data.filter((r: any) => r.gradeId === selectedGrade);

// //         return filtered.map((r: any) => {
// //           const crop = crops.find((c: any) => c.id === r.cropId);

// //           return {
// //             'Rebale Tag': r.rebaleTag,
// //             Date: r.createdAt?.split('T')[0],
// //             Crop: crop?.name,
// //             Grade: grade?.name,
// //             'Total Mass (kg)': r.mass,
// //             'Status': r.status,
// //           };
// //         });
// //       }
// //     } catch (error) {
// //       toast.error('Failed to generate report');
// //     }
// //     return [];
// //   };

// //   const generateTransportFarmerReport = async () => {
// //     if (!selectedFarmer) {
// //       toast.error('Please select farmer');
// //       return [];
// //     }

// //     try {
// //       const response = await purchasesAPI.getAll();
// //       if (response.success && response.data) {
// //         const filtered = response.data.filter((t: any) => t.farmerId === selectedFarmer);
// //         return filtered.map((t: any) => {
// //           const buyer = users.find((u: any) => u.id === t.buyerId);
// //           return {
// //             'Receipt No': t.receiptNumber || t.id,
// //             Date: t.transportDate || t.createdAt,
// //             'Driver Name': t.driverName || '-',
// //             'Driver Phone': t.driverPhone || '-',
// //             'Truck Plate': t.truckPlate || '-',
// //             'Total Mass (kg)': t.totalMass || 0,
// //             'Total Amount (TZS)': t.totalAmount || 0,
// //             'Processed By': `${buyer?.firstName} ${buyer?.lastName}`,
// //           };
// //         });
// //       }
// //     } catch (error) {
// //       toast.error('Failed to generate report');
// //     }
// //     return [];
// //   };

// //   const generateTransportGeneralReport = async () => {
// //     try {
// //       const response = await transportsAPI.getAll();
// //       if (response.success && response.data) {
// //         return response.data.map((t: any) => ({
// //           Date: t.createdAt?.split('T')[0],
// //           'Driver Name': t.driverName,
// //           'Truck Plate': t.truckPlate,
// //           'Total Amount (TZS)': t.totalAmount || 0,
// //           Status: t.status,
// //         }));
// //       }
// //     } catch (error) {
// //       toast.error('Failed to generate report');
// //     }
// //     return [];
// //   };

// //   const generateTransportDriverReport = async () => {
// //     if (!selectedDriver) {
// //       toast.error('Please enter driver name');
// //       return [];
// //     }

// //     try {
// //       const response = await transportsAPI.getAll();
// //       if (response.success && response.data) {
// //         const filtered = response.data.filter((t: any) =>
// //           t.driverName?.toLowerCase().includes(selectedDriver.toLowerCase())
// //         );

// //         return filtered.map((t: any) => ({
// //           Date: t.createdAt?.split('T')[0],
// //           'Driver Name': t.driverName,
// //           'Driver Phone': t.driverPhone,
// //           'Truck Plate': t.truckPlate,
// //           'Total Amount (TZS)': t.totalAmount || 0,
// //         }));
// //       }
// //     } catch (error) {
// //       toast.error('Failed to generate report');
// //     }
// //     return [];
// //   };

// //   const generateTransportGradeReport = async () => {
// //     if (!selectedGrade) {
// //       toast.error('Please select a grade');
// //       return [];
// //     }

// //     try {
// //       const [transportsRes, rebalesRes] = await Promise.all([
// //         transportsAPI.getAll(),
// //         rebalesAPI.getAll(),
// //       ]);

// //       if (transportsRes.success && rebalesRes.success) {
// //         const grade = grades.find((g: any) => g.id === selectedGrade);

// //         return (rebalesRes.data || [])
// //           .filter((r: any) => r.gradeId === selectedGrade)
// //           .map((r: any) => ({
// //             'Rebale Tag': r.rebaleTag,
// //             Date: r.createdAt?.split('T')[0],
// //             Grade: grade?.name,
// //             'Total Mass (kg)': r.mass,
// //             Status: r.status,
// //           }));
// //       }
// //     } catch (error) {
// //       toast.error('Failed to generate report');
// //     }
// //     return [];
// //   };

// //   const generateLoanDeductionGeneralReport = async () => {
// //     try {
// //       const response = await reportsAPI.getLoanReport();
// //       if (response.success && response.data) {
// //         return response.data.map((item: any) => ({
// //           Date: item.createdAt?.split('T')[0],
// //           Farmer: item.farmerName || '-',
// //           'Loan Amount (TZS)': item.loanAmount || 0,
// //           Status: item.status,
// //         }));
// //       }
// //     } catch (error) {
// //       toast.error('Failed to generate report');
// //     }
// //     return [];
// //   };

// //   const generateLoanDeductionFarmerReport = async () => {
// //     if (!selectedFarmer) {
// //       toast.error('Please select a farmer');
// //       return [];
// //     }

// //     try {
// //       const response = await loansAPI.getByFarmerId(selectedFarmer);
// //       if (response.success && response.data) {
// //         const farmer = farmers.find((f: any) => f.id === selectedFarmer);

// //         return response.data.map((l: any) => ({
// //           Date: l.createdAt?.split('T')[0],
// //           Farmer: `${farmer?.firstName} ${farmer?.lastName}`,
// //           'Loan Amount (TZS)': l.loanAmount || 0,
// //           Status: l.status,
// //         }));
// //       }
// //     } catch (error) {
// //       toast.error('Failed to generate report');
// //     }
// //     return [];
// //   };

// //   const exportToExcel = () => {
// //     if (reportData.length === 0) {
// //       toast.error('No data to export');
// //       return;
// //     }

// //     const worksheet = XLSX.utils.json_to_sheet(reportData);
// //     const workbook = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

// //     const fileName = `${reportType}_${startDate}_to_${endDate}.xlsx`;
// //     XLSX.writeFile(workbook, fileName);
// //     toast.success('Exported to Excel');
// //   };

// //   const exportToCSV = () => {
// //     if (reportData.length === 0) {
// //       toast.error('No data to export');
// //       return;
// //     }

// //     const worksheet = XLSX.utils.json_to_sheet(reportData);
// //     const csv = XLSX.utils.sheet_to_csv(worksheet);

// //     const blob = new Blob([csv], { type: 'text/csv' });
// //     const url = window.URL.createObjectURL(blob);
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = `${reportType}_${startDate}_to_${endDate}.csv`;
// //     a.click();
// //     toast.success('Exported to CSV');
// //   };

// //   const exportToPDF = () => {
// //     if (reportData.length === 0) {
// //       toast.error('No data to export');
// //       return;
// //     }

// //     const doc = new jsPDF();
// //     doc.setFontSize(16);
// //     doc.text(`${reportType.toUpperCase()} Report`, 14, 20);
// //     doc.setFontSize(10);
// //     doc.text(`Period: ${startDate} to ${endDate}`, 14, 30);

// //     let yPos = 40;
// //     const pageHeight = doc.internal.pageSize.height;

// //     // Headers
// //     const headers = Object.keys(reportData[0]);
// //     doc.setFontSize(9);
// //     headers.forEach((header, index) => {
// //       doc.text(header, 14 + index * 35, yPos);
// //     });

// //     yPos += 5;

// //     // Data rows
// //     reportData.forEach((row) => {
// //       if (yPos > pageHeight - 20) {
// //         doc.addPage();
// //         yPos = 20;
// //       }

// //       headers.forEach((header, index) => {
// //         const value = String(row[header] || '-');
// //         doc.text(value.substring(0, 15), 14 + index * 35, yPos);
// //       });

// //       yPos += 7;
// //     });

// //     doc.save(`${reportType}_${startDate}_to_${endDate}.pdf`);
// //     toast.success('Exported to PDF');
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <div>
// //         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('reports')}</h1>
// //         <p className="text-gray-600 dark:text-gray-400 mt-1">Generate and export system reports</p>
// //       </div>

// //       {/* Filters */}
// //       <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
// //         <div className="flex items-center gap-2 mb-4">
// //           <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
// //           <h3 className="font-semibold text-gray-900 dark:text-white">Report Filters</h3>
// //         </div>

// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Report Type</label>
// //             <select
// //               value={reportType}
// //               onChange={(e) => setReportType(e.target.value as ReportType)}
// //               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
// //             >
// //               <optgroup label="Buying Reports">
// //                 <option value="buying-general">Buying - General</option>
// //                 <option value="buying-farmer">Buying - By Farmer</option>
// //                 <option value="buying-grade">Buying - By Grade</option>
// //               </optgroup>
// //               <optgroup label="Rebale Reports">
// //                 <option value="rebale-general">Rebale - General</option>
// //                 <option value="rebale-grade">Rebale - By Grade</option>
// //               </optgroup>
// //               <optgroup label="Transport Reports">
// //                 <option value="transport-general">Transport - General</option>
// //                 <option value="transport-driver">Transport - By Driver</option>
// //                 <option value="transport-grade">Transport - By Grade</option>
// //               </optgroup>
// //               <optgroup label="Loan Reports">
// //                 <option value="loan-deduction-general">Loan Deduction - General</option>
// //                 <option value="loan-deduction-farmer">Loan Deduction - By Farmer</option>
// //               </optgroup>
// //             </select>
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
// //             <input
// //               type="date"
// //               value={startDate}
// //               onChange={(e) => setStartDate(e.target.value)}
// //               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
// //             <input
// //               type="date"
// //               value={endDate}
// //               onChange={(e) => setEndDate(e.target.value)}
// //               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
// //             />
// //           </div>

// //           {(reportType === 'buying-farmer' || reportType === 'loan-deduction-farmer') && (
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Farmer</label>
// //               <select
// //                 value={selectedFarmer}
// //                 onChange={(e) => setSelectedFarmer(e.target.value)}
// //                 className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
// //               >
// //                 <option value="">-- Select Farmer --</option>
// //                 {farmers.map((farmer) => (
// //                   <option key={farmer.id} value={farmer.id}>
// //                     {farmer.firstName} {farmer.lastName} ({farmer.code})
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //           )}

// //           {(reportType === 'buying-grade' || reportType === 'rebale-grade' || reportType === 'transport-grade') && (
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Grade</label>
// //               <select
// //                 value={selectedGrade}
// //                 onChange={(e) => setSelectedGrade(e.target.value)}
// //                 className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
// //               >
// //                 <option value="">-- Select Grade --</option>
// //                 {grades.map((grade) => (
// //                   <option key={grade.id} value={grade.id}>
// //                     {grade.name} ({grade.code})
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //           )}

// //           {reportType === 'transport-driver' && (
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Driver Name</label>
// //               <input
// //                 type="text"
// //                 value={selectedDriver}
// //                 onChange={(e) => setSelectedDriver(e.target.value)}
// //                 placeholder="Enter driver name"
// //                 className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
// //               />
// //             </div>
// //           )}
// //         </div>

// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Export Format</label>
// //             <select
// //               value={exportFormat}
// //               onChange={(e) => setExportFormat(e.target.value as 'excel' | 'csv' | 'pdf')}
// //               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
// //             >
// //               <option value="excel">Excel (.xlsx)</option>
// //               <option value="csv">CSV (.csv)</option>
// //               <option value="pdf">PDF (.pdf)</option>
// //             </select>
// //           </div>

// //           <div className="flex items-end">
// //             <button
// //               onClick={generateReport}
// //               disabled={loading}
// //               className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //             >
// //               <FileText className="w-5 h-5" />
// //               {loading ? 'Generating...' : 'Generate & Export'}
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Report Results */}
// //       {reportData.length > 0 && (
// //         <>
// //           <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
// //             <div className="flex justify-between items-center mb-4">
// //               <h3 className="font-semibold text-gray-900 dark:text-white">Report Results ({reportData.length} records)</h3>
// //             </div>

// //             <div className="overflow-x-auto">
// //               <table className="w-full">
// //                 <thead>
// //                   <tr className="border-b border-gray-200 dark:border-gray-700">
// //                     {Object.keys(reportData[0]).map((header) => (
// //                       <th key={header} className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
// //                         {header}
// //                       </th>
// //                     ))}
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {reportData.map((row, index) => (
// //                     <tr key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
// //                       {Object.values(row).map((value: any, i) => (
// //                         <td key={i} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
// //                           {value}
// //                         </td>
// //                       ))}
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // }
// import { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { reportsAPI, farmersAPI, gradesAPI, cropsAPI, usersAPI, purchasesAPI, rebalesAPI, transportsAPI, loansAPI } from '../../services/api';
// import type { Farmer, Crop, Grade, User } from '../types';
// import { FileText, Download, Filter, Calendar, TrendingUp, Package, Truck, DollarSign } from 'lucide-react';
// import { toast } from 'sonner';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';

// type ReportType =
//   | 'buying-general'
//   | 'buying-farmer'
//   | 'buying-grade'
//   | 'rebale-general'
//   | 'rebale-grade'
//   | 'transport-general'
//   | 'transport-driver'
//   | 'transport-grade'
//   | 'loan-deduction-general'
//   | 'loan-deduction-farmer';

// export default function Reports() {
//   const { t } = useTranslation();

//   const [reportType, setReportType] = useState<ReportType>('buying-general');
//   const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
//   const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
//   const [selectedFarmer, setSelectedFarmer] = useState('');
//   const [selectedGrade, setSelectedGrade] = useState('');
//   const [selectedDriver, setSelectedDriver] = useState('');

//   const [farmers, setFarmers] = useState<Farmer[]>([]);
//   const [grades, setGrades] = useState<Grade[]>([]);
//   const [crops, setCrops] = useState<Crop[]>([]);
//   const [users, setUsers] = useState<User[]>([]);

//   const [reportData, setReportData] = useState<any[]>([]);
//   const [reportSummary, setReportSummary] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [exportFormat, setExportFormat] = useState<'excel' | 'csv' | 'pdf'>('excel');

//   useEffect(() => {
//     loadMasterData();
//   }, []);

//   const loadMasterData = async () => {
//     try {
//       const [farmersRes, gradesRes, cropsRes, usersRes] = await Promise.all([
//         farmersAPI.getAll(),
//         gradesAPI.getAll(),
//         cropsAPI.getAll(),
//         usersAPI.getAll(),
//       ]);
      
//       if (farmersRes.success && farmersRes.data) setFarmers(farmersRes.data);
//       if (gradesRes.success && gradesRes.data) setGrades(gradesRes.data);
//       if (cropsRes.success && cropsRes.data) setCrops(cropsRes.data);
//       if (usersRes.success && usersRes.data) setUsers(usersRes.data);
//     } catch (error) {
//       toast.error('Failed to load report data');
//     }
//   };

//   const generateReport = async () => {
//     setLoading(true);
//     setReportData([]);
//     setReportSummary(null);
    
//     try {
//       let data: any[] = [];
//       let summary: any = null;

//       switch (reportType) {
//         case 'buying-general':
//           const buyingResult = await generateBuyingGeneralReport();
//           data = buyingResult.data;
//           summary = buyingResult.summary;
//           break;
//         case 'buying-farmer':
//           data = await generateBuyingFarmerReport();
//           break;
//         case 'buying-grade':
//           data = await generateBuyingGradeReport();
//           break;
//         case 'rebale-general':
//           data = await generateRebaleGeneralReport();
//           break;
//         case 'rebale-grade':
//           data = await generateRebaleGradeReport();
//           break;
//         case 'transport-general':
//           data = await generateTransportGeneralReport();
//           break;
//         case 'transport-driver':
//           data = await generateTransportDriverReport();
//           break;
//         case 'transport-grade':
//           data = await generateTransportGradeReport();
//           break;
//         case 'loan-deduction-general':
//           data = await generateLoanDeductionGeneralReport();
//           break;
//         case 'loan-deduction-farmer':
//           data = await generateLoanDeductionFarmerReport();
//           break;
//       }

//       setReportData(data);
//       if (summary) setReportSummary(summary);
      
//       if (data.length === 0) {
//         toast.info('No data found for the selected period');
//       } else {
//         toast.success(`Report generated successfully (${data.length} records)`);
//       }
//     } catch (error: any) {
//       console.error('Report generation error:', error);
//       toast.error(error?.message || 'Failed to generate report');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateBuyingGeneralReport = async () => {
//     try {
//       const response = await reportsAPI.getPurchaseReport(startDate, endDate);
      
//       if (response.success && response.data) {
//         const purchases = response.data.purchases || [];
//         const summary = response.data.summary;
        
//         // Format the data properly
//         const formattedData = purchases.map((p: any) => {
//           const farmer = farmers.find((f: any) => f.id === p.farmerId);
//           const buyer = users.find((u: any) => u.id === p.buyerId);
          
//           // Calculate total loan deductions
//           const totalLoanDeduction = p.LoanDeductions?.reduce(
//             (sum: number, ld: any) => sum + parseFloat(ld.deductedAmount || 0), 
//             0
//           ) || 0;
          
//           return {
//             'Receipt No': p.receiptNumber || p.id,
//             'Date': new Date(p.purchaseDate).toLocaleDateString(),
//             'Farmer': farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown',
//             'Farmer Code': farmer?.code || '-',
//             'Location': farmer?.Location?.name || '-',
//             'Buyer': buyer ? `${buyer.firstName} ${buyer.lastName}` : 'Unknown',
//             'Total Mass (kg)': parseFloat(p.totalMass || 0).toFixed(2),
//             'Total Amount (TZS)': parseFloat(p.totalAmount || 0).toLocaleString(),
//             'Loan Deducted (TZS)': totalLoanDeduction.toLocaleString(),
//             'Amount Paid (TZS)': parseFloat(p.amountPaid || 0).toLocaleString(),
//           };
//         });
        
//         return { data: formattedData, summary };
//       }
//     } catch (error) {
//       console.error('Buying general report error:', error);
//       toast.error('Failed to generate buying report');
//     }
//     return { data: [], summary: null };
//   };

//   const generateBuyingFarmerReport = async () => {
//     if (!selectedFarmer) {
//       toast.error('Please select a farmer');
//       return [];
//     }

//     try {
//       const response = await purchasesAPI.getByFarmerId(selectedFarmer);
//       if (response.success && response.data) {
//         const farmer = farmers.find((f: any) => f.id === selectedFarmer);
        
//         return response.data.map((p: any) => {
//           const buyer = users.find((u: any) => u.id === p.buyerId);
//           const totalLoanDeduction = p.LoanDeductions?.reduce(
//             (sum: number, ld: any) => sum + parseFloat(ld.deductedAmount || 0), 
//             0
//           ) || 0;
          
//           return {
//             'Receipt No': p.receiptNumber || p.id,
//             'Date': new Date(p.purchaseDate).toLocaleDateString(),
//             'Farmer': `${farmer?.firstName} ${farmer?.lastName}`,
//             'Farmer Code': farmer?.code,
//             'Buyer': buyer ? `${buyer.firstName} ${buyer.lastName}` : 'Unknown',
//             'Total Mass (kg)': parseFloat(p.totalMass || 0).toFixed(2),
//             'Total Amount (TZS)': parseFloat(p.totalAmount || 0).toLocaleString(),
//             'Loan Deducted (TZS)': totalLoanDeduction.toLocaleString(),
//             'Amount Paid (TZS)': parseFloat(p.amountPaid || 0).toLocaleString(),
//           };
//         });
//       }
//     } catch (error) {
//       console.error('Buying farmer report error:', error);
//       toast.error('Failed to generate farmer report');
//     }
//     return [];
//   };

//   const generateBuyingGradeReport = async () => {
//     if (!selectedGrade) {
//       toast.error('Please select a grade');
//       return [];
//     }

//     try {
//       const response = await reportsAPI.getPurchaseReport(startDate, endDate);
//       if (response.success && response.data) {
//         const purchases = response.data.purchases || [];
//         const grade = grades.find((g: any) => g.id === selectedGrade);
        
//         // Filter purchases that have bales with the selected grade
//         // For now, return all purchases with grade info
//         return purchases.map((p: any) => {
//           const farmer = farmers.find((f: any) => f.id === p.farmerId);
          
//           return {
//             'Date': new Date(p.purchaseDate).toLocaleDateString(),
//             'Receipt No': p.receiptNumber || p.id,
//             'Farmer': farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown',
//             'Grade': grade?.name || '-',
//             'Total Mass (kg)': parseFloat(p.totalMass || 0).toFixed(2),
//             'Total Amount (TZS)': parseFloat(p.totalAmount || 0).toLocaleString(),
//           };
//         });
//       }
//     } catch (error) {
//       console.error('Buying grade report error:', error);
//       toast.error('Failed to generate grade report');
//     }
//     return [];
//   };

//   const generateRebaleGeneralReport = async () => {
//     try {
//       const response = await rebalesAPI.getAll();
//       if (response.success && response.data) {
//         return response.data.map((r: any) => {
//           const crop = crops.find((c: any) => c.id === r.cropId);
//           const grade = grades.find((g: any) => g.id === r.gradeId);
          
//           return {
//             'Rebale Tag': r.rebaleTag,
//             'Date': new Date(r.rebaleDate || r.createdAt).toLocaleDateString(),
//             'Crop': crop?.name || '-',
//             'Grade': grade?.name || '-',
//             'Total Mass (kg)': parseFloat(r.totalMass || 0).toFixed(2),
//             'Price (TZS/kg)': parseFloat(r.price || 0).toFixed(2),
//             'Total Amount (TZS)': parseFloat(r.totalAmount || 0).toLocaleString(),
//             'Status': r.status || '-',
//           };
//         });
//       }
//     } catch (error) {
//       console.error('Rebale general report error:', error);
//       toast.error('Failed to generate rebale report');
//     }
//     return [];
//   };

//   const generateRebaleGradeReport = async () => {
//     if (!selectedGrade) {
//       toast.error('Please select a grade');
//       return [];
//     }

//     try {
//       const response = await rebalesAPI.getAll();
//       if (response.success && response.data) {
//         const grade = grades.find((g: any) => g.id === selectedGrade);
//         const filtered = response.data.filter((r: any) => r.gradeId === selectedGrade);

//         return filtered.map((r: any) => {
//           const crop = crops.find((c: any) => c.id === r.cropId);
          
//           return {
//             'Rebale Tag': r.rebaleTag,
//             'Date': new Date(r.rebaleDate || r.createdAt).toLocaleDateString(),
//             'Crop': crop?.name || '-',
//             'Grade': grade?.name || '-',
//             'Total Mass (kg)': parseFloat(r.totalMass || 0).toFixed(2),
//             'Price (TZS/kg)': parseFloat(r.price || 0).toFixed(2),
//             'Total Amount (TZS)': parseFloat(r.totalAmount || 0).toLocaleString(),
//             'Status': r.status || '-',
//           };
//         });
//       }
//     } catch (error) {
//       console.error('Rebale grade report error:', error);
//       toast.error('Failed to generate grade report');
//     }
//     return [];
//   };

//   const generateTransportGeneralReport = async () => {
//     try {
//       const response = await transportsAPI.getAll();
//       if (response.success && response.data) {
//         return response.data.map((t: any) => ({
//           'Receipt No': t.receiptNumber,
//           'Date': new Date(t.transportDate || t.createdAt).toLocaleDateString(),
//           'Driver Name': t.driverName,
//           'Driver Phone': t.driverPhone,
//           'Truck Plate 1': t.truckPlate1,
//           'Truck Plate 2': t.truckPlate2 || '-',
//           'Total Mass (kg)': parseFloat(t.totalMass || 0).toFixed(2),
//           'Total Amount (TZS)': parseFloat(t.totalAmount || 0).toLocaleString(),
//           'Status': t.status || '-',
//           'Rebales Count': t.Rebales?.length || 0,
//         }));
//       }
//     } catch (error) {
//       console.error('Transport general report error:', error);
//       toast.error('Failed to generate transport report');
//     }
//     return [];
//   };

//   const generateTransportDriverReport = async () => {
//     if (!selectedDriver) {
//       toast.error('Please enter driver name');
//       return [];
//     }

//     try {
//       const response = await transportsAPI.getAll();
//       if (response.success && response.data) {
//         const filtered = response.data.filter((t: any) =>
//           t.driverName?.toLowerCase().includes(selectedDriver.toLowerCase())
//         );

//         return filtered.map((t: any) => ({
//           'Receipt No': t.receiptNumber,
//           'Date': new Date(t.transportDate || t.createdAt).toLocaleDateString(),
//           'Driver Name': t.driverName,
//           'Driver Phone': t.driverPhone,
//           'Truck Plate 1': t.truckPlate1,
//           'Truck Plate 2': t.truckPlate2 || '-',
//           'Total Mass (kg)': parseFloat(t.totalMass || 0).toFixed(2),
//           'Total Amount (TZS)': parseFloat(t.totalAmount || 0).toLocaleString(),
//           'Status': t.status || '-',
//         }));
//       }
//     } catch (error) {
//       console.error('Transport driver report error:', error);
//       toast.error('Failed to generate driver report');
//     }
//     return [];
//   };

//   const generateTransportGradeReport = async () => {
//     if (!selectedGrade) {
//       toast.error('Please select a grade');
//       return [];
//     }

//     try {
//       const [transportsRes, rebalesRes] = await Promise.all([
//         transportsAPI.getAll(),
//         rebalesAPI.getAll(),
//       ]);

//       if (transportsRes.success && rebalesRes.success) {
//         const grade = grades.find((g: any) => g.id === selectedGrade);
//         const filteredRebales = (rebalesRes.data || []).filter((r: any) => r.gradeId === selectedGrade);

//         return filteredRebales.map((r: any) => ({
//           'Rebale Tag': r.rebaleTag,
//           'Date': new Date(r.rebaleDate || r.createdAt).toLocaleDateString(),
//           'Grade': grade?.name || '-',
//           'Total Mass (kg)': parseFloat(r.totalMass || 0).toFixed(2),
//           'Total Amount (TZS)': parseFloat(r.totalAmount || 0).toLocaleString(),
//           'Status': r.status || '-',
//         }));
//       }
//     } catch (error) {
//       console.error('Transport grade report error:', error);
//       toast.error('Failed to generate grade report');
//     }
//     return [];
//   };

//   const generateLoanDeductionGeneralReport = async () => {
//     try {
//       const response = await reportsAPI.getLoanReport();
//       if (response.success && response.data) {
//         return response.data.map((item: any) => ({
//           'Date': new Date(item.createdAt).toLocaleDateString(),
//           'Farmer': item.farmerName || '-',
//           'Farmer Code': item.farmerCode || '-',
//           'Loan Amount (TZS)': parseFloat(item.loanAmount || 0).toLocaleString(),
//           'Paid Amount (TZS)': parseFloat(item.paidAmount || 0).toLocaleString(),
//           'Remaining (TZS)': parseFloat(item.remainingAmount || 0).toLocaleString(),
//           'Status': item.status || '-',
//         }));
//       }
//     } catch (error) {
//       console.error('Loan deduction report error:', error);
//       toast.error('Failed to generate loan report');
//     }
//     return [];
//   };

//   const generateLoanDeductionFarmerReport = async () => {
//     if (!selectedFarmer) {
//       toast.error('Please select a farmer');
//       return [];
//     }

//     try {
//       const response = await loansAPI.getByFarmerId(selectedFarmer);
//       if (response.success && response.data) {
//         const farmer = farmers.find((f: any) => f.id === selectedFarmer);

//         return response.data.map((l: any) => ({
//           'Date': new Date(l.createdAt).toLocaleDateString(),
//           'Farmer': `${farmer?.firstName} ${farmer?.lastName}`,
//           'Farmer Code': farmer?.code,
//           'Loan Amount (TZS)': parseFloat(l.loanAmount || 0).toLocaleString(),
//           'Paid Amount (TZS)': parseFloat(l.paidAmount || 0).toLocaleString(),
//           'Remaining (TZS)': parseFloat(l.remainingAmount || 0).toLocaleString(),
//           'Status': l.status || '-',
//         }));
//       }
//     } catch (error) {
//       console.error('Loan deduction farmer report error:', error);
//       toast.error('Failed to generate farmer loan report');
//     }
//     return [];
//   };

//   const exportToExcel = () => {
//     if (reportData.length === 0) {
//       toast.error('No data to export');
//       return;
//     }

//     const worksheet = XLSX.utils.json_to_sheet(reportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

//     const fileName = `${reportType}_${startDate}_to_${endDate}.xlsx`;
//     XLSX.writeFile(workbook, fileName);
//     toast.success('Exported to Excel');
//   };

//   const exportToCSV = () => {
//     if (reportData.length === 0) {
//       toast.error('No data to export');
//       return;
//     }

//     const worksheet = XLSX.utils.json_to_sheet(reportData);
//     const csv = XLSX.utils.sheet_to_csv(worksheet);

//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${reportType}_${startDate}_to_${endDate}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//     toast.success('Exported to CSV');
//   };

//   const exportToPDF = () => {
//     if (reportData.length === 0) {
//       toast.error('No data to export');
//       return;
//     }

//     const doc = new jsPDF({ orientation: 'landscape' });
//     let yPos = 20;
//     const pageHeight = doc.internal.pageSize.height;
//     const pageWidth = doc.internal.pageSize.width;

//     // Title
//     doc.setFontSize(16);
//     doc.text(`${reportType.toUpperCase()} Report`, 14, yPos);
//     yPos += 10;
    
//     doc.setFontSize(10);
//     doc.text(`Period: ${startDate} to ${endDate}`, 14, yPos);
//     yPos += 10;
    
//     // Summary if available
//     if (reportSummary) {
//       doc.setFontSize(10);
//       doc.text(`Summary: ${reportSummary.totalPurchases || 0} purchases, ${reportSummary.uniqueFarmers || 0} farmers`, 14, yPos);
//       yPos += 10;
//     }
    
//     yPos += 5;

//     // Headers
//     const headers = Object.keys(reportData[0]);
//     doc.setFontSize(8);
    
//     headers.forEach((header, index) => {
//       const xPos = 14 + (index * (pageWidth / headers.length));
//       doc.text(header.substring(0, 20), xPos, yPos);
//     });
    
//     yPos += 7;

//     // Data rows
//     reportData.forEach((row) => {
//       if (yPos > pageHeight - 20) {
//         doc.addPage();
//         yPos = 20;
        
//         // Reprint headers on new page
//         headers.forEach((header, index) => {
//           const xPos = 14 + (index * (pageWidth / headers.length));
//           doc.text(header.substring(0, 20), xPos, yPos);
//         });
//         yPos += 7;
//       }

//       headers.forEach((header, index) => {
//         const xPos = 14 + (index * (pageWidth / headers.length));
//         let value = String(row[header] || '-');
//         if (value.length > 25) value = value.substring(0, 22) + '...';
//         doc.text(value, xPos, yPos);
//       });
      
//       yPos += 6;
//     });

//     doc.save(`${reportType}_${startDate}_to_${endDate}.pdf`);
//     toast.success('Exported to PDF');
//   };

//   const handleExport = () => {
//     if (reportData.length === 0) {
//       toast.error('No data to export. Please generate a report first.');
//       return;
//     }
    
//     if (exportFormat === 'excel') {
//       exportToExcel();
//     } else if (exportFormat === 'csv') {
//       exportToCSV();
//     } else if (exportFormat === 'pdf') {
//       exportToPDF();
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('reports')}</h1>
//         <p className="text-gray-600 dark:text-gray-400 mt-1">Generate and export system reports</p>
//       </div>

//       {/* Stats Cards */}
//       {reportSummary && reportData.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
//                 <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">Total Purchases</p>
//                 <p className="text-2xl font-bold text-gray-900 dark:text-white">{reportSummary.totalPurchases || 0}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
//                 <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">Unique Farmers</p>
//                 <p className="text-2xl font-bold text-gray-900 dark:text-white">{reportSummary.uniqueFarmers || 0}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
//                 <Truck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">Total Mass</p>
//                 <p className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {reportSummary.totalMass ? parseFloat(reportSummary.totalMass).toFixed(2) : '0'} kg
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
//                 <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
//                 <p className="text-2xl font-bold text-gray-900 dark:text-white">
//                   TZS {reportSummary.totalAmount ? parseFloat(reportSummary.totalAmount).toLocaleString() : '0'}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
//         <div className="flex items-center gap-2 mb-4">
//           <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
//           <h3 className="font-semibold text-gray-900 dark:text-white">Report Filters</h3>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Report Type</label>
//             <select
//               value={reportType}
//               onChange={(e) => setReportType(e.target.value as ReportType)}
//               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
//             >
//               <optgroup label="Buying Reports">
//                 <option value="buying-general">Buying - General</option>
//                 <option value="buying-farmer">Buying - By Farmer</option>
//                 <option value="buying-grade">Buying - By Grade</option>
//               </optgroup>
//               <optgroup label="Rebale Reports">
//                 <option value="rebale-general">Rebale - General</option>
//                 <option value="rebale-grade">Rebale - By Grade</option>
//               </optgroup>
//               <optgroup label="Transport Reports">
//                 <option value="transport-general">Transport - General</option>
//                 <option value="transport-driver">Transport - By Driver</option>
//                 <option value="transport-grade">Transport - By Grade</option>
//               </optgroup>
//               <optgroup label="Loan Reports">
//                 <option value="loan-deduction-general">Loan Deduction - General</option>
//                 <option value="loan-deduction-farmer">Loan Deduction - By Farmer</option>
//               </optgroup>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               <Calendar className="w-4 h-4 inline mr-1" />
//               Start Date
//             </label>
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               <Calendar className="w-4 h-4 inline mr-1" />
//               End Date
//             </label>
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
//             />
//           </div>

//           {(reportType === 'buying-farmer' || reportType === 'loan-deduction-farmer') && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Farmer</label>
//               <select
//                 value={selectedFarmer}
//                 onChange={(e) => setSelectedFarmer(e.target.value)}
//                 className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
//               >
//                 <option value="">-- Select Farmer --</option>
//                 {farmers.map((farmer) => (
//                   <option key={farmer.id} value={farmer.id}>
//                     {farmer.firstName} {farmer.lastName} ({farmer.code})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {(reportType === 'buying-grade' || reportType === 'rebale-grade' || reportType === 'transport-grade') && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Grade</label>
//               <select
//                 value={selectedGrade}
//                 onChange={(e) => setSelectedGrade(e.target.value)}
//                 className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
//               >
//                 <option value="">-- Select Grade --</option>
//                 {grades.map((grade) => (
//                   <option key={grade.id} value={grade.id}>
//                     {grade.name} ({grade.code})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {reportType === 'transport-driver' && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Driver Name</label>
//               <input
//                 type="text"
//                 value={selectedDriver}
//                 onChange={(e) => setSelectedDriver(e.target.value)}
//                 placeholder="Enter driver name"
//                 className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
//               />
//             </div>
//           )}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Export Format</label>
//             <select
//               value={exportFormat}
//               onChange={(e) => setExportFormat(e.target.value as 'excel' | 'csv' | 'pdf')}
//               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
//             >
//               <option value="excel">Excel (.xlsx)</option>
//               <option value="csv">CSV (.csv)</option>
//               <option value="pdf">PDF (.pdf)</option>
//             </select>
//           </div>

//           <div>
//             <button
//               onClick={generateReport}
//               disabled={loading}
//               className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
//             >
//               <FileText className="w-5 h-5" />
//               {loading ? 'Generating...' : 'Generate Report'}
//             </button>
//           </div>

//           <div>
//             <button
//               onClick={handleExport}
//               disabled={reportData.length === 0}
//               className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
//             >
//               <Download className="w-5 h-5" />
//               Export Report
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Report Results */}
//       {reportData.length > 0 && (
//         <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-gray-900 dark:text-white">
//               Report Results ({reportData.length} records)
//             </h3>
//             <button
//               onClick={handleExport}
//               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
//             >
//               <Download className="w-4 h-4" />
//               Export
//             </button>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
//                   {Object.keys(reportData[0]).map((header) => (
//                     <th key={header} className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white whitespace-nowrap">
//                       {header}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportData.map((row, index) => (
//                   <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
//                     {Object.values(row).map((value: any, i) => (
//                       <td key={i} className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">
//                         {value}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { reportsAPI, farmersAPI, gradesAPI, cropsAPI, usersAPI, purchasesAPI, rebalesAPI, transportsAPI, loansAPI } from '../../services/api';
import type { Farmer, Crop, Grade, User } from '../types';
import { FileText, Download, Filter, Calendar, TrendingUp, Package, Truck, DollarSign } from 'lucide-react';
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
  const [reportSummary, setReportSummary] = useState<any>(null);
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
    setReportData([]);
    setReportSummary(null);
    
    try {
      let data: any[] = [];
      let summary: any = null;

      switch (reportType) {
        case 'buying-general':
          const buyingResult = await generateBuyingGeneralReport();
          data = buyingResult.data;
          summary = buyingResult.summary;
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
          const loanResult = await generateLoanDeductionGeneralReport();
          data = loanResult.data;
          summary = loanResult.summary;
          break;
        case 'loan-deduction-farmer':
          data = await generateLoanDeductionFarmerReport();
          break;
      }

      setReportData(data);
      if (summary) setReportSummary(summary);
      
      if (data.length === 0) {
        toast.info('No data found for the selected period');
      } else {
        toast.success(`Report generated successfully (${data.length} records)`);
      }
    } catch (error: any) {
      console.error('Report generation error:', error);
      toast.error(error?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const generateBuyingGeneralReport = async () => {
    try {
      const response = await reportsAPI.getPurchaseReport(startDate, endDate);
      
      if (response.success && response.data) {
        const purchases = response.data.purchases || [];
        const summary = response.data.summary;
        
        const formattedData = purchases.map((p: any) => {
          const farmer = farmers.find((f: any) => f.id === p.farmerId);
          const buyer = users.find((u: any) => u.id === p.buyerId);
          
          const totalLoanDeduction = p.LoanDeductions?.reduce(
            (sum: number, ld: any) => sum + parseFloat(ld.deductedAmount || 0), 
            0
          ) || 0;
          
          return {
            'Receipt No': p.receiptNumber || p.id,
            'Date': new Date(p.purchaseDate).toLocaleDateString(),
            'Farmer': farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown',
            'Farmer Code': farmer?.code || '-',
            'Location': farmer?.Location?.name || '-',
            'Buyer': buyer ? `${buyer.firstName} ${buyer.lastName}` : 'Unknown',
            'Total Mass (kg)': parseFloat(p.totalMass || 0).toFixed(2),
            'Total Amount (TZS)': parseFloat(p.totalAmount || 0).toLocaleString(),
            'Loan Deducted (TZS)': totalLoanDeduction.toLocaleString(),
            'Amount Paid (TZS)': parseFloat(p.amountPaid || 0).toLocaleString(),
          };
        });
        
        return { data: formattedData, summary };
      }
    } catch (error) {
      console.error('Buying general report error:', error);
      toast.error('Failed to generate buying report');
    }
    return { data: [], summary: null };
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
          const totalLoanDeduction = p.LoanDeductions?.reduce(
            (sum: number, ld: any) => sum + parseFloat(ld.deductedAmount || 0), 
            0
          ) || 0;
          
          return {
            'Receipt No': p.receiptNumber || p.id,
            'Date': new Date(p.purchaseDate).toLocaleDateString(),
            'Farmer': `${farmer?.firstName} ${farmer?.lastName}`,
            'Farmer Code': farmer?.code,
            'Buyer': buyer ? `${buyer.firstName} ${buyer.lastName}` : 'Unknown',
            'Total Mass (kg)': parseFloat(p.totalMass || 0).toFixed(2),
            'Total Amount (TZS)': parseFloat(p.totalAmount || 0).toLocaleString(),
            'Loan Deducted (TZS)': totalLoanDeduction.toLocaleString(),
            'Amount Paid (TZS)': parseFloat(p.amountPaid || 0).toLocaleString(),
          };
        });
      }
    } catch (error) {
      console.error('Buying farmer report error:', error);
      toast.error('Failed to generate farmer report');
    }
    return [];
  };

  const generateBuyingGradeReport = async () => {
    if (!selectedGrade) {
      toast.error('Please select a grade');
      return [];
    }

    try {
      const response = await reportsAPI.getPurchaseReport(startDate, endDate);
      if (response.success && response.data) {
        const purchases = response.data.purchases || [];
        const grade = grades.find((g: any) => g.id === selectedGrade);
        
        return purchases.map((p: any) => {
          const farmer = farmers.find((f: any) => f.id === p.farmerId);
          
          return {
            'Date': new Date(p.purchaseDate).toLocaleDateString(),
            'Receipt No': p.receiptNumber || p.id,
            'Farmer': farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown',
            'Grade': grade?.name || '-',
            'Total Mass (kg)': parseFloat(p.totalMass || 0).toFixed(2),
            'Total Amount (TZS)': parseFloat(p.totalAmount || 0).toLocaleString(),
          };
        });
      }
    } catch (error) {
      console.error('Buying grade report error:', error);
      toast.error('Failed to generate grade report');
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
            'Date': new Date(r.rebaleDate || r.createdAt).toLocaleDateString(),
            'Crop': crop?.name || '-',
            'Grade': grade?.name || '-',
            'Total Mass (kg)': parseFloat(r.totalMass || 0).toFixed(2),
            'Price (TZS/kg)': parseFloat(r.price || 0).toFixed(2),
            'Total Amount (TZS)': parseFloat(r.totalAmount || 0).toLocaleString(),
            'Status': r.status || '-',
          };
        });
      }
    } catch (error) {
      console.error('Rebale general report error:', error);
      toast.error('Failed to generate rebale report');
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
        const filtered = response.data.filter((r: any) => r.gradeId === parseInt(selectedGrade));

        if (filtered.length === 0) {
          toast.info(`No rebales found for grade: ${grade?.name}`);
        }

        return filtered.map((r: any) => {
          const crop = crops.find((c: any) => c.id === r.cropId);
          
          return {
            'Rebale Tag': r.rebaleTag,
            'Date': new Date(r.rebaleDate || r.createdAt).toLocaleDateString(),
            'Crop': crop?.name || '-',
            'Grade': grade?.name || '-',
            'Total Mass (kg)': parseFloat(r.totalMass || 0).toFixed(2),
            'Price (TZS/kg)': parseFloat(r.price || 0).toFixed(2),
            'Total Amount (TZS)': parseFloat(r.totalAmount || 0).toLocaleString(),
            'Status': r.status || '-',
          };
        });
      }
    } catch (error) {
      console.error('Rebale grade report error:', error);
      toast.error('Failed to generate grade report');
    }
    return [];
  };

  const generateTransportGeneralReport = async () => {
    try {
      const response = await transportsAPI.getAll();
      if (response.success && response.data) {
        return response.data.map((t: any) => ({
          'Receipt No': t.receiptNumber,
          'Date': new Date(t.transportDate || t.createdAt).toLocaleDateString(),
          'Driver Name': t.driverName,
          'Driver Phone': t.driverPhone,
          'Truck Plate 1': t.truckPlate1,
          'Truck Plate 2': t.truckPlate2 || '-',
          'Total Mass (kg)': parseFloat(t.totalMass || 0).toFixed(2),
          'Total Amount (TZS)': parseFloat(t.totalAmount || 0).toLocaleString(),
          'Status': t.status || '-',
          'Rebales Count': t.Rebales?.length || 0,
        }));
      }
    } catch (error) {
      console.error('Transport general report error:', error);
      toast.error('Failed to generate transport report');
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

        if (filtered.length === 0) {
          toast.info(`No transports found for driver: ${selectedDriver}`);
        }

        return filtered.map((t: any) => ({
          'Receipt No': t.receiptNumber,
          'Date': new Date(t.transportDate || t.createdAt).toLocaleDateString(),
          'Driver Name': t.driverName,
          'Driver Phone': t.driverPhone,
          'Truck Plate 1': t.truckPlate1,
          'Truck Plate 2': t.truckPlate2 || '-',
          'Total Mass (kg)': parseFloat(t.totalMass || 0).toFixed(2),
          'Total Amount (TZS)': parseFloat(t.totalAmount || 0).toLocaleString(),
          'Status': t.status || '-',
        }));
      }
    } catch (error) {
      console.error('Transport driver report error:', error);
      toast.error('Failed to generate driver report');
    }
    return [];
  };

  const generateTransportGradeReport = async () => {
    if (!selectedGrade) {
      toast.error('Please select a grade');
      return [];
    }

    try {
      const response = await transportsAPI.getAll();
      if (response.success && response.data) {
        const grade = grades.find((g: any) => g.id === parseInt(selectedGrade));
        
        // Filter transports that have rebales with the selected grade
        const filteredTransports = response.data.filter((transport: any) => {
          if (!transport.Rebales || transport.Rebales.length === 0) return false;
          return transport.Rebales.some((rebale: any) => rebale.gradeId === parseInt(selectedGrade));
        });

        if (filteredTransports.length === 0) {
          toast.info(`No transports found for grade: ${grade?.name}`);
        }

        // Create a flat list showing each rebale in each transport
        const reportItems: any[] = [];
        
        filteredTransports.forEach((transport: any) => {
          transport.Rebales.forEach((rebale: any) => {
            if (rebale.gradeId === parseInt(selectedGrade)) {
              reportItems.push({
                'Transport Receipt': transport.receiptNumber,
                'Transport Date': new Date(transport.transportDate || transport.createdAt).toLocaleDateString(),
                'Driver Name': transport.driverName,
                'Truck Plate': transport.truckPlate1,
                'Rebale Tag': rebale.rebaleTag,
                'Crop': rebale.Crop?.name || '-',
                'Grade': grade?.name || '-',
                'Rebale Mass (kg)': parseFloat(rebale.totalMass || 0).toFixed(2),
                'Rebale Amount (TZS)': parseFloat(rebale.totalAmount || 0).toLocaleString(),
              });
            }
          });
        });
        
        return reportItems;
      }
    } catch (error) {
      console.error('Transport grade report error:', error);
      toast.error('Failed to generate grade report');
    }
    return [];
  };

  const generateLoanDeductionGeneralReport = async () => {
    try {
      const response = await reportsAPI.getLoanReport();
      
      if (response.success && response.data) {
        const farmerLoans = response.data.farmerLoans || [];
        const summary = response.data.summary;
        
        const formattedData = farmerLoans.map((loan: any) => {
          const farmer = loan.Farmer;
          const totalDeducted = loan.LoanDeductions?.reduce(
            (sum: number, ld: any) => sum + parseFloat(ld.deductedAmount || 0), 
            0
          ) || 0;
          
          const paidAmount = totalDeducted;
          const remainingDebt = parseFloat(loan.remainingDebt || 0);
          
          return {
            'Farmer': farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown',
            'Farmer Code': farmer?.code || '-',
            'Loan Amount (TZS)': parseFloat(loan.totalAmount || 0).toLocaleString(),
            'Total Deducted (TZS)': totalDeducted.toLocaleString(),
            'Remaining Debt (TZS)': remainingDebt.toLocaleString(),
            'Payment Status': remainingDebt <= 0 ? 'Paid Off' : 'Active',
            'Issued Date': new Date(loan.issuedDate).toLocaleDateString(),
            'Last Updated': new Date(loan.updatedAt).toLocaleDateString(),
          };
        });
        
        return { data: formattedData, summary };
      }
    } catch (error) {
      console.error('Loan deduction report error:', error);
      toast.error('Failed to generate loan report');
    }
    return { data: [], summary: null };
  };

  const generateLoanDeductionFarmerReport = async () => {
    if (!selectedFarmer) {
      toast.error('Please select a farmer');
      return [];
    }

    try {
      // Get farmer loans from the report API since it has the structure
      const response = await reportsAPI.getLoanReport();
      
      if (response.success && response.data) {
        const farmerLoans = response.data.farmerLoans || [];
        const filtered = farmerLoans.filter((loan: any) => loan.farmerId === parseInt(selectedFarmer));
        
        const farmer = farmers.find((f: any) => f.id === parseInt(selectedFarmer));
        
        if (filtered.length === 0) {
          toast.info(`No loans found for farmer: ${farmer?.firstName} ${farmer?.lastName}`);
        }
        
        return filtered.map((loan: any) => {
          const totalDeducted = loan.LoanDeductions?.reduce(
            (sum: number, ld: any) => sum + parseFloat(ld.deductedAmount || 0), 
            0
          ) || 0;
          
          const remainingDebt = parseFloat(loan.remainingDebt || 0);
          
          return {
            'Farmer': farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown',
            'Farmer Code': farmer?.code || '-',
            'Loan Amount (TZS)': parseFloat(loan.totalAmount || 0).toLocaleString(),
            'Total Deducted (TZS)': totalDeducted.toLocaleString(),
            'Remaining Debt (TZS)': remainingDebt.toLocaleString(),
            'Payment Status': remainingDebt <= 0 ? 'Paid Off' : 'Active',
            'Issued Date': new Date(loan.issuedDate).toLocaleDateString(),
            'Last Deduction Date': loan.LoanDeductions?.length > 0 
              ? new Date(loan.LoanDeductions[loan.LoanDeductions.length - 1].createdAt).toLocaleDateString()
              : '-',
          };
        });
      }
    } catch (error) {
      console.error('Loan deduction farmer report error:', error);
      toast.error('Failed to generate farmer loan report');
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
    window.URL.revokeObjectURL(url);
    toast.success('Exported to CSV');
  };

  const exportToPDF = () => {
    if (reportData.length === 0) {
      toast.error('No data to export');
      return;
    }

    const doc = new jsPDF({ orientation: 'landscape' });
    let yPos = 20;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;

    doc.setFontSize(16);
    doc.text(`${reportType.toUpperCase()} Report`, 14, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.text(`Period: ${startDate} to ${endDate}`, 14, yPos);
    yPos += 10;
    
    if (reportSummary) {
      doc.setFontSize(10);
      if (reportSummary.totalLoans !== undefined) {
        doc.text(`Summary: ${reportSummary.totalLoans} loans, Active: ${reportSummary.activeLoans}, Paid Off: ${reportSummary.completedLoans}`, 14, yPos);
      } else if (reportSummary.totalPurchases !== undefined) {
        doc.text(`Summary: ${reportSummary.totalPurchases} purchases, ${reportSummary.uniqueFarmers} farmers`, 14, yPos);
      }
      yPos += 10;
    }
    
    yPos += 5;

    const headers = Object.keys(reportData[0]);
    doc.setFontSize(8);
    
    headers.forEach((header, index) => {
      const xPos = 14 + (index * (pageWidth / headers.length));
      doc.text(header.substring(0, 20), xPos, yPos);
    });
    
    yPos += 7;

    reportData.forEach((row) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
        
        headers.forEach((header, index) => {
          const xPos = 14 + (index * (pageWidth / headers.length));
          doc.text(header.substring(0, 20), xPos, yPos);
        });
        yPos += 7;
      }

      headers.forEach((header, index) => {
        const xPos = 14 + (index * (pageWidth / headers.length));
        let value = String(row[header] || '-');
        if (value.length > 25) value = value.substring(0, 22) + '...';
        doc.text(value, xPos, yPos);
      });
      
      yPos += 6;
    });

    doc.save(`${reportType}_${startDate}_to_${endDate}.pdf`);
    toast.success('Exported to PDF');
  };

  const handleExport = () => {
    if (reportData.length === 0) {
      toast.error('No data to export. Please generate a report first.');
      return;
    }
    
    if (exportFormat === 'excel') {
      exportToExcel();
    } else if (exportFormat === 'csv') {
      exportToCSV();
    } else if (exportFormat === 'pdf') {
      exportToPDF();
    }
  };

  // Calculate loan summary stats
  const loanSummary = reportType === 'loan-deduction-general' && reportData.length > 0 ? {
    totalLoans: reportData.length,
    totalLoanAmount: reportData.reduce((sum, r) => sum + parseFloat(r['Loan Amount (TZS)']?.replace(/,/g, '') || 0), 0),
    totalRemaining: reportData.reduce((sum, r) => sum + parseFloat(r['Remaining Debt (TZS)']?.replace(/,/g, '') || 0), 0),
    paidOffLoans: reportData.filter(r => r['Payment Status'] === 'Paid Off').length,
    activeLoans: reportData.filter(r => r['Payment Status'] === 'Active').length,
  } : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('reports')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Generate and export system reports</p>
      </div>

      {/* Stats Cards for Loan Reports */}
      {loanSummary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{loanSummary.totalLoans}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Loans</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{loanSummary.activeLoans}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Loans</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{loanSummary.paidOffLoans}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Paid Off</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              TZS {loanSummary.totalLoanAmount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Loan Amount</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              TZS {loanSummary.totalRemaining.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Remaining</div>
          </div>
        </div>
      )}

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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              End Date
            </label>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div>
            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <FileText className="w-5 h-5" />
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>

          <div>
            <button
              onClick={handleExport}
              disabled={reportData.length === 0}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Report Results */}
      {reportData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Report Results ({reportData.length} records)
            </h3>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  {Object.keys(reportData[0]).map((header) => (
                    <th key={header} className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    {Object.values(row).map((value: any, i) => (
                      <td key={i} className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}