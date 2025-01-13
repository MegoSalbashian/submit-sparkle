import React from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface BranchStreak {
  id: string;
  name: string;
  streaks: {
    handover: number;
    deposits: number;
    invoices: number;
  };
  successRate: number;
}

interface BranchOverviewTableProps {
  branches: BranchStreak[];
}

export const BranchOverviewTable = ({ branches }: BranchOverviewTableProps) => {
  return (
    <Card className="dashboard-card">
      <h3 className="text-lg font-medium mb-4">Branch Streaks Overview</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Branch</TableHead>
              <TableHead>Handover Streak</TableHead>
              <TableHead>Deposits Streak</TableHead>
              <TableHead>Invoice Streak</TableHead>
              <TableHead>Success Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell className="font-medium">{branch.name}</TableCell>
                <TableCell>{branch.streaks.handover} days</TableCell>
                <TableCell>{branch.streaks.deposits} days</TableCell>
                <TableCell>{branch.streaks.invoices} days</TableCell>
                <TableCell>{branch.successRate.toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};