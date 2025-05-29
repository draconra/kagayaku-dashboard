import { AppointmentOverview } from "@/components/dashboard/appointment-overview";
import { FinancialSnapshot } from "@/components/dashboard/financial-snapshot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Welcome to Kagayaku Command Center
      </h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AppointmentOverview />
        <FinancialSnapshot />
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Additional Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            More business intelligence and key performance indicators will be displayed here.
            This section can include client satisfaction trends, popular services, or marketing campaign effectiveness.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
