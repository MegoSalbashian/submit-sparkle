import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";
import { SubmissionType } from "@/types/dashboard";

interface StreakCounterProps {
  value: number;
  longestStreak: number;
  label: string;
  type: SubmissionType;
}

export const StreakCounter = ({ value, longestStreak, label, type }: StreakCounterProps) => {
  const getStreakColor = (value: number) => {
    if (value >= 30) return "text-purple-500";
    if (value >= 20) return "text-red-500";
    if (value >= 10) return "text-orange-500";
    return "text-blue-500";
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className={cn(
          "rounded-lg w-24 h-24 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105",
          getStreakColor(value)
        )}
      >
        <Flame className="w-12 h-12" strokeWidth={2.5} />
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <span className="mt-2 text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-xs text-muted-foreground mt-1">Longest: {longestStreak} days</span>
    </div>
  );
};