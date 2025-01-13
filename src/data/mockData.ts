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

export const generateMockData = (branchId: string, dateRange: string = "7d") => {
  // Generate different mock data based on branch and date range
  const baseMultiplier = branchId === "all" ? 1 : parseInt(branchId);
  const dateMultiplier = dateRange === "7d" ? 1 : 
                        dateRange === "30d" ? 2 :
                        dateRange === "90d" ? 3 : 4;

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
    },
    submissionHistory: generateSubmissionHistory(branchId, dateRange),
  };
};

const generateSubmissionHistory = (branchId: string, dateRange: string) => {
  const baseMultiplier = branchId === "all" ? 1 : parseInt(branchId);
  const dateMultiplier = dateRange === "7d" ? 1 : 
                        dateRange === "30d" ? 2 :
                        dateRange === "90d" ? 3 : 4;
  
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  return days.map(day => ({
    date: day,
    handover: Math.floor(Math.random() * 5 * baseMultiplier * dateMultiplier),
    deposits: Math.floor(Math.random() * 4 * baseMultiplier * dateMultiplier),
    invoices: Math.floor(Math.random() * 3 * baseMultiplier * dateMultiplier),
  }));
};

const calculateStreak = (records: any[], type: 'handover' | 'deposits' | 'invoice') => {
  // Sort records by date in descending order
  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let previousDate: Date | null = null;

  for (const record of sortedRecords) {
    const currentDate = new Date(record.date);
    const status = type === 'handover' ? record.handoverStatus :
                   type === 'deposits' ? record.depositStatus :
                   record.invoiceStatus;

    // Only count "Completed" or "Approved" statuses
    if (status === 'Completed' || status === 'Approved') {
      if (!previousDate) {
        currentStreak = 1;
      } else {
        // Check if dates are consecutive
        const diffTime = Math.abs(previousDate.getTime() - currentDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
        } else {
          // Break in streak
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      }
      previousDate = currentDate;
    }
  }

  // Update longest streak one final time
  longestStreak = Math.max(longestStreak, currentStreak);

  return {
    current: currentStreak,
    longest: longestStreak
  };
};
