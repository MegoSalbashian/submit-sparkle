export const isSuccessfulStatus = (type: string, status: string | null) => {
  if (!status) return false;
  status = status.toLowerCase();
  
  switch(type) {
    case 'handover':
      return status === 'approved';
    case 'deposits':
      return status === 'approved';
    case 'invoices':
      return status === 'approved';
    default:
      return false;
  }
};

export const calculateStreak = (records: any[], type: string): { currentStreak: number; longestStreak: number } => {
  let currentStreak = 0;
  let longestStreak = 0;

  for (const record of records) {
    const statusKey = `${type}_status`;
    if (isSuccessfulStatus(type, record[statusKey])) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      break;
    }
  }

  return { currentStreak, longestStreak };
};

export const calculateMetrics = (records: any[], type: string) => {
  const total = records.length;
  const approved = records.filter(r => isSuccessfulStatus(type, r[`${type}_status`])).length;
  const { currentStreak, longestStreak } = calculateStreak(records, type);

  return {
    total,
    approved,
    rejected: total - approved,
    streak: currentStreak,
    longestStreak
  };
};

export const calculateBranchStreak = (records: any[], type: string): number => {
  let streak = 0;
  for (const record of records) {
    if (isSuccessfulStatus(type, record[`${type}_status`])) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};