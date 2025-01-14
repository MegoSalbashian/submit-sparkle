import { branches } from './branchService';
import { calculateAverageData } from '../utils/calculationUtils';

const getProcessedRecords = () => {
  const storedRecords = localStorage.getItem('processedRecords');
  return storedRecords ? JSON.parse(storedRecords) : [];
};

const calculateStreaks = (records: any[], branchId: string) => {
  const filteredRecords = branchId === 'all' 
    ? records 
    : records.filter(record => record.branchId === branchId);

  return {
    handover: filteredRecords.filter(r => r.handoverStatus === 'approved').length,
    deposits: filteredRecords.filter(r => r.depositStatus === 'approved').length,
    invoices: filteredRecords.filter(r => r.invoiceStatus === 'approved').length,
  };
};

const calculateLongestStreaks = (records: any[], branchId: string) => {
  // For now, using the same logic as current streaks
  return calculateStreaks(records, branchId);
};

const calculateSubmissions = (records: any[], branchId: string) => {
  const filteredRecords = branchId === 'all' 
    ? records 
    : records.filter(record => record.branchId === branchId);

  return {
    handover: filteredRecords.length,
    deposits: filteredRecords.length,
    invoices: filteredRecords.length,
  };
};

const calculateApprovedSubmissions = (records: any[], branchId: string) => {
  const filteredRecords = branchId === 'all' 
    ? records 
    : records.filter(record => record.branchId === branchId);

  return {
    handover: filteredRecords.filter(r => r.handoverStatus === 'approved').length,
    deposits: filteredRecords.filter(r => r.depositStatus === 'approved').length,
    invoices: filteredRecords.filter(r => r.invoiceStatus === 'approved').length,
  };
};

const calculateRejectedSubmissions = (records: any[], branchId: string) => {
  const filteredRecords = branchId === 'all' 
    ? records 
    : records.filter(record => record.branchId === branchId);

  return {
    handover: filteredRecords.filter(r => r.handoverStatus === 'rejected').length,
    deposits: filteredRecords.filter(r => r.depositStatus === 'rejected').length,
    invoices: filteredRecords.filter(r => r.invoiceStatus === 'rejected').length,
  };
};

const generateBranchData = (branchId: string, dateRange: string) => {
  const records = getProcessedRecords();
  
  return {
    streaks: calculateStreaks(records, branchId),
    longestStreaks: calculateLongestStreaks(records, branchId),
    totalSubmissions: calculateSubmissions(records, branchId),
    approvedSubmissions: calculateApprovedSubmissions(records, branchId),
    rejectedSubmissions: calculateRejectedSubmissions(records, branchId)
  };
};

const generateSubmissionHistory = (branchId: string, dateRange: string) => {
  const days = dateRange === "7d" ? 7 : 
              dateRange === "30d" ? 30 : 
              dateRange === "90d" ? 90 : 180;
  
  const records = getProcessedRecords();
  const data = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const currentDate = date.toISOString().split('T')[0];
    
    const dayRecords = records.filter(record => 
      record.date === currentDate && 
      (branchId === 'all' || record.branchId === branchId)
    );

    const totalRecords = dayRecords.length;
    const approvedRecords = dayRecords.filter(r => 
      r.handoverStatus === 'approved' && 
      r.depositStatus === 'approved' && 
      r.invoiceStatus === 'approved'
    ).length;

    const successRate = totalRecords > 0 
      ? (approvedRecords / totalRecords) * 100 
      : 0;
    
    data.push({
      date: currentDate,
      successRate: Number(successRate.toFixed(1))
    });
  }
  
  return data;
};

export const generateMockData = (branchId: string, dateRange: string = "7d") => {
  if (branchId === "all") {
    const branchesData = branches.map(branch => 
      generateBranchData(branch.id, dateRange)
    );
    return {
      ...calculateAverageData(branchesData),
      submissionHistory: generateSubmissionHistory(branchId, dateRange)
    };
  }

  return {
    ...generateBranchData(branchId, dateRange),
    submissionHistory: generateSubmissionHistory(branchId, dateRange)
  };
};