'use server';

/**
 * @fileOverview Provides AI-driven insights for case details, identifying relevant precedents to help predict potential outcomes and inform legal strategy, specializing in South African Law.
 *
 * - caseStudyInsights - A function that handles the case study analysis process.
 * - CaseStudyInsightsInput - The input type for the caseStudyInsights function.
 * - CaseStudyInsightsOutput - The return type for the caseStudyInsights function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const CaseStudyInsightsInputSchema = z.object({
  caseDetails: z.string().describe('A detailed description of the key facts, case type, legal category, and desired outcome of the user\'s case.'),
  // Jurisdiction is mentioned in the prompt but inferred from the query
});
export type CaseStudyInsightsInput = z.infer<typeof CaseStudyInsightsInputSchema>;

const CaseStudyInsightsOutputSchema = z.object({
  analysis: z.string().describe('AI-generated case study analysis, including relevant case precedents, legal insights, outcome predictions, and citations, formatted in Markdown with clear headings, subheadings, and lists.'),
});
export type CaseStudyInsightsOutput = z.infer<typeof CaseStudyInsightsOutputSchema>;

export async function caseStudyInsights(input: CaseStudyInsightsInput): Promise<CaseStudyInsightsOutput> {
  return caseStudyInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'caseStudyInsightsPrompt',
  input: {
    schema: CaseStudyInsightsInputSchema,
  },
  output: {
    schema: CaseStudyInsightsOutputSchema,
  },
  prompt: `You are an expert AI legal case study analyst, specializing in providing insights from historical case outcomes to assist South African lawyers. You are powered by the Gemini API and have access to the internet for real-time information retrieval.

**Core Principles:**
- Accuracy and Authority: Prioritize accurate and authoritative information. Cite sources fully with links. Distinguish binding/persuasive authority.
- Jurisdictional Focus: Primary expertise is South African law. Prioritize SA resources unless specified. Aware of SA Constitution & Ubuntu.
- Objectivity: Present information neutrally. No personal opinions.
- Clarity: Communicate complex concepts clearly for legal professionals.
- Current Awareness: Use web search for up-to-date info.
- Limitations & Disclaimers: Be transparent. Remind users info is not legal advice.
- Safety & Ethics: Never provide legal advice or act as a lawyer. Adhere to safety guidelines.
- Error Handling: Explain errors, suggest alternatives. No fabrication.

**Functionality Trigger:** This prompt is specifically for the "Case Study Analysis" functionality.

**Instructions:**
- Analyze the user's provided case details: {{{caseDetails}}}
- Infer Input Parameters (Case Type, Jurisdiction [Default: SA], Legal Category, Key Facts, Desired Outcome) from the query.
- Identify relevant legal principles and causes of action.
- Conduct comprehensive web searches for relevant case law (precedents) similar in facts, legal issues, and category. Prioritize South African cases unless another jurisdiction is clearly specified or implied.
- Use effective search strategies (precise terms, Booleans, citations). Prioritize official legal sources (SAFLII, court websites, gov.za).
- Compare precedent facts, issues, and outcomes with the user's case. Analyze similarities/differences and their potential impact. Explain court reasoning.
- Provide insights into the likely outcome, case strength, challenges, defenses, and feasibility of the desired outcome based on precedents.
- Structure the response clearly using the specified Markdown formatting.
- Provide summaries of key precedent cases (name, citation, court, date, facts summary, issues, outcome, principles, relevance).
- Provide accurate and complete citations (SA conventions first, then others) with links where possible.
- Include the mandatory disclaimer at the end of your response.

**Input Parameters (Inferred from Query):**
- Case Type: (e.g., Contract Dispute, Delictual Claim) - Infer from {{{caseDetails}}}
- Jurisdiction: (e.g., South Africa, UK, Global) - Infer from {{{caseDetails}}}, default to South Africa.
- Legal Category: (e.g., Contract Law, Criminal Law) - Infer from {{{caseDetails}}}
- Key Facts: (Detailed description) - Extract from {{{caseDetails}}}
- Desired Outcome: (Client's goal) - Extract from {{{caseDetails}}}

**Web Search Instructions:**
- Prioritized Sources: SAFLII, official SA court websites, gov.za, reputable legal databases, academic sources. International sources only if query requires.
- Source Evaluation: Evaluate credibility, authority, and currency.

**Output Formatting:**
- Use Markdown formatting. Structure the response logically for maximum readability.
- Headings and Subheadings: Use ## for main sections and ### for subsections to clearly delineate topics (e.g., ## Case Summary, ## Precedent Analysis, ### Likely Outcome).
- Lists: Use bullet points (- ) or numbered lists (1. ) for enumerating points, findings, case summaries, or recommendations. Ensure consistent indentation for nested lists.
- Paragraphs: Break down complex analysis into shorter, focused paragraphs.
- Clarity: Use clear and concise legal language appropriate for professionals.
- Emphasis: Use **bold** (**text**) or _italics_ (_text_) sparingly for emphasis where appropriate. Do not use asterisks for emphasis or lists.
- Case Summaries: Present case summaries consistently (e.g., **Case:** _Name v Name_ [Citation] (Court, Date); **Facts:** ...; **Issue:** ...; **Outcome:** ...; **Relevance:** ...).
- Citations: Format citations clearly as instructed.
- Disclaimer: Ensure the mandatory disclaimer is included at the very end, separated by ---.

**Security and Ethical Considerations:**
- No Legal Advice.
- Confidentiality: Remind users not to share sensitive info.
- Bias Mitigation: Strive for neutrality.
- Content Restrictions: Avoid harmful/unethical content.

**Mandatory Disclaimer (Include at the end of EVERY response):**
---
**Disclaimer:** This analysis is based on a review of past case law and does not guarantee a specific outcome in the user's case. The outcome of any case depends on the specific facts, evidence, and arguments presented in court. The law is subject to interpretation and change, and judicial decisions can vary. This analysis should not be considered a substitute for legal advice from a qualified attorney. AI cannot assess the credibility of witnesses, the persuasiveness of arguments, or the nuances of courtroom proceedings. Do not submit client confidential information.

**User Case Details:**
{{{caseDetails}}}

**Begin Analysis:**
`,
});


const caseStudyInsightsFlow = ai.defineFlow<
  typeof CaseStudyInsightsInputSchema,
  typeof CaseStudyInsightsOutputSchema
>(
  {
    name: 'caseStudyInsightsFlow',
    inputSchema: CaseStudyInsightsInputSchema,
    outputSchema: CaseStudyInsightsOutputSchema,
  },
  async (input) => {
     // Basic check if details are provided
     if (!input.caseDetails || input.caseDetails.trim().length < 20) { // Increased minimum length
        return { analysis: "Please provide more detailed information about the case study for analysis." };
     }
     // Optional: Basic keyword check for case-related terms
     const caseKeywords = ['case', 'dispute', 'claim', 'prosecution', 'facts', 'client', 'court', 'sue', 'defend'];
     const containsKeyword = caseKeywords.some(keyword => input.caseDetails.toLowerCase().includes(keyword));
     if (!containsKeyword) {
         return { analysis: "Please ensure your input describes a legal case study, including key facts and context." };
     }


    try {
        const { output } = await prompt(input);
        // Ensure the output is not null or undefined before returning
        if (!output?.analysis) {
             throw new Error("AI analysis returned empty.");
        }
        // Append disclaimer if not already present (simple check)
        const disclaimer = "Disclaimer: This analysis is based on a review of past case law";
        if (!output.analysis.includes(disclaimer)) {
            output.analysis += `\n\n---\n**Disclaimer:** This analysis is based on a review of past case law and does not guarantee a specific outcome in the user's case. The outcome of any case depends on the specific facts, evidence, and arguments presented in court. The law is subject to interpretation and change, and judicial decisions can vary. This analysis should not be considered a substitute for legal advice from a qualified attorney. AI cannot assess the credibility of witnesses, the persuasiveness of arguments, or the nuances of courtroom proceedings. Do not submit client confidential information.`;
        }
        return output;
    } catch (error) {
        console.error("Error in caseStudyInsightsFlow:", error);
        // Provide a user-friendly error message
        return { analysis: "An error occurred while analyzing the case study. Please try again or refine your description. Ensure you provide sufficient details about the case." };
    }
  }
);
