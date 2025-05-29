
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarDays, Clock, PlusCircle } from "lucide-react";

const appointments = [
  { id: "1", clientName: "Airi Tanaka", serviceType: "Full Color Analysis", date: "2024-07-15", time: "10:00 AM", status: "Upcoming" },
  { id: "2", clientName: "Kenji Suzuki", serviceType: "Seasonal Palette Update", date: "2024-07-15", time: "02:00 PM", status: "Upcoming" },
  { id: "3", clientName: "Yumi Ito", serviceType: "Style Consultation", date: "2024-07-16", time: "11:30 AM", status: "Confirmed" },
  { id: "4", clientName: "Haruto Kobayashi", serviceType: "Full Color Analysis", date: "2024-07-17", time: "09:00 AM", status: "Upcoming" },
];

export function AppointmentOverview() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-primary" />
            Upcoming Appointments
          </CardTitle>
          <CardDescription>A quick look at your upcoming schedule.</CardDescription>
        </div>
        <Link href="/appointments/create" passHref>
          <Button variant="outline" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((apt) => (
              <TableRow key={apt.id}>
                <TableCell className="font-medium">{apt.clientName}</TableCell>
                <TableCell>{apt.serviceType}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                    {apt.date}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                     {apt.time}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={apt.status === "Confirmed" ? "default" : "secondary"}>
                    {apt.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {appointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No upcoming appointments.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
