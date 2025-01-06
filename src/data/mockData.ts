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

export const branches: Branch[] = [
  { id: "1", name: "Main Branch" },
  { id: "2", name: "Downtown" },
  { id: "3", name: "Airport" },
  { id: "4", name: "Mall" },
];

const branchData = {
  "1": {
    streaks: { handover: 8, deposits: 5, invoices: 10 },
    longestStreaks: { handover: 15, deposits: 12, invoices: 20 },
  },
  "2": {
    streaks: { handover: 4, deposits: 7, invoices: 6 },
    longestStreaks: { handover: 12, deposits: 14, invoices: 16 },
  },
  "3": {
    streaks: { handover: 6, deposits: 3, invoices: 5 },
    longestStreaks: { handover: 10, deposits: 8, invoices: 12 },
  },
  "4": {
    streaks: { handover: 5, deposits: 6, invoices: 7 },
    longestStreaks: { handover: 13, deposits: 11, invoices: 15 },
  },
};

const getDateRangeMultiplier = (dateRange: string) => {
  switch (dateRange) {
    case "7d":
      return 1;
    case "30d":
      return 4;
    case "90d":
      return 12;
    case "all":
      return 24;
    default:
      return 1;
  }
};

export const generateMockData = (branchId: string, dateRange: string = "7d") => {
  const multiplier = getDateRangeMultiplier(dateRange);
  
  // If a specific branch is selected, return that branch's data
  if (branchId !== "all" && branchData[branchId as keyof typeof branchData]) {
    const data = branchData[branchId as keyof typeof branchData];
    return {
      streaks: data.streaks,
      longestStreaks: data.longestStreaks,
      totalSubmissions: {
        handover: 145 * multiplier,
        deposits: 132 * multiplier,
        invoices: 128 * multiplier,
      },
      approvedSubmissions: {
        handover: 138 * multiplier,
        deposits: 125 * multiplier,
        invoices: 120 * multiplier,
      },
      rejectedSubmissions: {
        handover: 7 * multiplier,
        deposits: 7 * multiplier,
        invoices: 8 * multiplier,
      },
      submissionHistory: [
        { date: "Mon", handover: 12, deposits: 10, invoices: 11 },
        { date: "Tue", handover: 15, deposits: 12, invoices: 13 },
        { date: "Wed", handover: 11, deposits: 9, invoices: 10 },
        { date: "Thu", handover: 14, deposits: 11, invoices: 12 },
        { date: "Fri", handover: 13, deposits: 10, invoices: 11 },
        { date: "Sat", handover: 10, deposits: 8, invoices: 9 },
        { date: "Sun", handover: 9, deposits: 7, invoices: 8 },
      ],
    };
  }

  // Return aggregated data for all branches
  return {
    streaks: {
      handover: 6,
      deposits: 4,
      invoices: 8,
    },
    longestStreaks: {
      handover: 15,
      deposits: 12,
      invoices: 20,
    },
    totalSubmissions: {
      handover: 580 * multiplier,
      deposits: 528 * multiplier,
      invoices: 512 * multiplier,
    },
    approvedSubmissions: {
      handover: 552 * multiplier,
      deposits: 500 * multiplier,
      invoices: 480 * multiplier,
    },
    rejectedSubmissions: {
      handover: 28 * multiplier,
      deposits: 28 * multiplier,
      invoices: 32 * multiplier,
    },
    submissionHistory: [
      { date: "Mon", handover: 48, deposits: 40, invoices: 44 },
      { date: "Tue", handover: 60, deposits: 48, invoices: 52 },
      { date: "Wed", handover: 44, deposits: 36, invoices: 40 },
      { date: "Thu", handover: 56, deposits: 44, invoices: 48 },
      { date: "Fri", handover: 52, deposits: 40, invoices: 44 },
      { date: "Sat", handover: 40, deposits: 32, invoices: 36 },
      { date: "Sun", handover: 36, deposits: 28, invoices: 32 },
    ],
  };
};