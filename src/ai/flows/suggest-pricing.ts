'use server';

/**
 * @fileOverview An AI agent that suggests optimal service prices based on the current time of year and active marketing initiatives.
 *
 * - suggestPricing - A function that suggests service prices.
 * - SuggestPricingInput - The input type for the suggestPricing function.
 * - SuggestPricingOutput - The return type for the suggestPricing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPricingInputSchema = z.object({
  timeOfYear: z
    .string()
    .describe('The current time of year (e.g., January, Spring, Summer).'),
  marketingInitiatives: z
    .string()
    .describe('A description of the current marketing initiatives.'),
  serviceDescription: z.string().describe('A description of the service.'),
  currentPrice: z.number().describe('The current price of the service.'),
});
export type SuggestPricingInput = z.infer<typeof SuggestPricingInputSchema>;

const SuggestPricingOutputSchema = z.object({
  suggestedPrice: z
    .number()
    .describe('The suggested price for the service, based on the input data.'),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the suggested price, including the impact of the time of year and marketing initiatives.'
    ),
});
export type SuggestPricingOutput = z.infer<typeof SuggestPricingOutputSchema>;

export async function suggestPricing(input: SuggestPricingInput): Promise<SuggestPricingOutput> {
  return suggestPricingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPricingPrompt',
  input: {schema: SuggestPricingInputSchema},
  output: {schema: SuggestPricingOutputSchema},
  prompt: `You are an expert pricing strategist for a personal color analysis studio.

You will suggest an optimal price for a service based on the current time of year, active marketing initiatives, and a description of the service.

Consider the following information:

Time of Year: {{{timeOfYear}}}
Marketing Initiatives: {{{marketingInitiatives}}}
Service Description: {{{serviceDescription}}}
Current Price: {{{currentPrice}}}

Based on this information, suggest a price and explain your reasoning. Be concise.

Output format: \`\`\`json
{"suggestedPrice": number, "reasoning": string}\`\`\`.
`,
});

const suggestPricingFlow = ai.defineFlow(
  {
    name: 'suggestPricingFlow',
    inputSchema: SuggestPricingInputSchema,
    outputSchema: SuggestPricingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
