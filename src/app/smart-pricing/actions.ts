// @ts-nocheck : This is a temporary workaround for a bug in the v1.8.0 of genkit, it will be removed in the next version.
"use server";

import { suggestPricing as suggestPricingFlow, type SuggestPricingInput, type SuggestPricingOutput } from "@/ai/flows/suggest-pricing";
import { z } from "zod";

const SuggestPricingActionInputSchema = z.object({
  timeOfYear: z.string().min(1, "Time of year is required."),
  marketingInitiatives: z.string().min(1, "Marketing initiatives are required."),
  serviceDescription: z.string().min(1, "Service description is required."),
  currentPrice: z.coerce.number().positive("Current price must be a positive number."),
});

export type SuggestPricingActionState = {
  formData?: SuggestPricingInput;
  error?: string;
  suggestion?: SuggestPricingOutput;
};

export async function suggestPricingAction(
  prevState: SuggestPricingActionState,
  formData: FormData
): Promise<SuggestPricingActionState> {
  const rawFormData = Object.fromEntries(formData);

  const validatedFields = SuggestPricingActionInputSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      formData: rawFormData as SuggestPricingInput, // Cast for now, errors will guide user
      error: validatedFields.error.flatten().fieldErrors // Simpler error message for now
        ? Object.values(validatedFields.error.flatten().fieldErrors).flat().join(" ")
        : "Invalid input. Please check the fields.",
    };
  }

  try {
    const result = await suggestPricingFlow(validatedFields.data);
    return { suggestion: result };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return {
      formData: validatedFields.data,
      error: `AI suggestion failed: ${errorMessage}`,
    };
  }
}
