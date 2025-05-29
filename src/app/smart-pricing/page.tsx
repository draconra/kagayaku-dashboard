import { SmartPricingForm } from "./smart-pricing-form";
import { Lightbulb } from "lucide-react";

export default function SmartPricingPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-2xl">
      <div className="mb-8 text-center">
        <Lightbulb className="w-12 h-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Smart Pricing Assistant
        </h1>
        <p className="text-muted-foreground mt-2">
          Leverage AI to determine optimal pricing for your services. 
          Enter the details below to get a data-driven price suggestion.
        </p>
      </div>
      <SmartPricingForm />
    </div>
  );
}
