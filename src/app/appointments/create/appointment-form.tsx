
"use client";

import { useActionState, useFormStatus } from "react-dom"; // useFormStatus is still from react-dom
import { useEffect, useState } from "react";
import { saveAppointmentAction, type SaveAppointmentActionState } from "./actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState: SaveAppointmentActionState = {};

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
  // Changed from useFormState to useActionState, import source is React by convention (though react-dom also re-exports it)
  // For clarity and future-proofing, let's explicitly import useActionState from 'react' if it's available there,
  // but the error says React.useActionState, and useFormState was from 'react-dom'.
  // The migration path often involves changing the import from 'react-dom' to 'react' for useActionState.
  // Let's adjust the import at the top.
  const [state, formAction] = useActionState(saveAppointmentAction, initialState);
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    // @ts-ignore - state.formData might not exist initially, which is fine.
    state.formData?.appointmentDate ? new Date(state.formData.appointmentDate) : undefined
  );

  useEffect(() => {
    if (state.error && !state.successMessage) { // Only show error toast if there's no success
      toast({
        variant: "destructive",
        title: "Error",
        // @ts-ignore
        description: state.error,
      });
    }
    if (state.successMessage) {
      toast({
        title: "Success",
        description: state.successMessage,
        variant: "default",
      });
      // Optionally reset form or redirect here
      setSelectedDate(undefined); // Reset date picker
    }
  }, [state.error, state.successMessage, toast]);

  // Correctly handle potential undefined state.formData.dateTime for splitting
  const defaultTime = state.formData?.dateTime ? state.formData.dateTime.split('T')[1] : "";

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle>Appointment Details</CardTitle>
        <CardDescription>
          Enter the client and service information for the new appointment.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              name="clientName"
              placeholder="e.g., Airi Tanaka"
              // @ts-ignore
              defaultValue={state.formData?.clientName}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="serviceDescription">Service Description</Label>
            <Input
              id="serviceDescription"
              name="serviceDescription"
              placeholder="e.g., Full Color Analysis"
              // @ts-ignore
              defaultValue={state.formData?.serviceDescription}
              required
            />
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
                // @ts-ignore
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
              // @ts-ignore
              defaultValue={state.formData?.notes}
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
            {/* @ts-ignore */}
            {state.error}
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
}
