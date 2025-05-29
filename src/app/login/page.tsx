
import { LoginForm } from "@/components/auth/login-form";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center p-4 md:p-6">
      <div className="mb-8 text-center">
        <LogIn className="w-12 h-12 text-primary mx-auto mb-3" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome Back
        </h1>
        <p className="text-muted-foreground mt-2">
          Log in to access your Kagayaku Command Center.
        </p>
      </div>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
