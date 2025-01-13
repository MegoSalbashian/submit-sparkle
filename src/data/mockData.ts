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

export const generateMockData = (branchId: string, dateRange: string = "7d") => {
  // For now, return mock data structure
  // In a real implementation, this would use actual records from your database
  return {
    streaks: {
      handover: 3, // Example streak
      deposits: 2,
      invoices: 1,
    },
    longestStreaks: {
      handover: 5, // Example longest streak
      deposits: 4,
      invoices: 3,
    },
    totalSubmissions: {
      handover: 10,
      deposits: 8,
      invoices: 6,
    },
    approvedSubmissions: {
      handover: 7,
      deposits: 5,
      invoices: 4,
    },
    rejectedSubmissions: {
      handover: 3,
      deposits: 3,
      invoices: 2,
    },
    submissionHistory: [
      { date: "Mon", handover: 2, deposits: 1, invoices: 1 },
      { date: "Tue", handover: 1, deposits: 2, invoices: 0 },
      { date: "Wed", handover: 3, deposits: 1, invoices: 1 },
      { date: "Thu", handover: 2, deposits: 0, invoices: 2 },
      { date: "Fri", handover: 1, deposits: 2, invoices: 1 },
      { date: "Sat", handover: 0, deposits: 1, invoices: 0 },
      { date: "Sun", handover: 1, deposits: 1, invoices: 1 },
    ],
  };
};