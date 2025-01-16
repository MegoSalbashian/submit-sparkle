import React from "react";
import { DateRangeSelector } from "@/components/DateRangeSelector";

interface DateRangeFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const DateRangeFilter = ({ value, onValueChange }: DateRangeFilterProps) => {
  return (
    <DateRangeSelector 
      value={value} 
      onValueChange={onValueChange} 
    />
  );
};