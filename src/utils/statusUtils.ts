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
  const statusKey = `${type}_status`;
  const total = records.length;
  
  // Explicitly count approved records
  const approved = records.filter(record => {
    const status = record[statusKey]?.toLowerCase();
    return status === 'approved';
  }).length;

  // Calculate rejected as those that are not approved
  const rejected = records.filter(record => {
    const status = record[statusKey]?.toLowerCase();
    return status !== 'approved' && status !== null;
  }).length;

  const { currentStreak, longestStreak } = calculateStreak(records, type);

  return {
    total,
    approved,
    rejected,
    streak: currentStreak,
    longestStreak
  };
};

export const calculateBranchStreak = (records: any[], type: string): number => {
  let streak = 0;
  const statusKey = `${type}_status`;
  
  for (const record of records) {
    const status = record[statusKey]?.toLowerCase();
    if (status === 'approved') {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};