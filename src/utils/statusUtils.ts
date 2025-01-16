export const isSuccessfulStatus = (type: string, status: string | null) => {
  console.log(`Checking ${type} status:`, { status });
  if (!status) return false;
  
  // Convert to lowercase and check for exact match
  const normalizedStatus = status.toLowerCase();
  const isApproved = normalizedStatus === 'approved';
  
  console.log(`${type} status check result:`, { 
    originalStatus: status,
    normalizedStatus,
    isApproved 
  });
  
  return isApproved;
};

export const isRejectedStatus = (type: string, status: string | null) => {
  console.log(`Checking rejected status for ${type}:`, { status });
  if (!status) return false;
  
  const normalizedStatus = status.toLowerCase().trim();
  
  // For invoices, any status containing "missing" counts as rejected
  if (type === 'invoices') {
    const isMissingInvoices = normalizedStatus.includes('missing');
    console.log(`Invoice status check:`, { 
      status, 
      normalizedStatus,
      isMissingInvoices,
      type
    });
    return isMissingInvoices;
  }
  
  // For other types, check for "rejected"
  const isRejected = normalizedStatus === 'rejected';
  console.log(`Regular rejected status check:`, { 
    status, 
    normalizedStatus,
    isRejected 
  });
  return isRejected;
};

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

export const calculateMetrics = (records: any[], type: string) => {
  const statusKey = type === 'deposits' ? 'deposit_status' : 
                   type === 'handover' ? 'handover_status' : 
                   'invoice_status';
  
  console.log(`Calculating metrics for ${type} using statusKey:`, statusKey);
  console.log('Records:', records);
  
  const total = records.length;
  
  const approved = records.filter(record => {
    const status = record[statusKey];
    const isApproved = isSuccessfulStatus(type, status);
    console.log(`Checking ${type} record:`, {
      recordId: record.id,
      status,
      isApproved
    });
    return isApproved;
  }).length;

  const rejected = records.filter(record => {
    const status = record[statusKey];
    const isRejected = isRejectedStatus(type, status);
    console.log(`Checking rejected ${type} record:`, {
      recordId: record.id,
      status,
      isRejected
    });
    return isRejected;
  }).length;

  const { currentStreak, longestStreak } = calculateStreak(records, type);

  const metrics = {
    total,
    approved,
    rejected,
    streak: currentStreak,
    longestStreak
  };

  console.log(`Final metrics for ${type}:`, metrics);
  return metrics;
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