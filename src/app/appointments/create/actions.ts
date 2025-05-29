
// @ts-nocheck : This is a temporary workaround for a bug in the v1.8.0 of genkit, it will be removed in the next version.
"use server";

import { manageCalendarEvent, type ManageCalendarEventInput, type ManageCalendarEventOutput } from "@/ai/flows/manage-calendar-event";
import { z } from "zod";

const SaveAppointmentActionInputSchema = z.object({
  clientName: z.string().min(1, "Client name is required."),
  clientEmail: z.string().email("Invalid email address.").min(1, "Client email is required."),
  serviceDescription: z.string().min(1, "Service description is required."),
  appointmentDate: z.string().min(1, "Appointment date is required."), // ISO date string yyyy-mm-dd
  appointmentTime: z.string().min(1, "Appointment time is required."), // HH:mm
  notes: z.string().optional(),
  existingEventId: z.string().optional(), // For editing existing events
});

// Derive a type for formData based on ManageCalendarEventInput but also matching form fields
export type FormDataType = Omit<ManageCalendarEventInput, 'dateTime'> & {
    appointmentDate?: string;
    appointmentTime?: string;
    clientEmail: string; // Ensure clientEmail is part of this type
};

export type SaveAppointmentActionState = {
  formData?: FormDataType; 
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
    const typedFormData: FormDataType = {
        clientName: rawFormData.clientName as string || "",
        clientEmail: rawFormData.clientEmail as string || "",
        serviceDescription: rawFormData.serviceDescription as string || "",
        appointmentDate: rawFormData.appointmentDate as string || "",
        appointmentTime: rawFormData.appointmentTime as string || "",
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
    ...restOfData, // clientName, clientEmail, serviceDescription, notes, existingEventId
    dateTime: combinedDateTime,
  };

  try {
    const result = await manageCalendarEvent(flowInput);
    if (result.success) {
      return { 
        successMessage: result.message || "Appointment saved successfully and Google Calendar event managed.",
        calendarEvent: result 
      };
    } else {
      // Reconstruct FormDataType for formData to match expected type in form
      const errorFormData: FormDataType = {
        ...restOfData,
        appointmentDate,
        appointmentTime,
      };
      return {
        formData: errorFormData,
        error: result.message || "Failed to manage Google Calendar event.",
      };
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    // Reconstruct FormDataType for formData
    const errorFormData: FormDataType = {
        ...restOfData,
        appointmentDate,
        appointmentTime,
    };
    return {
      formData: errorFormData,
      error: `Action failed: ${errorMessage}`,
    };
  }
}
