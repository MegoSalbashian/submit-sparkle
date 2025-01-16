export const isSuccessfulStatus = (type: string, status: string | null) => {
  if (!status) return false;
  status = status.toLowerCase();
  
  // All types use the same logic - if status is 'approved', it's successful
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
  
  // Add detailed logging for debugging
  console.log(`Raw records for ${type}:`, records);
  
  // Count approved records with detailed logging
  const approved = records.filter(record => {
    const status = record[statusKey];
    console.log(`Record ${type} status:`, {
      recordId: record.id,
      status: status,
      isApproved: status === 'approved',
      statusKey: statusKey,
      rawValue: record[statusKey]
    });
    return status === 'approved';
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
    statusKey,
    firstRecordStatus: records[0]?.[statusKey],
    allStatuses: records.map(r => ({ id: r.id, status: r[statusKey] }))
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
    const status = record[statusKey]?.toLowerCase();
    if (status === 'approved') {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};