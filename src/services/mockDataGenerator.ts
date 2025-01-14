const getProcessedRecords = () => {
  const storedRecords = localStorage.getItem('processedRecords');
  return storedRecords ? JSON.parse(storedRecords) : [];
};

const calculateStreakFromStatus = (records: any[], statusKey: string) => {
  if (!records.length) return { currentStreak: 0, longestStreak: 0 };

  // Sort records by date in ascending order (oldest first)
  const sortedRecords = [...records].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let lastDate: Date | null = null;

  for (const record of sortedRecords) {
    const currentDate = new Date(record.date);
    
    if (record[statusKey] === 'Approved') {
      if (!lastDate) {
        // First approved record
        currentStreak = 1;
      } else {
        const dayDifference = Math.floor(
          (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (dayDifference <= 1) {
          // Consecutive day or same day
          currentStreak++;
        } else {
          // Gap in dates, reset streak
          currentStreak = 1;
        }
      }
      lastDate = currentDate;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      // Reset streak on non-approved records
      currentStreak = 0;
      lastDate = null;
    }
  }

  return { currentStreak, longestStreak };
};

const calculateStreaks = (records: any[], branchId: string) => {
  const filteredRecords = branchId === 'all' 
    ? records 
    : records.filter(record => record.branchName === branchId);

  const handoverResult = calculateStreakFromStatus(filteredRecords, 'handoverStatus');
  const depositResult = calculateStreakFromStatus(filteredRecords, 'depositStatus');
  const invoiceResult = calculateStreakFromStatus(filteredRecords, 'invoiceStatus');

  return {
    handover: handoverResult.currentStreak,
    deposits: depositResult.currentStreak,
    invoices: invoiceResult.currentStreak,
  };
};

const calculateLongestStreaks = (records: any[], branchId: string) => {
  const filteredRecords = branchId === 'all' 
    ? records 
    : records.filter(record => record.branchName === branchId);

  const handoverResult = calculateStreakFromStatus(filteredRecords, 'handoverStatus');
  const depositResult = calculateStreakFromStatus(filteredRecords, 'depositStatus');
  const invoiceResult = calculateStreakFromStatus(filteredRecords, 'invoiceStatus');

  return {
    handover: handoverResult.longestStreak,
    deposits: depositResult.longestStreak,
    invoices: invoiceResult.longestStreak,
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
    handover: filteredRecords.filter(r => r.handoverStatus === 'Approved').length,
    deposits: filteredRecords.filter(r => r.depositStatus === 'Approved').length,
    invoices: filteredRecords.filter(r => r.invoiceStatus === 'Approved').length,
  };
};

const calculateRejectedSubmissions = (records: any[], branchId: string) => {
  const filteredRecords = branchId === 'all' 
    ? records 
    : records.filter(record => record.branchName === branchId);

  return {
    handover: filteredRecords.filter(r => r.handoverStatus === 'Rejected').length,
    deposits: filteredRecords.filter(r => r.depositStatus === 'Rejected').length,
    invoices: filteredRecords.filter(r => r.invoiceStatus === 'Rejected').length,
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
      r.handoverStatus === 'Approved' && 
      r.depositStatus === 'Approved' && 
      r.invoiceStatus === 'Approved'
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