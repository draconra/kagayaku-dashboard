
"use client";

import { useActionState } from "react"; 
import { useFormStatus } from "react-dom"; 
import { useEffect, useState } from "react";
import { saveAppointmentAction, type SaveAppointmentActionState } from "./actions";
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    state.formData?.dateTime ? new Date(state.formData.dateTime.split('T')[0] + 'T00:00:00') : undefined
  );

  useEffect(() => {
    if (state.error && !state.successMessage) { 
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
    }
    if (state.successMessage) {
      toast({
        title: "Success",
        description: state.successMessage,
        variant: "default",
      });
      setSelectedDate(undefined); 
      // Note: For a full form reset after successful submission with useActionState,
      // you might need to re-key the form component or manage input values more directly
      // if defaultValues alone aren't clearing as expected on subsequent submissions without a page reload.
      // For now, clearing selectedDate is a partial reset.
    }
  }, [state.error, state.successMessage, toast]);

  const defaultTime = state.formData?.dateTime ? state.formData.dateTime.split('T')[1] : "";
  const defaultClientName = state.formData?.clientName || "";
  const defaultClientEmail = state.formData?.clientEmail || "hudajamilah.consulting@gmail.com";
  const defaultServiceDescription = state.formData?.serviceDescription || "";
  const defaultNotes = state.formData?.notes || "";

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle>Appointment Details</CardTitle>
        <CardDescription>
          Enter the client and service information for the new appointment. This will also create an event in Google Calendar for kagayakustudio2024@gmail.com.
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
              <Popover>
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
                    }}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
                  />
                </PopoverContent>
              </Popover>
              <input type="hidden" name="appointmentDate" value={selectedDate ? selectedDate.toISOString().split('T')[0] : ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointmentTime">Appointment Time</Label>
              <Input
                id="appointmentTime"
                name="appointmentTime"
                type="time"
                defaultValue={defaultTime}
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
       {state.error && !state.successMessage && (
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
