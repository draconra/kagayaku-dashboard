
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { saveAppointmentAction, type SaveAppointmentActionState, type FormDataType } from "./actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, CheckCircle2, AlertCircle, Mail } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialState: SaveAppointmentActionState = {};

const serviceOptions = [
  "Premium Personal Color",
  "Daily Personal Color",
  "Express Personal Color",
  "Group Personal Color",
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving Appointment...
        </>
      ) : (
        "Save Appointment"
      )}
    </Button>
  );
}

export function AppointmentForm() {
  const [state, formAction] = useActionState(saveAppointmentAction, initialState);
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    if (state.formData?.appointmentDate) {
      // Ensure correct parsing, assuming YYYY-MM-DD format from form state
      const parts = state.formData.appointmentDate.split('-');
      if (parts.length === 3) {
        return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      }
    }
    return undefined;
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (state.successMessage) {
      toast({
        title: "Success",
        description: state.successMessage,
        variant: "default",
      });
      setSelectedDate(undefined);
      // Consider a full form reset here if needed, e.g., by re-keying the form or resetting state.formData in `saveAppointmentAction`
    }
  }, [state.successMessage, toast]);

  // Default values from state.formData (if present, e.g., after an error) or empty
  const defaultClientName = state.formData?.clientName || "";
  const defaultClientEmail = state.formData?.clientEmail || "";
  const defaultServiceDescription = state.formData?.serviceDescription || "";
  const defaultAppointmentTime = state.formData?.appointmentTime || "";
  const defaultNotes = state.formData?.notes || "";


  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle>Appointment Details</CardTitle>
        <CardDescription>
          Enter the client and service information for the new appointment. This will also create an event in Google Calendar for kagayakustudio2024@gmail.com, inviting the client and hudajamilah.consulting@gmail.com.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                name="clientName"
                placeholder="e.g., Airi Tanaka"
                defaultValue={defaultClientName}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="clientEmail"
                  name="clientEmail"
                  type="email"
                  placeholder="e.g., airi.tanaka@example.com"
                  defaultValue={defaultClientEmail}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="serviceDescription">Service Description</Label>
            <Select name="serviceDescription" defaultValue={defaultServiceDescription} required>
              <SelectTrigger id="serviceDescription">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {serviceOptions.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="appointmentDate">Appointment Date</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setIsCalendarOpen(false); // Close popover on date select
                    }}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
                  />
                </PopoverContent>
              </Popover>
              <input type="hidden" name="appointmentDate" value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointmentTime">Appointment Time</Label>
              <Input
                id="appointmentTime"
                name="appointmentTime"
                type="time"
                defaultValue={defaultAppointmentTime}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="e.g., Client prefers morning appointments, specific requests."
              defaultValue={defaultNotes}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>

      {state.successMessage && (
        <Alert className="m-6 border-green-500 bg-green-500/10 text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <AlertTitle className="font-semibold text-green-600 dark:text-green-300">Appointment Saved</AlertTitle>
          <AlertDescription>
            {state.successMessage}
            {state.calendarEvent?.calendarLink && (
              <a
                href={state.calendarEvent.calendarLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-sm font-medium text-primary hover:underline"
              >
                View in Google Calendar
              </a>
            )}
          </AlertDescription>
        </Alert>
      )}
       {state.error && !state.successMessage && ( // Only show if there's an error AND no success message
         <Alert variant="destructive" className="m-6">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Save Failed</AlertTitle>
          <AlertDescription>
            {state.error}
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
}
