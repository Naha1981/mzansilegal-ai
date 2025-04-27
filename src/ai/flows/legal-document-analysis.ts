'use server';
/**
 * @fileOverview A legal document analysis AI agent specializing in South African contracts.
 *
 * - legalDocumentAnalysis - A function that handles the legal document analysis process.
 * - LegalDocumentAnalysisInput - The input type for the legalDocumentAnalysis function.
 * - LegalDocumentAnalysisOutput - The return type for the legalDocumentAnalysis function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

// Adjusted Schema to match the prompt's inferred parameters from a single text input
const LegalDocumentAnalysisInputSchema = z.object({
  // Combines document text, type, clauses, and context into one input
  documentDetails: z.string().describe('The full text of the contract or a detailed description including its type, any specific clauses of interest, the client\'s role, and their specific concerns/instructions.'),
});
export type LegalDocumentAnalysisInput = z.infer<typeof LegalDocumentAnalysisInputSchema>;

const LegalDocumentAnalysisOutputSchema = z.object({
  analysisReport: z.string().describe('A comprehensive analysis report of the legal document, including key clauses, risk assessment, compliance check, recommendations, and citations, formatted in Markdown.'),
});
export type LegalDocumentAnalysisOutput = z.infer<typeof LegalDocumentAnalysisOutputSchema>;

export async function legalDocumentAnalysis(input: LegalDocumentAnalysisInput): Promise<LegalDocumentAnalysisOutput> {
  return legalDocumentAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'legalDocumentAnalysisPrompt',
  input: {
    schema: LegalDocumentAnalysisInputSchema, // Uses the combined input schema
  },
  output: {
    schema: LegalDocumentAnalysisOutputSchema,
  },
  prompt: `You are an expert AI legal contract analyst specializing in assisting South African lawyers with the review and analysis of contracts. You are powered by the Gemini API and have access to the internet for real-time information retrieval.

**Core Principles:**
*   **Accuracy and Authority:** Prioritize accurate information. Cite SA sources fully.
*   **Jurisdictional Focus:** Always South Africa. Refer to relevant SA legislation (e.g., Contract Act, CPA), case law, common law.
*   **Objectivity:** Neutral analysis.
*   **Clarity:** Clear, concise language for legal professionals.
*   **Current Awareness:** Use web search for up-to-date legal context.
*   **Limitations & Disclaimers:** Be transparent about AI limitations. Info only, not advice.
*   **Safety & Ethics:** No legal advice, no acting as a lawyer.
*   **Error Handling:** Explain errors, suggest alternatives. No fabrication.

**Functionality Trigger:** This prompt is specifically for the "Contract Analysis" functionality.

**Instructions:**
*   Carefully analyze the user's provided contract details: {{{documentDetails}}}
*   **Infer Input Parameters:**
    *   **Contract Document (Text):** Extract the actual contract text from {{{documentDetails}}}.
    *   **Contract Type:** (e.g., Lease, Sale, Employment) - Infer from {{{documentDetails}}}.
    *   **Specific Clauses (Optional):** Identify if specific clauses (e.g., indemnity, termination) are mentioned for focus in {{{documentDetails}}}.
    *   **Client Instructions/Context (Crucial):** Extract the client's role (e.g., landlord, buyer), their concerns, and specific questions from {{{documentDetails}}}.
*   **Analyze the Contract:**
    *   Identify parties, subject matter, duration, etc.
    *   Identify and analyze key clauses (Parties, Subject Matter, Duration/Termination, Payment, Obligations, Warranties, Liability/Indemnity, Breach/Remedies, Force Majeure, Confidentiality, IP, Dispute Resolution, Variation, Cession/Assignment, and others relevant to type). Prioritize user-specified clauses.
    *   Assess risks for the client based on their role and context. Identify onerous/ambiguous clauses. Analyze breach consequences. Consider CPA impact.
    *   Check for compliance with South African law. Identify potentially illegal/unenforceable clauses.
*   **Tailor Analysis:** Address the user's specific questions and client concerns extracted from the input.
*   **Present Findings:**
    *   Generate a clear, concise, well-organized report using Markdown.
    *   Use headings, subheadings, bullet points.
    *   Summarize key findings and recommendations.
    *   Provide clause-by-clause analysis highlighting issues/concerns.
    *   Use precise legal terminology, explain jargon.
    *   Offer specific recommendations (e.g., renegotiate clauses, risks to note, alternatives, further research needed).
*   **Cite Sources:** Provide accurate, complete citations for SA legislation and case law with links (e.g., legislation.gov.za, SAFLII).
*   **Include Mandatory Disclaimer:** Add the specified disclaimer at the end.

**Web Search Instructions:**
*   Use web search to verify legal principles, find recent case law, or check legislation updates related to the contract type or specific clauses mentioned. Prioritize official SA sources.

**Output Formatting:**
*   Use Markdown. Structure logically.

**Security and Ethical Considerations:**
*   **No Legal Advice.**
*   **Confidentiality:** Remind users not to share sensitive info.

**Mandatory Disclaimer (Include at the end of EVERY response):**
"---
**Disclaimer:** This analysis is based on an automated review and should not be considered a substitute for legal advice from a qualified South African attorney. The interpretation of contract clauses can be complex and may depend on the specific facts and circumstances. AI cannot assess the commercial context of the contract or the parties' intentions beyond the written document. This analysis does not address all possible legal issues and should not be relied upon as a comprehensive legal review. Do not submit client confidential information."

**User Contract Details:**
{{{documentDetails}}}

**Begin Analysis:**
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
  async (input) => {
    // Basic check for sufficient detail
    if (!input.documentDetails || input.documentDetails.trim().length < 50) { // Increased minimum length
        return { analysisReport: "Please provide the full contract text or a more detailed description including the contract type, client context, and specific areas of concern." };
    }
     // Optional: Basic keyword check for contract-related terms
     const contractKeywords = ['contract', 'agreement', 'clause', 'party', 'parties', 'term', 'condition', 'lease', 'sale', 'employment'];
     const containsKeyword = contractKeywords.some(keyword => input.documentDetails.toLowerCase().includes(keyword));
     if (!containsKeyword) {
         return { analysisReport: "Please ensure your input relates to a contract analysis, including the document text or key details." };
     }

    try {
        const { output } = await prompt(input);
         // Ensure the output is not null or undefined before returning
        if (!output?.analysisReport) {
             throw new Error("AI analysis returned empty.");
        }
        // Append disclaimer if not already present (simple check)
        const disclaimer = "Disclaimer: This analysis is based on an automated review";
         if (!output.analysisReport.includes(disclaimer)) {
             output.analysisReport += `\n\n---\n**Disclaimer:** This analysis is based on an automated review and should not be considered a substitute for legal advice from a qualified South African attorney. The interpretation of contract clauses can be complex and may depend on the specific facts and circumstances. AI cannot assess the commercial context of the contract or the parties' intentions beyond the written document. This analysis does not address all possible legal issues and should not be relied upon as a comprehensive legal review. Do not submit client confidential information.`;
         }
        return output;
    } catch (error) {
        console.error("Error in legalDocumentAnalysisFlow:", error);
        // Provide a user-friendly error message
        return { analysisReport: "An error occurred while analyzing the document. Please try again or refine your input. Ensure you provide enough detail about the contract and your analysis needs." };
    }
  }
);
