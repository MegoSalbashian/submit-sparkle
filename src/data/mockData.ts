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

export const generateMockData = (branchId: string) => ({
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
});