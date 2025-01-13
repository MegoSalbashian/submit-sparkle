export type StreakData = {
  handover: number;
  deposits: number;
  invoices: number;
};

export type SubmissionType = keyof StreakData;

export const calculateAverageData = (branchesData: any[]) => {
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