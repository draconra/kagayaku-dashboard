
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { suggestPricingAction, type SuggestPricingActionState } from "./actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState: SuggestPricingActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Getting Suggestion...
        </>
      ) : (
        "Get Price Suggestion"
      )}
    </Button>
  );
}

export function SmartPricingForm() {
  const [state, formAction] = useFormState(suggestPricingAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
    }
  }, [state.error, toast]);

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle>Service Details</CardTitle>
        <CardDescription>
          Provide information about the service to get a tailored price suggestion.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="serviceDescription">Service Description</Label>
            <Textarea
              id="serviceDescription"
              name="serviceDescription"
              placeholder="e.g., Full Personal Color Analysis including draping, makeup recommendations, and digital swatch."
              defaultValue={state.formData?.serviceDescription}
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="timeOfYear">Time of Year</Label>
              <Input
                id="timeOfYear"
                name="timeOfYear"
                placeholder="e.g., Spring, Q4, Holiday Season"
                defaultValue={state.formData?.timeOfYear}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentPrice">Current Price (IDR)</Label>
              <Input
                id="currentPrice"
                name="currentPrice"
                type="number"
                placeholder="e.g., 1500000"
                defaultValue={state.formData?.currentPrice}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="marketingInitiatives">Current Marketing Initiatives</Label>
            <Textarea
              id="marketingInitiatives"
              name="marketingInitiatives"
              placeholder="e.g., 15% off for new clients, 'New Year New You' campaign."
              defaultValue={state.formData?.marketingInitiatives}
              rows={3}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>

      {state.suggestion && (
        <Alert className="m-6 border-green-500 bg-green-500/10 text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <AlertTitle className="font-semibold text-green-600 dark:text-green-300">AI Pricing Suggestion</AlertTitle>
          <AlertDescription>
            <p className="text-2xl font-bold mt-2 mb-1">
              Suggested Price: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(state.suggestion.suggestedPrice)}
            </p>
            <p className="text-sm">{state.suggestion.reasoning}</p>
          </AlertDescription>
        </Alert>
      )}
      {state.error && !state.suggestion && (
         <Alert variant="destructive" className="m-6">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Suggestion Failed</AlertTitle>
          <AlertDescription>
            {state.error}
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
}
