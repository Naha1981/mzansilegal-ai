// Story: As a legal professional, I can provide case details and receive AI-driven insights, identifying relevant precedents to help predict potential outcomes and inform legal strategy.

'use server';

/**
 * @fileOverview Provides AI-driven insights for case details, identifying relevant precedents to help predict potential outcomes and inform legal strategy.
 *
 * - caseStudyInsights - A function that handles the case study analysis process.
 * - CaseStudyInsightsInput - The input type for the caseStudyInsights function.
 * - CaseStudyInsightsOutput - The return type for the caseStudyInsights function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const CaseStudyInsightsInputSchema = z.object({
  caseDetails: z.string().describe('A detailed description of the case.'),
});
export type CaseStudyInsightsInput = z.infer<typeof CaseStudyInsightsInputSchema>;

const CaseStudyInsightsOutputSchema = z.object({
  analysis: z.string().describe('AI-generated analysis, including relevant case precedents and legal insights.'),
});
export type CaseStudyInsightsOutput = z.infer<typeof CaseStudyInsightsOutputSchema>;

export async function caseStudyInsights(input: CaseStudyInsightsInput): Promise<CaseStudyInsightsOutput> {
  return caseStudyInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'caseStudyInsightsPrompt',
  input: {
    schema: z.object({
      caseDetails: z.string().describe('A detailed description of the case.'),
    }),
  },
  output: {
    schema: z.object({
      analysis: z.string().describe('AI-generated analysis, including relevant case precedents and legal insights.'),
    }),
  },
  prompt: `You are an expert AI legal case study analyst, specializing in providing insights from historical case outcomes to assist South African lawyers.\n\nAnalyze the following case details and identify relevant precedents to help predict potential outcomes and inform legal strategy. Provide a comprehensive analysis, including summaries of key cases, legal principles applied, and the relevance to the user's case.\n\nCase Details: {{{caseDetails}}}\n\nPresent your analysis in a clear, concise, and well-organized report, using headings, subheadings, and bullet points for clarity. Provide full citations for all cases and legal sources, adhering to South African legal citation conventions for South African cases and appropriate conventions for foreign cases.  Include links to online sources where available (e.g., SAFLII, court websites).\n\nThis analysis is based on a review of past case law and does not guarantee a specific outcome in the user's case. The outcome of any case depends on the specific facts, evidence, and arguments presented in court.\n\nThe law is subject to interpretation and change, and judicial decisions can vary. This analysis should not be considered a substitute for legal advice from a qualified attorney.\n\nAI cannot assess the credibility of witnesses, the persuasiveness of arguments, or the nuances of courtroom proceedings.`,
});

const caseStudyInsightsFlow = ai.defineFlow<
  typeof CaseStudyInsightsInputSchema,
  typeof CaseStudyInsightsOutputSchema
>({
  name: 'caseStudyInsightsFlow',
  inputSchema: CaseStudyInsightsInputSchema,
  outputSchema: CaseStudyInsightsOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
