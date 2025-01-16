import { isSuccessfulStatus, isRejectedStatus } from './statusCheckers';
import { calculateStreak } from './streakCalculators';
import { DashboardMetrics } from '@/types/dashboard';

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