// LegalResearchAssistant.ts
'use server';

/**
 * @fileOverview A legal research AI assistant.
 *
 * - legalResearchAssistant - A function that handles the legal research process.
 * - LegalResearchAssistantInput - The input type for the legalResearchAssistant function.
 * - LegalResearchAssistantOutput - The return type for the legalResearchAssistant function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const LegalResearchAssistantInputSchema = z.object({
  researchQuery: z.string().describe('The specific legal question or topic the user wants to research.'),
});
export type LegalResearchAssistantInput = z.infer<typeof LegalResearchAssistantInputSchema>;

const LegalResearchAssistantOutputSchema = z.object({
  analysis: z.string().describe('AI-generated analysis, including key clauses, risk assessments, relevant case precedents, and legal research findings.'),
});
export type LegalResearchAssistantOutput = z.infer<typeof LegalResearchAssistantOutputSchema>;

export async function legalResearchAssistant(input: LegalResearchAssistantInput): Promise<LegalResearchAssistantOutput> {
  return legalResearchAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'legalResearchAssistantPrompt',
  input: {
    schema: z.object({
      researchQuery: z.string().describe('The specific legal question or topic the user wants to research.'),
    }),
  },
  output: {
    schema: z.object({
      analysis: z.string().describe('AI-generated analysis, including key clauses, risk assessments, relevant case precedents, and legal research findings.'),
    }),
  },
  prompt: `You are an advanced AI legal research assistant with expert-level knowledge of South African law and a strong understanding of international legal principles.  Your primary purpose is to empower South African lawyers to conduct comprehensive and efficient legal research, both within South Africa and across relevant international jurisdictions.

  I need help with: {{{researchQuery}}}

  Prioritize the following sources when conducting web searches:

  * Official South African government websites (e.g., gov.za, Department of Justice and Constitutional Development, South African Parliament).
  * SAFLII (Southern African Legal Information Institute).
  * Reputable South African legal databases (e.g., LexisNexis, Westlaw South Africa - if accessible).
  * Websites of South African courts (e.g., Constitutional Court, Supreme Court of Appeal).
  * Websites of South African legal professional bodies (e.g., the Law Society of South Africa, the General Council of the Bar).
  * Academic websites and repositories of South African universities with law faculties.
  * Reliable international legal databases and websites of international organizations.

  Provide accurate and complete citations for all legal sources, adhering to South African legal citation conventions (for South African sources) and appropriate citation styles for international sources.

  This information is intended for research purposes only and does not constitute legal advice. It is essential to consult with a qualified legal professional for advice tailored to your specific circumstances.
`,
});

const legalResearchAssistantFlow = ai.defineFlow<
  typeof LegalResearchAssistantInputSchema,
  typeof LegalResearchAssistantOutputSchema
>(
  {
    name: 'legalResearchAssistantFlow',
    inputSchema: LegalResearchAssistantInputSchema,
    outputSchema: LegalResearchAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
