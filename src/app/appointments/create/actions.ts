
// @ts-nocheck : This is a temporary workaround for a bug in the v1.8.0 of genkit, it will be removed in the next version.
"use server";

import { manageCalendarEventFlow, type ManageCalendarEventInput, type ManageCalendarEventOutput } from "@/ai/flows/manage-calendar-event";
import { z } from "zod";

const SaveAppointmentActionInputSchema = z.object({
  clientName: z.string().min(1, "Client name is required."),
  serviceDescription: z.string().min(1, "Service description is required."),
  appointmentDate: z.string().min(1, "Appointment date is required."), // ISO date string yyyy-mm-dd
  appointmentTime: z.string().min(1, "Appointment time is required."), // HH:mm
  notes: z.string().optional(),
  existingEventId: z.string().optional(), // For editing existing events
});

export type SaveAppointmentActionState = {
  formData?: ManageCalendarEventInput; // Using flow input type here
  error?: string;
  successMessage?: string;
  calendarEvent?: ManageCalendarEventOutput;
};

export async function saveAppointmentAction(
  prevState: SaveAppointmentActionState,
  formData: FormData
): Promise<SaveAppointmentActionState> {
  const rawFormData = Object.fromEntries(formData);

  const validatedFields = SaveAppointmentActionInputSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    // Reconstruct ManageCalendarEventInput for formData to match expected type in form
    const typedFormData: ManageCalendarEventInput = {
        clientName: rawFormData.clientName as string || "",
        serviceDescription: rawFormData.serviceDescription as string || "",
        dateTime: `${rawFormData.appointmentDate as string}T${rawFormData.appointmentTime as string}`, // Combine date and time
        notes: rawFormData.notes as string | undefined,
        existingEventId: rawFormData.existingEventId as string | undefined,
    };
    return {
      formData: typedFormData,
      error: validatedFields.error.flatten().fieldErrors
        ? Object.values(validatedFields.error.flatten().fieldErrors).flat().join(" ")
        : "Invalid input. Please check the fields.",
    };
  }
  
  const { appointmentDate, appointmentTime, ...restOfData } = validatedFields.data;
  const combinedDateTime = `${appointmentDate}T${appointmentTime}`;

  const flowInput: ManageCalendarEventInput = {
    ...restOfData,
    dateTime: combinedDateTime,
  };

  try {
    const result = await manageCalendarEventFlow(flowInput);
    if (result.success) {
      return { 
        successMessage: result.message || "Appointment saved successfully and Google Calendar event managed.",
        calendarEvent: result 
      };
    } else {
      return {
        formData: flowInput,
        error: result.message || "Failed to manage Google Calendar event.",
      };
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return {
      formData: flowInput,
      error: `Action failed: ${errorMessage}`,
    };
  }
}
