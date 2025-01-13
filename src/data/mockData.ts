export type Branch = {
  id: string;
  name: string;
};

export type StreakData = {
  handover: number;
  deposits: number;
  invoices: number;
};

export type SubmissionType = keyof StreakData;

// Get branches from localStorage or use default if none exist
const getStoredBranches = (): Branch[] => {
  const storedBranches = localStorage.getItem('branches');
  if (storedBranches) {
    return JSON.parse(storedBranches);
  }
  return [
    { id: "1", name: "Abdoun" },
    { id: "2", name: "Abdali" },
    { id: "3", name: "7th Circle" },
    { id: "4", name: "Yasmeen" },
    { id: "5", name: "Abdoun Circle" }
  ];
};

export let branches: Branch[] = getStoredBranches();

export const addBranch = (name: string) => {
  if (branches.some(branch => branch.name.toLowerCase() === name.toLowerCase())) {
    throw new Error("Branch with this name already exists");
  }

  const maxId = Math.max(...branches.map(branch => parseInt(branch.id)));
  const newBranch = {
    id: (maxId + 1).toString(),
    name,
  };
  branches = [...branches, newBranch];
  
  // Save to localStorage
  localStorage.setItem('branches', JSON.stringify(branches));
  return newBranch;
};

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

const calculateAverageData = (branchesData: any[]) => {
  const initialValue = {
    streaks: { handover: 0, deposits: 0, invoices: 0 },
    longestStreaks: { handover: 0, deposits: 0, invoices: 0 },
    totalSubmissions: { handover: 0, deposits: 0, invoices: 0 },
    approvedSubmissions: { handover: 0, deposits: 0, invoices: 0 },
    rejectedSubmissions: { handover: 0, deposits: 0, invoices: 0 }
  };

  const sum = branchesData.reduce((acc, curr) => ({
    streaks: {
      handover: acc.streaks.handover + curr.streaks.handover,
      deposits: acc.streaks.deposits + curr.streaks.deposits,
      invoices: acc.streaks.invoices + curr.streaks.invoices
    },
    longestStreaks: {
      handover: acc.longestStreaks.handover + curr.longestStreaks.handover,
      deposits: acc.longestStreaks.deposits + curr.longestStreaks.deposits,
      invoices: acc.longestStreaks.invoices + curr.longestStreaks.invoices
    },
    totalSubmissions: {
      handover: acc.totalSubmissions.handover + curr.totalSubmissions.handover,
      deposits: acc.totalSubmissions.deposits + curr.totalSubmissions.deposits,
      invoices: acc.totalSubmissions.invoices + curr.totalSubmissions.invoices
    },
    approvedSubmissions: {
      handover: acc.approvedSubmissions.handover + curr.approvedSubmissions.handover,
      deposits: acc.approvedSubmissions.deposits + curr.approvedSubmissions.deposits,
      invoices: acc.approvedSubmissions.invoices + curr.approvedSubmissions.invoices
    },
    rejectedSubmissions: {
      handover: acc.rejectedSubmissions.handover + curr.rejectedSubmissions.handover,
      deposits: acc.rejectedSubmissions.deposits + curr.rejectedSubmissions.deposits,
      invoices: acc.rejectedSubmissions.invoices + curr.rejectedSubmissions.invoices
    }
  }), initialValue);

  const count = branchesData.length;
  return {
    streaks: {
      handover: Math.round(sum.streaks.handover / count),
      deposits: Math.round(sum.streaks.deposits / count),
      invoices: Math.round(sum.streaks.invoices / count)
    },
    longestStreaks: {
      handover: Math.round(sum.longestStreaks.handover / count),
      deposits: Math.round(sum.longestStreaks.deposits / count),
      invoices: Math.round(sum.longestStreaks.invoices / count)
    },
    totalSubmissions: {
      handover: Math.round(sum.totalSubmissions.handover / count),
      deposits: Math.round(sum.totalSubmissions.deposits / count),
      invoices: Math.round(sum.totalSubmissions.invoices / count)
    },
    approvedSubmissions: {
      handover: Math.round(sum.approvedSubmissions.handover / count),
      deposits: Math.round(sum.approvedSubmissions.deposits / count),
      invoices: Math.round(sum.approvedSubmissions.invoices / count)
    },
    rejectedSubmissions: {
      handover: Math.round(sum.rejectedSubmissions.handover / count),
      deposits: Math.round(sum.rejectedSubmissions.deposits / count),
      invoices: Math.round(sum.rejectedSubmissions.invoices / count)
    }
  };
};

const generateSubmissionHistory = (branchId: string, dateRange: string) => {
  const days = dateRange === "7d" ? 7 : 
              dateRange === "30d" ? 30 : 
              dateRange === "90d" ? 90 : 180;
  
  const data = [];
  const baseMultiplier = branchId === "all" ? 1 : parseInt(branchId);
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const successRate = Math.min(100, Math.max(0, 
      70 + (Math.sin(i * 0.1) * 20) + (Math.random() * 10)
    ));
    
    data.push({
      date: date.toISOString().split('T')[0],
      successRate,
      handover: Math.round(Math.random() * 5 * baseMultiplier),
      deposits: Math.round(Math.random() * 4 * baseMultiplier),
      invoices: Math.round(Math.random() * 3 * baseMultiplier)
    });
  }
  
  return data;
};

export const generateMockData = (branchId: string, dateRange: string = "7d") => {
  const dateMultiplier = dateRange === "7d" ? 1 : 
                        dateRange === "30d" ? 2 :
                        dateRange === "90d" ? 3 : 4;

  if (branchId === "all") {
    // Calculate average data from all branches
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