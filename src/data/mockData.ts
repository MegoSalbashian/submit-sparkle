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

export const generateMockData = (branchId: string) => {
  // If a specific branch is selected, return that branch's data
  if (branchId !== "all" && branchData[branchId as keyof typeof branchData]) {
    const data = branchData[branchId as keyof typeof branchData];
    return {
      streaks: data.streaks,
      longestStreaks: data.longestStreaks,
      totalSubmissions: {
        handover: 45,
        deposits: 42,
        invoices: 38,
      },
      approvedSubmissions: {
        handover: 42,
        deposits: 40,
        invoices: 35,
      },
      rejectedSubmissions: {
        handover: 3,
        deposits: 2,
        invoices: 3,
      },
      submissionHistory: [
        { date: "Mon", handover: 2, deposits: 1, invoices: 2 },
        { date: "Tue", handover: 2, deposits: 2, invoices: 1 },
        { date: "Wed", handover: 1, deposits: 1, invoices: 2 },
        { date: "Thu", handover: 2, deposits: 2, invoices: 1 },
        { date: "Fri", handover: 2, deposits: 1, invoices: 2 },
        { date: "Sat", handover: 1, deposits: 2, invoices: 1 },
        { date: "Sun", handover: 2, deposits: 1, invoices: 2 },
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
      handover: 180,
      deposits: 168,
      invoices: 152,
    },
    approvedSubmissions: {
      handover: 168,
      deposits: 160,
      invoices: 140,
    },
    rejectedSubmissions: {
      handover: 12,
      deposits: 8,
      invoices: 12,
    },
    submissionHistory: [
      { date: "Mon", handover: 8, deposits: 4, invoices: 8 },
      { date: "Tue", handover: 8, deposits: 8, invoices: 4 },
      { date: "Wed", handover: 4, deposits: 4, invoices: 8 },
      { date: "Thu", handover: 8, deposits: 8, invoices: 4 },
      { date: "Fri", handover: 8, deposits: 4, invoices: 8 },
      { date: "Sat", handover: 4, deposits: 8, invoices: 4 },
      { date: "Sun", handover: 8, deposits: 4, invoices: 8 },
    ],
  };
};