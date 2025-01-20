import React from "react";

interface RecordStatusProps {
  status: string;
  label: string;
}

export const RecordStatus = ({ status, label }: RecordStatusProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-green-600';
      case 'missing':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <span className={getStatusColor(status)}>
      {label}
    </span>
  );
};