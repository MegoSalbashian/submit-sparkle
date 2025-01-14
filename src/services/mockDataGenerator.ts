const getProcessedRecords = () => {
  const storedRecords = localStorage.getItem('processedRecords');
  return storedRecords ? JSON.parse(storedRecords) : [];
};

const calculateStreakFromStatus = (records: any[], statusKey: string) => {
  // Sort records by date in descending order (newest first)
  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let previousDate: Date | null = null;

  // Calculate current streak
  for (const record of sortedRecords) {
    const currentDate = new Date(record.date);
    
    if (record[statusKey] === 'approved') {
      // If this is the first approved record
      if (previousDate === null) {
        currentStreak = 1;
      } else {
        // Check if the dates are consecutive
        const dayDifference = Math.floor(
          (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (dayDifference === 1) {
          currentStreak++;
        } else {
          break; // Break streak if days are not consecutive
        }
      }
      previousDate = currentDate;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      break; // Break on first non-approved record
    }
  }

  return { currentStreak, longestStreak };
};

const calculateStreaks = (records: any[], branchId: string) => {
  const filteredRecords = branchId === 'all' 
    ? records 
    : records.filter(record => record.branchName === branchId);

  const handoverStreak = calculateStreakFromStatus(filteredRecords, 'handoverStatus');
  const depositStreak = calculateStreakFromStatus(filteredRecords, 'depositStatus');
  const invoiceStreak = calculateStreakFromStatus(filteredRecords, 'invoiceStatus');

  return {
    handover: handoverStreak.currentStreak,
    deposits: depositStreak.currentStreak,
    invoices: invoiceStreak.currentStreak,
  };
};

const calculateLongestStreaks = (records: any[], branchId: string) => {
  const filteredRecords = branchId === 'all' 
    ? records 
    : records.filter(record => record.branchName === branchId);

  const handoverStreak = calculateStreakFromStatus(filteredRecords, 'handoverStatus');
  const depositStreak = calculateStreakFromStatus(filteredRecords, 'depositStatus');
  const invoiceStreak = calculateStreakFromStatus(filteredRecords, 'invoiceStatus');

  return {
    handover: handoverStreak.longestStreak,
    deposits: depositStreak.longestStreak,
    invoices: invoiceStreak.longestStreak,
  };
};

const calculateSubmissions = (records: any[], branchId: string) => {
  const filteredRecords = branchId === 'all' 
    ? records 
    : records.filter(record => record.branchName === branchId);

  return {
    handover: filteredRecords.length,
    deposits: filteredRecords.length,
    invoices: filteredRecords.length,
  };
};

const calculateApprovedSubmissions = (records: any[], branchId: string) => {
  const filteredRecords = branchId === 'all' 
    ? records 
    : records.filter(record => record.branchName === branchId);

  return {
    handover: filteredRecords.filter(r => r.handoverStatus === 'approved').length,
    deposits: filteredRecords.filter(r => r.depositStatus === 'approved').length,
    invoices: filteredRecords.filter(r => r.invoiceStatus === 'approved').length,
  };
};

const calculateRejectedSubmissions = (records: any[], branchId: string) => {
  const filteredRecords = branchId === 'all' 
    ? records 
    : records.filter(record => record.branchName === branchId);

  return {
    handover: filteredRecords.filter(r => r.handoverStatus === 'rejected').length,
    deposits: filteredRecords.filter(r => r.depositStatus === 'rejected').length,
    invoices: filteredRecords.filter(r => r.invoiceStatus === 'rejected').length,
  };
};

const generateSubmissionHistory = (records: any[], branchId: string, dateRange: string) => {
  const days = dateRange === "7d" ? 7 : 
              dateRange === "30d" ? 30 : 
              dateRange === "90d" ? 90 : 180;
  
  const filteredRecords = branchId === 'all' 
    ? records 
    : records.filter(record => record.branchName === branchId);
  
  const data = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const currentDate = date.toISOString().split('T')[0];
    
    const dayRecords = filteredRecords.filter(record => record.date === currentDate);
    const totalRecords = dayRecords.length;
    const approvedRecords = dayRecords.filter(r => 
      r.handoverStatus === 'approved' && 
      r.depositStatus === 'approved' && 
      r.invoiceStatus === 'approved'
    ).length;

    const successRate = totalRecords > 0 
      ? (approvedRecords / totalRecords) * 100 
      : 0;
    
    data.push({
      date: currentDate,
      successRate: Number(successRate.toFixed(1))
    });
  }
  
  return data;
};

export const generateMockData = (branchId: string, dateRange: string = "7d") => {
  const records = getProcessedRecords();

  return {
    streaks: calculateStreaks(records, branchId),
    longestStreaks: calculateLongestStreaks(records, branchId),
    totalSubmissions: calculateSubmissions(records, branchId),
    approvedSubmissions: calculateApprovedSubmissions(records, branchId),
    rejectedSubmissions: calculateRejectedSubmissions(records, branchId),
    submissionHistory: generateSubmissionHistory(records, branchId, dateRange)
  };
};