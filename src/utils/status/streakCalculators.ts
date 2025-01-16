import { isSuccessfulStatus } from './statusCheckers';

export const calculateStreak = (records: any[], type: string): { currentStreak: number; longestStreak: number } => {
  let currentStreak = 0;
  let longestStreak = 0;
  
  console.log(`Calculating streak for ${type} with records:`, records);

  for (const record of records) {
    const statusKey = type === 'deposits' ? 'deposit_status' : 
                     type === 'handover' ? 'handover_status' : 
                     'invoice_status';
                     
    console.log(`Checking record for ${type}:`, {
      recordId: record.id,
      statusKey,
      status: record[statusKey]
    });

    if (isSuccessfulStatus(type, record[statusKey])) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      break;
    }
  }

  console.log(`Streak calculation result for ${type}:`, { currentStreak, longestStreak });
  return { currentStreak, longestStreak };
};

export const calculateBranchStreak = (records: any[], type: string): number => {
  const statusKey = type === 'deposits' ? 'deposit_status' : 
                   type === 'handover' ? 'handover_status' : 
                   'invoice_status';
  
  console.log(`Calculating branch streak for ${type}:`, {
    recordCount: records.length,
    statusKey,
    records: records.map(r => ({
      id: r.id,
      status: r[statusKey],
      date: r.date
    }))
  });
  
  let streak = 0;
  
  for (const record of records) {
    const status = record[statusKey];
    const isApproved = isSuccessfulStatus(type, status);
    
    console.log(`Checking record for branch streak (${type}):`, {
      recordId: record.id,
      status,
      isApproved
    });
    
    if (isApproved) {
      streak++;
    } else {
      break;
    }
  }

  console.log(`Branch streak result for ${type}:`, { streak });
  return streak;
};