export const isSuccessfulStatus = (type: string, status: string | null) => {
  if (!status) return false;
  return status === 'approved';
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
  
  console.log(`Calculating metrics for ${type}:`, {
    totalRecords: total,
    firstFewRecords: records.slice(0, 3).map(r => ({
      id: r.id,
      status: r[statusKey],
      date: r.date
    }))
  });
  
  // Count approved records
  const approved = records.filter(record => {
    const status = record[statusKey];
    const isApproved = status === 'approved';
    
    console.log(`Record ${type} check:`, {
      id: record.id,
      date: record.date,
      status: status,
      isApproved: isApproved
    });
    
    return isApproved;
  }).length;

  // Count rejected records
  const rejected = records.filter(record => {
    const status = record[statusKey];
    return status === 'rejected';
  }).length;

  const { currentStreak, longestStreak } = calculateStreak(records, type);

  console.log(`Final metrics for ${type}:`, {
    total,
    approved,
    rejected,
    currentStreak,
    longestStreak
  });

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
    const status = record[statusKey];
    if (status === 'approved') {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};