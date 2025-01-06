import { cn } from "@/lib/utils";

interface StreakCounterProps {
  value: number;
  label: string;
  type: "handover" | "deposits" | "invoices";
}

export const StreakCounter = ({ value, label, type }: StreakCounterProps) => {
  const getStreakColor = (value: number) => {
    if (value >= 30) return "bg-gradient-to-r from-purple-500 to-purple-700";
    if (value >= 20) return "bg-gradient-to-r from-red-500 to-orange-500";
    if (value >= 10) return "bg-gradient-to-r from-orange-400 to-yellow-500";
    return "bg-gradient-to-r from-blue-400 to-blue-600";
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className={cn(
          "rounded-full w-24 h-24 flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-105",
          getStreakColor(value)
        )}
      >
        <span className="text-4xl font-bold">{value}</span>
      </div>
      <span className="mt-2 text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
};