export const isSuccessfulStatus = (type: string, status: string | null) => {
  console.log(`Checking status for ${type}:`, { status });
  if (!status) return false;
  const isApproved = status.toLowerCase() === 'approved';
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
  
  // Log the raw records first
  console.log(`Raw records for ${type} metrics:`, JSON.stringify(records, null, 2));
  
  // Count approved records with detailed logging
  const approved = records.filter(record => {
    const status = record[statusKey];
    console.log(`Checking record for ${type}:`, {
      id: record.id,
      status: status,
      statusKey: statusKey,
      record: record
    });
    return isSuccessfulStatus(type, status);
  }).length;

  // Count rejected records
  const rejected = records.filter(record => 
    record[statusKey]?.toLowerCase() === 'rejected'
  ).length;

  const { currentStreak, longestStreak } = calculateStreak(records, type);

  // Log final metrics calculation
  console.log(`Final metrics for ${type}:`, {
    total,
    approved,
    rejected,
    streak: currentStreak,
    longestStreak,
    recordsWithStatus: records.map(r => ({
      id: r.id,
      status: r[statusKey],
      date: r.date
    }))
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
    records: records.map(r => ({
      id: r.id,
      status: r[statusKey],
      date: r.date
    }))
  });
  
  for (const record of records) {
    const status = record[statusKey];
    if (isSuccessfulStatus(type, status)) {
      streak++;
    } else {
      break;
    }
  }

  console.log(`Branch streak result for ${type}:`, { streak });
  return streak;
};