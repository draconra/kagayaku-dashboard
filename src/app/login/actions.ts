
// @ts-nocheck : This is a temporary workaround for a bug in the v1.8.0 of genkit, it will be removed in the next version.
"use server";

import { z } from "zod";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const LoginActionInputSchema = z.object({
  email: z.string().email("Invalid email address.").min(1, "Email is required."),
  password: z.string().min(1, "Password is required."), // Min length 1 for simplicity here
});

export type LoginFormData = z.infer<typeof LoginActionInputSchema>;

export type LoginActionState = {
  formData?: LoginFormData;
  error?: string;
};

const AUTH_COOKIE_NAME = 'auth_session';

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

  // Specified credentials
  const validEmail = "kagayakustudio2024@gmail.com";
  const validPassword = "admin12345";

  if (email === validEmail && password === validPassword) {
    // Set a simple auth cookie
    cookies().set(AUTH_COOKIE_NAME, 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    redirect('/'); 
  } else {
    return {
      formData: validatedFields.data,
      error: "Invalid email or password. Please try again.",
    };
  }
}

export async function logoutAction(): Promise<void> {
  // Clear the auth cookie
  cookies().delete(AUTH_COOKIE_NAME);
  redirect('/login');
}
