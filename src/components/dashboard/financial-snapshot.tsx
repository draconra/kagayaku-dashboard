
"use client"; // This component uses Recharts which is client-side

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, TrendingDown, PlusCircle, Edit2, Trash2, Filter } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { FinancialEntryForm } from "@/components/financials/financial-entry-form"; 
import { format, getYear, getMonth, parseISO } from "date-fns";

// Define the structure for a financial entry
export interface FinancialEntry {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  amount: number;
  type: 'revenue' | 'expense';
}

// Helper to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

const currentYear = getYear(new Date());
const years = Array.from({ length: 10 }, (_, i) => (currentYear - 5 + i).toString());
const months = [
  { value: "01", label: "January" }, { value: "02", label: "February" },
  { value: "03", label: "March" }, { value: "04", label: "April" },
  { value: "05", label: "May" }, { value: "06", label: "June" },
  { value: "07", label: "July" }, { value: "08", label: "August" },
  { value: "09", label: "September" }, { value: "10", label: "October" },
  { value: "11", label: "November" }, { value: "12", label: "December" },
];


export function FinancialSnapshot() {
  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>([
    // Sample Data - this will be lost on page refresh
    { id: '1', date: `${currentYear}-01-15`, description: 'Initial Client Project A', amount: 25000000, type: 'revenue' },
    { id: '2', date: `${currentYear}-01-20`, description: 'Software Subscription', amount: 750000, type: 'expense' },
    { id: '3', date: `${currentYear}-02-10`, description: 'Client Project B', amount: 18000000, type: 'revenue' },
    { id: '4', date: `${currentYear}-02-18`, description: 'Office Supplies', amount: 300000, type: 'expense' },
  ]);

  const [selectedMonth, setSelectedMonth] = useState<string>((getMonth(new Date()) + 1).toString().padStart(2, '0')); // Default to current month
  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString()); // Default to current year
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinancialEntry | null>(null);

  const filteredEntries = useMemo(() => {
    return financialEntries.filter(entry => {
      const entryDate = parseISO(entry.date);
      const entryYear = getYear(entryDate).toString();
      const entryMonth = (getMonth(entryDate) + 1).toString().padStart(2, '0');
      
      const yearMatch = !selectedYear || entryYear === selectedYear;
      const monthMatch = !selectedMonth || entryMonth === selectedMonth;
      
      return yearMatch && monthMatch;
    });
  }, [financialEntries, selectedMonth, selectedYear]);

  const { revenue, expenses, netProfit } = useMemo(() => {
    const currentRevenue = filteredEntries
      .filter(entry => entry.type === 'revenue')
      .reduce((sum, entry) => sum + entry.amount, 0);
    const currentExpenses = filteredEntries
      .filter(entry => entry.type === 'expense')
      .reduce((sum, entry) => sum + entry.amount, 0);
    return {
      revenue: currentRevenue,
      expenses: currentExpenses,
      netProfit: currentRevenue - currentExpenses,
    };
  }, [filteredEntries]);

  const chartData = [
    { name: "Revenue", value: revenue, fill: "var(--color-chart-1)" },
    { name: "Expenses", value: expenses, fill: "var(--color-chart-2)" },
    { name: "Profit", value: netProfit, fill: "var(--color-chart-3)" },
  ];

  const handleSaveEntry = (entryData: Omit<FinancialEntry, 'id'> & { id?: string }) => {
    if (entryData.id) { // Editing existing entry
      setFinancialEntries(prev => prev.map(e => e.id === entryData.id ? { ...e, ...entryData, amount: Number(entryData.amount) } as FinancialEntry : e));
    } else { // Adding new entry
      setFinancialEntries(prev => [...prev, { ...entryData, id: Date.now().toString() + Math.random().toString(36).substring(2,9), amount: Number(entryData.amount) } as FinancialEntry]);
    }
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  const handleAddNewEntry = () => {
    setEditingEntry(null);
    setIsFormOpen(true);
  };

  const handleEditEntry = (entry: FinancialEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setFinancialEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  useEffect(() => {
    // If the dialog closes, ensure editingEntry is reset
    if (!isFormOpen) {
      setEditingEntry(null);
    }
  }, [isFormOpen]);

  const financialSnapshotCard = (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-primary" />
              Financial Snapshot
            </CardTitle>
            <CardDescription>Summary for the selected period (in IDR). Data is not persisted.</CardDescription>
          </div>
           <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNewEntry} size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <FinancialEntryForm
                entry={editingEntry}
                onSave={handleSaveEntry}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center border-t pt-4">
          <Filter className="w-5 h-5 text-muted-foreground hidden sm:block" />
          <div className="flex gap-2 items-center w-full sm:w-auto">
            <Label htmlFor="year-filter" className="text-sm shrink-0">Year:</Label>
            <Select 
              value={selectedYear} 
              onValueChange={(value) => setSelectedYear(value === "all-years-option" ? "" : value)}
            >
              <SelectTrigger id="year-filter" className="w-full sm:w-[120px]">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-years-option">All Years</SelectItem>
                {years.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 items-center w-full sm:w-auto">
            <Label htmlFor="month-filter" className="text-sm shrink-0">Month:</Label>
            <Select 
              value={selectedMonth} 
              onValueChange={(value) => setSelectedMonth(value === "all-months-option" ? "" : value)}
            >
              <SelectTrigger id="month-filter" className="w-full sm:w-[160px]">
                <SelectValue placeholder="All Months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-months-option">All Months</SelectItem>
                {months.map(month => <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
          <div className="p-4 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingUp className="w-5 h-5 text-green-500" /> Total Revenue
            </div>
            <div className="text-2xl font-bold">{formatCurrency(revenue)}</div>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingDown className="w-5 h-5 text-red-500" /> Total Expenses
            </div>
            <div className="text-2xl font-bold">{formatCurrency(expenses)}</div>
          </div>
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <DollarSign className="w-5 h-5" /> Net Profit
            </div>
            <div className="text-2xl font-bold text-primary">{formatCurrency(netProfit)}</div>
          </div>
        </div>
        
        {filteredEntries.length > 0 ? (
          <div className="h-[200px] w-full mb-6">
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
        ) : (
          <p className="text-center text-muted-foreground mb-6">No financial data for the selected period.</p>
        )}

        <CardTitle className="text-xl mb-3 pt-4 border-t">Financial Entries</CardTitle>
        {filteredEntries.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount (IDR)</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.sort((a,b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()).map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{format(parseISO(entry.date), "PPP")}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{entry.description}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        entry.type === 'revenue' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(entry.amount)}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" onClick={() => handleEditEntry(entry)} className="mr-2 h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteEntry(entry.id)} className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-destructive" />
                         <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No entries match the current filter.</p>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-4">
        Note: Financial data is stored locally in the browser and will be lost on page refresh.
      </CardFooter>
    </Card>
  );

  return financialSnapshotCard;
}


    
