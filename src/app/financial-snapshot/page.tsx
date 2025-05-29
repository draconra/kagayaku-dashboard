
import { FinancialSnapshot } from "@/components/dashboard/financial-snapshot";
import { AreaChart } from "lucide-react";

export default function FinancialSnapshotPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-8 text-center">
        <AreaChart className="w-12 h-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Financial Snapshot
        </h1>
        <p className="text-muted-foreground mt-2">
          A detailed view of your studio's financial performance. Manage entries and filter by period.
        </p>
      </div>
      <div className="max-w-6xl mx-auto"> {/* Increased max-width for wider table */}
        <FinancialSnapshot />
      </div>
    </div>
  );
}

