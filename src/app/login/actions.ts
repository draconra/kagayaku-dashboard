
// @ts-nocheck : This is a temporary workaround for a bug in the v1.8.0 of genkit, it will be removed in the next version.
"use server";

import { z } from "zod";
import { redirect } from 'next/navigation';

const LoginActionInputSchema = z.object({
  email: z.string().email("Invalid email address.").min(1, "Email is required."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export type LoginFormData = z.infer<typeof LoginActionInputSchema>;

export type LoginActionState = {
  formData?: LoginFormData;
  error?: string;
  // successMessage is no longer needed here if redirecting directly
};

export async function loginAction(
  prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const rawFormData = Object.fromEntries(formData);
  const validatedFields = LoginActionInputSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      formData: rawFormData as LoginFormData,
      error: validatedFields.error.flatten().fieldErrors
        ? Object.values(validatedFields.error.flatten().fieldErrors).flat().join(" ")
        : "Invalid input. Please check the fields.",
    };
  }

  const { email, password } = validatedFields.data;

  // Placeholder authentication logic
  // In a real application, you would verify credentials against a database or auth provider.
  if ((email === "test@example.com" && password === "password") || (email === "user@example.com" && password === "password123")) {
    // Simulate successful login by redirecting
    // In a real app, you would set up a session, cookies, or JWT here before redirecting.
    redirect('/'); 
    // Note: redirect will throw an error to stop execution and send the redirect,
    // so technically no value is returned here in the success case.
    // The Promise<LoginActionState> return type is for the error cases.
  } else {
    return {
      formData: validatedFields.data,
      error: "Invalid email or password. Please try again.",
    };
  }
}

export async function logoutAction(): Promise<void> {
  // In a real application, you would clear the session/cookies here.
  // For this placeholder, we just redirect to the login page.
  redirect('/login');
}
