export const isSuccessfulStatus = (type: string, status: string | null) => {
  console.log(`Checking status for ${type}:`, { status });
  if (!status) return false;
  const isApproved = status === 'approved';
  console.log(`Status check result for ${type}:`, { status, isApproved });
  return isApproved;
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

  console.log(`Streak calculation for ${type}:`, { currentStreak, longestStreak });
  return { currentStreak, longestStreak };
};

export const calculateMetrics = (records: any[], type: string) => {
  const statusKey = `${type}_status`;
  const total = records.length;
  
  console.log(`Starting metrics calculation for ${type}:`, {
    totalRecords: total,
    allRecords: records.map(r => ({
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
      isApproved: isApproved,
      rawStatus: record[statusKey]
    });
    
    return isApproved;
  }).length;

  // Count rejected records
  const rejected = records.filter(record => 
    record[statusKey] === 'rejected'
  ).length;

  const { currentStreak, longestStreak } = calculateStreak(records, type);

  console.log(`Final metrics for ${type}:`, {
    total,
    approved,
    rejected,
    currentStreak,
    longestStreak,
    recordsWithApprovedStatus: records.filter(r => r[statusKey] === 'approved').length
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
  const statusKey = `${type}_status`;
  let streak = 0;
  
  console.log(`Calculating branch streak for ${type}:`, {
    recordCount: records.length,
    statuses: records.map(r => ({ id: r.id, status: r[statusKey] }))
  });
  
  for (const record of records) {
    const status = record[statusKey];
    if (status === 'approved') {
      streak++;
    } else {
      break;
    }
  }

  console.log(`Branch streak result for ${type}:`, { streak });
  return streak;
};