import { branches } from './branchService';
import { calculateAverageData } from '../utils/calculationUtils';

const generateBranchData = (branchId: string, dateMultiplier: number) => {
  return {
    streaks: {
      handover: 0,
      deposits: 0,
      invoices: 0,
    },
    longestStreaks: {
      handover: 0,
      deposits: 0,
      invoices: 0,
    },
    totalSubmissions: {
      handover: 0,
      deposits: 0,
      invoices: 0,
    },
    approvedSubmissions: {
      handover: 0,
      deposits: 0,
      invoices: 0,
    },
    rejectedSubmissions: {
      handover: 0,
      deposits: 0,
      invoices: 0,
    }
  };
};

const generateSubmissionHistory = (branchId: string, dateRange: string) => {
  const days = dateRange === "7d" ? 7 : 
              dateRange === "30d" ? 30 : 
              dateRange === "90d" ? 90 : 180;
  
  const data = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      successRate: 0
    });
  }
  
  return data;
};

export const generateMockData = (branchId: string, dateRange: string = "7d") => {
  const dateMultiplier = dateRange === "7d" ? 1 : 
                        dateRange === "30d" ? 2 :
                        dateRange === "90d" ? 3 : 4;

  if (branchId === "all") {
    const branchesData = branches.map(branch => 
      generateBranchData(branch.id, dateMultiplier)
    );
    return {
      ...calculateAverageData(branchesData),
      submissionHistory: generateSubmissionHistory(branchId, dateRange)
    };
  }

  return {
    ...generateBranchData(branchId, dateMultiplier),
    submissionHistory: generateSubmissionHistory(branchId, dateRange)
  };
};