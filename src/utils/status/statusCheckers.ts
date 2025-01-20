export const isSuccessfulStatus = (type: string, status: string | null) => {
  console.log(`Checking ${type} status:`, { status });
  if (!status) return false;
  
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
  const isMissing = normalizedStatus === 'missing';
  
  console.log(`Status check:`, { 
    status, 
    normalizedStatus,
    isMissing,
    type
  });
  
  return isMissing;
};