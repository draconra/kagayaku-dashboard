
import { AppointmentForm } from "./appointment-form";
import { CalendarPlus } from "lucide-react";

export default function CreateAppointmentPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-2xl">
      <div className="mb-8 text-center">
        <CalendarPlus className="w-12 h-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create New Appointment
        </h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details below to schedule a new appointment. This will also create an event in Google Calendar.
        </p>
      </div>
      <AppointmentForm />
    </div>
  );
}
