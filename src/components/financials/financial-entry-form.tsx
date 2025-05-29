
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { FinancialEntry } from "@/components/dashboard/financial-snapshot"; // Adjust path as needed
import { useEffect, useState } from "react";
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface FinancialEntryFormProps {
  entry?: FinancialEntry | null;
  onSave: (entry: Omit<FinancialEntry, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

export function FinancialEntryForm({ entry, onSave, onCancel }: FinancialEntryFormProps) {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [type, setType] = useState<'revenue' | 'expense'>('revenue');

  useEffect(() => {
    if (entry) {
      setDate(entry.date);
      setDescription(entry.description);
      setAmount(entry.amount);
      setType(entry.type);
    } else {
      // Default to today's date for new entries
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setDescription('');
      setAmount('');
      setType('revenue');
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount === '' || isNaN(Number(amount))) {
      alert("Please enter a valid amount.");
      return;
    }
    onSave({
      id: entry?.id,
      date,
      description,
      amount: Number(amount),
      type,
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{entry ? 'Edit Financial Entry' : 'Add New Financial Entry'}</DialogTitle>
        <DialogDescription>
          {entry ? 'Update the details of the financial entry.' : 'Enter the details for the new financial entry.'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="text-sm"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Client payment, Software subscription"
            required
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount (IDR)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
            placeholder="e.g., 1500000"
            required
            className="text-sm"
          />
        </div>
        <div>
          <Label>Type</Label>
          <RadioGroup
            value={type}
            onValueChange={(value: 'revenue' | 'expense') => setType(value)}
            className="flex space-x-4 pt-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="revenue" id="revenue" />
              <Label htmlFor="revenue">Revenue</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="expense" id="expense" />
              <Label htmlFor="expense">Expense</Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter className="pt-4">
          <DialogClose asChild>
             <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </DialogClose>
          <Button type="submit">{entry ? 'Save Changes' : 'Add Entry'}</Button>
        </DialogFooter>
      </form>
    </>
  );
}
