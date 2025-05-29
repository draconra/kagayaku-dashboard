
"use client"; // This component uses Recharts which is client-side

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

const financialData = {
  revenue: 78500000, // Assuming example value in IDR
  expenses: 23400000, // Assuming example value in IDR
};
const netProfit = financialData.revenue - financialData.expenses;

const chartData = [
  { name: "Revenue", value: financialData.revenue, fill: "var(--color-chart-1)" },
  { name: "Expenses", value: financialData.expenses, fill: "var(--color-chart-2)" },
  { name: "Profit", value: netProfit, fill: "var(--color-chart-3)" },
];

// Helper to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

export function FinancialSnapshot() {
  const financialSnapshotCard = (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-primary" />
          Financial Snapshot
        </CardTitle>
        <CardDescription>Summary for the current period (in IDR).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
          <div className="p-4 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingUp className="w-5 h-5 text-green-500" /> Total Revenue
            </div>
            <div className="text-2xl font-bold">{formatCurrency(financialData.revenue)}</div>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingDown className="w-5 h-5 text-red-500" /> Total Expenses
            </div>
            <div className="text-2xl font-bold">{formatCurrency(financialData.expenses)}</div>
          </div>
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <DollarSign className="w-5 h-5" /> Net Profit
            </div>
            <div className="text-2xl font-bold text-primary">{formatCurrency(netProfit)}</div>
          </div>
        </div>
        
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
              <YAxis 
                stroke="hsl(var(--foreground))" 
                fontSize={12} 
                tickFormatter={(value) => `Rp${value/1000000}jt`} 
                label={{ value: '(in millions IDR)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize:10, dy: 40 }}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--accent) / 0.3)" }}
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  return financialSnapshotCard;
}
