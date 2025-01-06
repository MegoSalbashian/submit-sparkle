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

export let branches: Branch[] = [
  { id: "1", name: "Abdoun" },
  { id: "2", name: "Abdali" },
  { id: "3", name: "7th Circle" },
  { id: "4", name: "Yasmeen" },
  { id: "5", name: "Abdoun Circle" }
];

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
  return newBranch;
};

export const generateMockData = (branchId: string, dateRange: string = "7d") => {
  // Return empty data structure
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
    },
    submissionHistory: [
      { date: "Mon", handover: 0, deposits: 0, invoices: 0 },
      { date: "Tue", handover: 0, deposits: 0, invoices: 0 },
      { date: "Wed", handover: 0, deposits: 0, invoices: 0 },
      { date: "Thu", handover: 0, deposits: 0, invoices: 0 },
      { date: "Fri", handover: 0, deposits: 0, invoices: 0 },
      { date: "Sat", handover: 0, deposits: 0, invoices: 0 },
      { date: "Sun", handover: 0, deposits: 0, invoices: 0 },
    ],
  };
};