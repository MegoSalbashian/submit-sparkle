import { branches } from './branchService';
import { calculateAverageData } from '../utils/calculationUtils';

const generateBranchData = (branchId: string, dateMultiplier: number) => {
  const baseMultiplier = parseInt(branchId);
  return {
    streaks: {
      handover: Math.max(1, (3 * baseMultiplier * dateMultiplier) % 7),
      deposits: Math.max(1, (2 * baseMultiplier * dateMultiplier) % 6),
      invoices: Math.max(1, (1 * baseMultiplier * dateMultiplier) % 5),
    },
    longestStreaks: {
      handover: Math.max(3, (5 * baseMultiplier * dateMultiplier) % 10),
      deposits: Math.max(2, (4 * baseMultiplier * dateMultiplier) % 8),
      invoices: Math.max(1, (3 * baseMultiplier * dateMultiplier) % 7),
    },
    totalSubmissions: {
      handover: 10 * baseMultiplier * dateMultiplier,
      deposits: 8 * baseMultiplier * dateMultiplier,
      invoices: 6 * baseMultiplier * dateMultiplier,
    },
    approvedSubmissions: {
      handover: 7 * baseMultiplier * dateMultiplier,
      deposits: 5 * baseMultiplier * dateMultiplier,
      invoices: 4 * baseMultiplier * dateMultiplier,
    },
    rejectedSubmissions: {
      handover: 3 * baseMultiplier * dateMultiplier,
      deposits: 3 * baseMultiplier * dateMultiplier,
      invoices: 2 * baseMultiplier * dateMultiplier,
    }
  };
};

const generateSubmissionHistory = (branchId: string, dateRange: string) => {
  const days = dateRange === "7d" ? 7 : 
              dateRange === "30d" ? 30 : 
              dateRange === "90d" ? 90 : 180;
  
  const data = [];
  const baseMultiplier = branchId === "all" ? 1 : parseInt(branchId);
  const baseSuccessRate = 75;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const variation = Math.sin(i * 0.3) * 10;
    const randomFactor = (Math.random() - 0.5) * 5;
    let successRate = baseSuccessRate + variation + randomFactor;
    
    if (branchId !== "all") {
      successRate += (baseMultiplier - 3) * 2;
    }
    
    successRate = Math.min(100, Math.max(0, successRate));
    
    data.push({
      date: date.toISOString().split('T')[0],
      successRate: Number(successRate.toFixed(1))
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