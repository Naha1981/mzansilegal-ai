'use server';

/**
 * @fileOverview Fetches and summarizes recent legal news articles relevant to South African law from specific RSS feeds.
 *
 * - dailyLegalNews - A function that retrieves and summarizes legal news from RSS feeds.
 * - DailyLegalNewsInput - The input type for the internal dailyLegalNewsFlow function.
 * - DailyLegalNewsOutput - The return type for the dailyLegalNews function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';
import { fetchRssNews, type NewsItem } from '@/services/rss-service';

const RSS_FEED_URLS = [
    'https://feeds.news24.com/articles/news24/TopStories/rss',
    'https://www.timeslive.co.za/rss/'
];

// Schema for the news items passed *into* the flow/prompt
const NewsItemSchema = z.object({
  title: z.string().optional().describe('The headline of the news article.'),
  link: z.string().optional().describe('The direct URL to the original article.'),
  contentSnippet: z.string().optional().describe('A short summary or snippet of the article content.'),
  isoDate: z.string().optional().describe('The publication date in ISO format.'),
  source: z.string().optional().describe('The name of the news source feed.'),
});

const DailyLegalNewsInputSchema = z.object({
  newsItems: z.array(NewsItemSchema).describe('An array of news items fetched from RSS feeds.'),
});
export type DailyLegalNewsInput = z.infer<typeof DailyLegalNewsInputSchema>;

const DailyLegalNewsOutputSchema = z.object({
  newsReport: z.string().describe('A summarized report of the provided South African legal news items, formatted in Markdown with clear headings, article summaries, and source links.'),
});
export type DailyLegalNewsOutput = z.infer<typeof DailyLegalNewsOutputSchema>;

// Updated exported function: Fetches news then calls the flow
export async function dailyLegalNews(): Promise<DailyLegalNewsOutput> {
  console.log('Fetching news from RSS feeds...');
  const fetchedNewsItems = await fetchRssNews(RSS_FEED_URLS);

  // Filter for potentially relevant items (basic keyword check)
  const legalKeywords = ['law', 'legal', 'court', 'judge', 'justice', 'legislation', 'act', 'case', 'appeal', 'ruling', 'state capture', 'npa', 'hawks', 'siu', 'constitutional'];
  const relevantNewsItems = fetchedNewsItems.filter(item =>
    item.title && legalKeywords.some(keyword => item.title!.toLowerCase().includes(keyword)) ||
    item.contentSnippet && legalKeywords.some(keyword => item.contentSnippet!.toLowerCase().includes(keyword))
  );

  console.log(`Filtered down to ${relevantNewsItems.length} potentially relevant news items.`);

  // Limit the number of items sent to the LLM to avoid large prompts
  const limitedNewsItems = relevantNewsItems.slice(0, 10); // Send max 10 items
  console.log(`Sending ${limitedNewsItems.length} items to the LLM for summarization.`);


  if (limitedNewsItems.length === 0) {
    console.log('No relevant news items found after filtering.');
    return { newsReport: "No relevant recent legal news found in the specified RSS feeds." };
  }

  return dailyLegalNewsFlow({ newsItems: limitedNewsItems });
}

const prompt = ai.definePrompt({
  name: 'dailyLegalNewsPrompt',
  input: {
    schema: DailyLegalNewsInputSchema, // Input is now the fetched news items
  },
  output: {
    schema: DailyLegalNewsOutputSchema,
  },
  prompt: `You are an AI Legal News Reporter specializing in South African law. Your task is to summarize the provided news items, focusing on aspects most relevant to South African legal professionals.

**Instructions:**
- Review the following news items:
{{#each newsItems}}
  - **Title:** {{title}}
    **Link:** {{link}}
    **Source:** {{source}}
    **Date:** {{isoDate}}
    **Snippet:** {{contentSnippet}}
{{/each}}
- For each item that appears relevant to South African law, court decisions, legislation changes, or major legal events:
    - Provide a concise summary (2-4 sentences) highlighting the key legal points or developments. Focus on the facts and legal implications, filtering out non-legal details unless crucial for context.
    - Include the headline of the article.
    - Cite the source (publication name/feed title provided) and provide the direct link (URL) to the original article.
- If an item seems entirely irrelevant to legal matters (e.g., sports, entertainment with no legal angle), you may briefly state it's not relevant or omit it from the final report.
- Structure the output clearly using Markdown formatting:
    - Use a main heading like ## Recent South African Legal News.
    - For each summarized news item, use a subheading (e.g., ### Headline Goes Here).
    - Present the summary as a paragraph.
    - Clearly label the source and link (e.g., **Source:** [{{source}}]({{link}})).
    - Use bullet points (- ) only if listing multiple distinct legal points within a single summary. Do not use asterisks for emphasis or lists.
- Ensure the summaries are objective and accurately reflect the legal essence of the source articles based *only* on the provided snippets and titles. Do not add external information or opinions.
- If no relevant items are found in the input, state that clearly.
- Include the mandatory disclaimer at the end.

**Mandatory Disclaimer (Include at the end of EVERY response):**
---
**Disclaimer:** This news summary is for informational purposes only and is based on publicly available RSS feed data. It does not constitute legal advice. Always refer to the original sources and consult with a qualified legal professional for advice on specific legal matters. News reporting may evolve, and this summary reflects information available at the time of generation. Summaries are based on snippets and may not capture the full context of the original article.

**Begin Report:**
`,
});

// Internal flow function, now takes news items as input
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
    console.log(`dailyLegalNewsFlow received ${input.newsItems.length} items.`);
    if (!input.newsItems || input.newsItems.length === 0) {
        console.log("No news items provided to the flow.");
        return { newsReport: "No news items were provided for summarization." };
    }
    try {
      console.log("Calling prompt with news items...");
      const { output } = await prompt(input);

      if (!output?.newsReport) {
        console.error("AI news reporter returned empty.");
        throw new Error("AI news reporter returned empty.");
      }

      // Append disclaimer if not already present (simple check)
      const disclaimer = "Disclaimer: This news summary is for informational purposes only";
      if (!output.newsReport.includes(disclaimer)) {
          console.log("Appending disclaimer to the report.");
          output.newsReport += `\n\n---\n**Disclaimer:** This news summary is for informational purposes only and is based on publicly available RSS feed data. It does not constitute legal advice. Always refer to the original sources and consult with a qualified legal professional for advice on specific legal matters. News reporting may evolve, and this summary reflects information available at the time of generation. Summaries are based on snippets and may not capture the full context of the original article.`;
      } else {
          console.log("Disclaimer already present in the report.");
      }

      console.log("Returning news report from flow.");
      return output;
    } catch (error) {
      console.error("Error in dailyLegalNewsFlow execution:", error);
      return { newsReport: "An error occurred while summarizing the legal news. Please try again later." };
    }
  }
);
