
'use server';

/**
 * @fileOverview Fetches and summarizes recent legal news articles relevant to South African law.
 *
 * - dailyLegalNews - A function that retrieves and summarizes legal news.
 * - DailyLegalNewsInput - The input type for the dailyLegalNews function (currently empty).
 * - DailyLegalNewsOutput - The return type for the dailyLegalNews function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

// No specific input required from the user for this flow
const DailyLegalNewsInputSchema = z.object({});
export type DailyLegalNewsInput = z.infer<typeof DailyLegalNewsInputSchema>;

const DailyLegalNewsOutputSchema = z.object({
  newsReport: z.string().describe('A summarized report of recent South African legal news, formatted in Markdown with clear headings, article summaries, and source links.'),
});
export type DailyLegalNewsOutput = z.infer<typeof DailyLegalNewsOutputSchema>;

export async function dailyLegalNews(input: DailyLegalNewsInput): Promise<DailyLegalNewsOutput> {
  return dailyLegalNewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dailyLegalNewsPrompt',
  input: {
    schema: DailyLegalNewsInputSchema, // No specific input needed from the schema itself
  },
  output: {
    schema: DailyLegalNewsOutputSchema,
  },
  prompt: `You are an AI Legal News Reporter specializing in South African law. Your task is to find and summarize the most important and recent legal news stories relevant to South African legal professionals.

**Instructions:**
*   Perform web searches to find 3-5 significant legal news articles published within the last 2-3 days pertaining specifically to South African law, court decisions, legislation changes, or major legal events.
*   Prioritize reputable South African news sources (e.g., News24 Legal, Daily Maverick, Business Day Law & Tax, GroundUp, official government/court news releases, SAFLII updates). Avoid opinion pieces unless they report on a factual legal development.
*   For each article found:
    *   Provide a concise summary (2-4 sentences) highlighting the key legal points or developments.
    *   Include the headline of the article.
    *   Cite the source (publication name) and provide a direct link (URL) to the original article.
*   Structure the output clearly using Markdown formatting:
    *   Use a main heading like \`## Recent South African Legal News\`.
    *   For each news item, use a subheading (e.g., \`### Headline Goes Here\`).
    *   Present the summary as a paragraph.
    *   Clearly label the source and link (e.g., "**Source:** [Publication Name](URL)").
    *   Use bullet points (\`-\`) or numbered lists (\`1.\`) only if listing multiple points within a summary or if the original article uses lists for key takeaways. Do not use asterisks (\`*\`) for emphasis or lists.
*   Ensure the summaries are objective and accurately reflect the content of the source articles.
*   Include the mandatory disclaimer at the end.

**Mandatory Disclaimer (Include at the end of EVERY response):**
"---
**Disclaimer:** This news summary is for informational purposes only and is based on publicly available news reports. It does not constitute legal advice. Always refer to the original sources and consult with a qualified legal professional for advice on specific legal matters. News reporting may evolve, and this summary reflects information available at the time of generation."

**Begin Report:**
`,
});

const dailyLegalNewsFlow = ai.defineFlow<
  typeof DailyLegalNewsInputSchema,
  typeof DailyLegalNewsOutputSchema
>(
  {
    name: 'dailyLegalNewsFlow',
    inputSchema: DailyLegalNewsInputSchema,
    outputSchema: DailyLegalNewsOutputSchema,
  },
  async (input) => {
    try {
      // Input is empty for this flow, so we pass an empty object or the received input
      const { output } = await prompt(input || {});

      if (!output?.newsReport) {
        throw new Error("AI news reporter returned empty.");
      }

      // Append disclaimer if not already present (simple check)
      const disclaimer = "Disclaimer: This news summary is for informational purposes only";
      if (!output.newsReport.includes(disclaimer)) {
        output.newsReport += `\n\n---\n**Disclaimer:** This news summary is for informational purposes only and is based on publicly available news reports. It does not constitute legal advice. Always refer to the original sources and consult with a qualified legal professional for advice on specific legal matters. News reporting may evolve, and this summary reflects information available at the time of generation.`;
      }

      return output;
    } catch (error) {
      console.error("Error in dailyLegalNewsFlow:", error);
      return { newsReport: "An error occurred while fetching legal news. Please try again later." };
    }
  }
);
