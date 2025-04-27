// LegalDocumentAnalysisOutput - The return type for the legalDocumentAnalysis function.
'use server';
/**
 * @fileOverview A legal document analysis AI agent.
 *
 * - legalDocumentAnalysis - A function that handles the legal document analysis process.
 * - LegalDocumentAnalysisInput - The input type for the legalDocumentAnalysis function.
 * - LegalDocumentAnalysisOutput - The return type for the legalDocumentAnalysis function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const LegalDocumentAnalysisInputSchema = z.object({
  documentText: z.string().describe('The text content of the legal document.'),
  contractType: z.string().describe('The type of contract, e.g., Sale of Business Agreement, Lease Agreement, Employment Contract.'),
  specificClauses: z.string().optional().describe('Specific clauses to focus on, e.g., indemnity clause, restraint of trade clause.'),
  clientInstructions: z.string().describe('The client instructions and context, including their role and concerns.'),
});
export type LegalDocumentAnalysisInput = z.infer<typeof LegalDocumentAnalysisInputSchema>;

const LegalDocumentAnalysisOutputSchema = z.object({
  analysisReport: z.string().describe('A comprehensive analysis report of the legal document.'),
});
export type LegalDocumentAnalysisOutput = z.infer<typeof LegalDocumentAnalysisOutputSchema>;

export async function legalDocumentAnalysis(input: LegalDocumentAnalysisInput): Promise<LegalDocumentAnalysisOutput> {
  return legalDocumentAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'legalDocumentAnalysisPrompt',
  input: {
    schema: z.object({
      documentText: z.string().describe('The text content of the legal document.'),
      contractType: z.string().describe('The type of contract, e.g., Sale of Business Agreement, Lease Agreement, Employment Contract.'),
      specificClauses: z.string().optional().describe('Specific clauses to focus on, e.g., indemnity clause, restraint of trade clause.'),
      clientInstructions: z.string().describe('The client instructions and context, including their role and concerns.'),
    }),
  },
  output: {
    schema: z.object({
      analysisReport: z.string().describe('A comprehensive analysis report of the legal document.'),
    }),
  },
  prompt: `You are an expert AI legal contract analyst specializing in assisting South African lawyers with the review and analysis of contracts. Analyze the contract document below, identify key clauses, assess potential risks, and provide insights to inform the lawyer\'s advice to their client. The analysis should be within the framework of South African law, referring to relevant legislation, case law, and common law principles.

Contract Type: {{{contractType}}}
Specific Clauses (if any): {{{specificClauses}}}
Client Instructions/Context: {{{clientInstructions}}}

Contract Document:
{{{documentText}}}

Provide a clause-by-clause analysis, highlighting any potential issues or concerns. Use precise legal terminology, but explain any jargon. Provide specific recommendations, such as clauses that should be renegotiated or amended, potential risks that the client should be aware of, alternative clauses that could be considered, and further legal research that may be necessary. Provide accurate and complete citations for all relevant South African legislation and case law.  Include links to online sources where available (e.g., legislation.gov.za, SAFLII).
\nThis analysis is based on an automated review and should not be considered a substitute for legal advice from a qualified South African attorney. The interpretation of contract clauses can be complex and may depend on the specific facts and circumstances. AI cannot assess the commercial context of the contract or the parties\' intentions beyond the written document. This analysis does not address all possible legal issues and should not be relied upon as a comprehensive legal review.
`,
});

const legalDocumentAnalysisFlow = ai.defineFlow<
  typeof LegalDocumentAnalysisInputSchema,
  typeof LegalDocumentAnalysisOutputSchema
>(
  {
    name: 'legalDocumentAnalysisFlow',
    inputSchema: LegalDocumentAnalysisInputSchema,
    outputSchema: LegalDocumentAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
