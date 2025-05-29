
"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginActionState } from "@/app/login/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Mail, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";
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
    if (state.error && !state.successMessage) {
      // Toast for error is optional as we also have an inline Alert
      // toast({
      //   variant: "destructive",
      //   title: "Login Failed",
      //   description: state.error,
      // });
    }
    if (state.successMessage) {
      toast({
        title: "Login Successful",
        description: state.successMessage,
      });
      // In a real app, you'd redirect here, e.g., router.push('/dashboard');
    }
  }, [state.error, state.successMessage, toast]);

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
                defaultValue={state.formData?.email}
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
                defaultValue={state.formData?.password}
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
      {state.error && !state.successMessage && (
        <Alert variant="destructive" className="m-4 md:m-6 mt-0">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Login Failed</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {state.successMessage && (
         <Alert variant="default" className="m-4 md:m-6 mt-0 border-green-500 bg-green-500/10 text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <AlertTitle className="font-semibold text-green-600 dark:text-green-300">Login Successful</AlertTitle>
          <AlertDescription>{state.successMessage}</AlertDescription>
        </Alert>
      )}
    </Card>
  );
}
