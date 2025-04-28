'use server';
/**
 * @fileOverview A legal document generation AI agent specializing in South African legal correspondence and statements.
 *
 * - docGeneration - A function that handles the legal document generation process.
 * - DocGenerationInput - The input type for the docGeneration function.
 * - DocGenerationOutput - The return type for the docGeneration function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const DocGenerationInputSchema = z.object({
  docType: z.string().describe('The type of legal document to generate (e.g., Letter of Demand, Position Statement, Basic Template).'),
  context: z.string().describe('Detailed context, key facts, recipient information, desired points, and specific instructions for the document.'),
  historicalDocs: z.string().optional().describe('Optional: Text or description of historical documents to use as a style or content guide.'),
});
export type DocGenerationInput = z.infer<typeof DocGenerationInputSchema>;

const DocGenerationOutputSchema = z.object({
  generatedDocument: z.string().describe('The AI-generated legal document or template, formatted in Markdown with appropriate structure and professional tone.'),
});
export type DocGenerationOutput = z.infer<typeof DocGenerationOutputSchema>;

export async function docGeneration(input: DocGenerationInput): Promise<DocGenerationOutput> {
  // Combine inputs for the flow, potentially adding more structure later
  const combinedInput = `Document Type: ${input.docType}\nContext: ${input.context}${input.historicalDocs ? `\nHistorical Reference: ${input.historicalDocs}` : ''}`;
  return docGenerationFlow({ combinedInput });
}

// Internal schema for the flow's prompt input
const InternalDocGenInputSchema = z.object({
    combinedInput: z.string().describe('Combined input containing document type, context, and optional historical references.'),
});


const prompt = ai.definePrompt({
  name: 'docGenerationPrompt',
  input: {
    schema: InternalDocGenInputSchema, // Use the internal schema
  },
  output: {
    schema: DocGenerationOutputSchema,
  },
  prompt: `You are an expert AI legal assistant specializing in generating South African legal documents like correspondence and position statements. You are powered by the Gemini API and have access to the internet for relevant legal phrasing or context if needed, but prioritize the user's instructions.

**Core Principles:**
- **Accuracy & Formality:** Generate documents with precise legal language and a formal tone appropriate for South African legal practice.
- **Context Adherence:** Strictly follow the provided context, facts, and instructions.
- **Clarity & Structure:** Ensure the generated document is well-organized, clear, and logically structured. Use appropriate headings, paragraphs, and numbering where applicable.
- **Jurisdictional Focus:** Assume South African law applies unless context clearly indicates otherwise.
- **No Legal Advice:** Do not provide legal advice within the generated document. Focus on drafting based on user input.
- **Template Generation:** If asked for a template, provide a well-structured, generic template for the specified document type.
- **Historical Reference Usage:** If historical documents are provided, analyze their style, tone, and key phrases to inform the generation of the new document, but prioritize the current context and instructions.
- **Safety & Ethics:** Do not generate harmful, unethical, or discriminatory content.

**Functionality Trigger:** This prompt is specifically for the "Doc Generation" functionality.

**Instructions:**
- Analyze the user's request details provided below: {{{combinedInput}}}
- **Identify Key Information:**
    - **Document Type:** Determine the specific document to generate (e.g., Letter of Demand, Position Statement).
    - **Context/Facts:** Extract the core scenario, parties involved, key dates, and relevant facts.
    - **Instructions:** Note any specific points to include, arguments to make, or desired tone.
    - **Historical Reference (Optional):** If provided, note the style or content elements to potentially emulate.
- **Generate the Document:**
    - Draft the document according to the identified type and instructions.
    - Use formal South African legal language and formatting conventions.
    - Ensure logical flow and clear articulation of points.
    - If generating a template, use placeholders (e.g., [Client Name], [Date], [Specific Details]) clearly.
    - Incorporate relevant elements from historical references if provided and appropriate, without contradicting current instructions.
- **Present Findings:**
    - Output the generated document using the specified Markdown formatting.
    - Use headings (##), subheadings (###), paragraphs, and lists (- or 1.) appropriately for the document type. Avoid using asterisks for emphasis or lists.
    - If the request is unclear or lacks essential information, politely request clarification (e.g., "Please provide the specific type of document needed and the key facts.").
- **Include Mandatory Disclaimer:** Add the specified disclaimer at the end of the *generated document content itself*, typically as a footer or final paragraph if appropriate for the document type, otherwise append it after the document.

**Web Search:**
- Use web search sparingly, primarily to verify standard legal phrasing or terminology if necessary, but rely mainly on the user's input.

**Output Formatting:**
- Use Markdown for the generated document.
- Structure clearly with headings, paragraphs, lists, etc.
- Ensure professional tone and formatting.
- For templates, use clear placeholders like [Placeholder].
- Add the disclaimer as instructed.

**Security and Ethical Considerations:**
- No Legal Advice within the generated document.
- Confidentiality: Remind users indirectly via the disclaimer not to input highly sensitive details if the output is intended for external use without review.

**Mandatory Disclaimer (Include appropriately within or after the generated document):**
---
**Disclaimer:** This document was generated by an AI assistant (MzansiLegal AI) based on the information provided. It is intended as a draft for review and modification by a qualified legal professional. It does not constitute legal advice, and MzansiLegal AI assumes no liability for its use. Always ensure compliance with applicable laws and professional standards before finalizing or sending any legal document. Do not input highly sensitive or confidential client information without appropriate safeguards.

**User Request Details:**
{{{combinedInput}}}

**Begin Document Generation:**
`,
});


const docGenerationFlow = ai.defineFlow<
  typeof InternalDocGenInputSchema, // Use internal schema
  typeof DocGenerationOutputSchema
>(
  {
    name: 'docGenerationFlow',
    inputSchema: InternalDocGenInputSchema, // Use internal schema
    outputSchema: DocGenerationOutputSchema,
  },
  async (input) => {
    // Basic check for sufficient detail
    if (!input.combinedInput || input.combinedInput.trim().length < 30) {
        return { generatedDocument: "Please provide more details, including the type of document needed and the context." };
    }

    try {
        const { output } = await prompt(input);
        // Ensure the output is not null or undefined before returning
        if (!output?.generatedDocument) {
             throw new Error("AI document generation returned empty.");
        }
        // Append disclaimer if not already present (simple check) - might be included within by the prompt
        const disclaimer = "Disclaimer: This document was generated by an AI assistant";
         if (!output.generatedDocument.includes(disclaimer)) {
             output.generatedDocument += `\n\n---\n**Disclaimer:** This document was generated by an AI assistant (MzansiLegal AI) based on the information provided. It is intended as a draft for review and modification by a qualified legal professional. It does not constitute legal advice, and MzansiLegal AI assumes no liability for its use. Always ensure compliance with applicable laws and professional standards before finalizing or sending any legal document. Do not input highly sensitive or confidential client information without appropriate safeguards.`;
         }
        return output;
    } catch (error) {
        console.error("Error in docGenerationFlow:", error);
        // Provide a user-friendly error message
        return { generatedDocument: "An error occurred while generating the document. Please try again or refine your request." };
    }
  }
);
