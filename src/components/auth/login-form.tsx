
"use client";

import { useActionState } from "react"; // Changed from 'react-dom' if you were using older Next.js/React
// For Next.js 14+ with React 18.3+, useActionState is from 'react'
// import { useActionState } from "react"; 
import { useEffect } from "react";

import { useFormStatus } from "react-dom";
import { loginAction, type LoginActionState } from "@/app/login/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Mail, KeyRound, AlertCircle } from "lucide-react"; // Removed CheckCircle2
import { useToast } from "@/hooks/use-toast";

const initialState: LoginActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Logging In...
        </>
      ) : (
        "Login"
      )}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.error) { // Check if state exists before accessing error
      // The error Alert component below will handle displaying the error.
      // A toast is optional here and can be uncommented if desired.
      // toast({
      //   variant: "destructive",
      //   title: "Login Failed",
      //   description: state.error,
      // });
    }
    // Success message and redirect are now handled by the server action directly.
  }, [state?.error, toast]);

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle>Login to Your Account</CardTitle>
        <CardDescription>
          Enter your credentials to access the dashboard.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                defaultValue={state?.formData?.email || ""}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
               <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                defaultValue={state?.formData?.password || ""}
                className="pl-10"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton />
        </CardFooter>
      </form>
      {state?.error && ( // Only show error alert if there is an error
        <Alert variant="destructive" className="m-4 md:m-6 mt-0">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Login Failed</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {/* Success Alert removed as redirect handles success indication */}
    </Card>
  );
}
