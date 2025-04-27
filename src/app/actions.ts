"use server";

import { legalResearchAssistant } from "@/ai/flows/legal-research-assistant";
import { caseStudyInsights } from "@/ai/flows/case-study-insights";
import { legalDocumentAnalysis } from "@/ai/flows/legal-document-analysis";

export async function analyzeQuery(query: string): Promise<{ analysis?: string | null; error?: string }> {
  const lowerCaseQuery = query.toLowerCase();

  try {
    if (lowerCaseQuery.includes("contract analysis")) {
      // For Contract Analysis, we need more structured input potentially,
      // but based on the prompt, we'll try to infer details from the query string.
      // This is a simplification. A real app might need separate inputs.
      console.log("Routing to Legal Document Analysis...");
      const response = await legalDocumentAnalysis({
        documentText: query, // Using the full query as document text for simplicity
        contractType: "Inferred from query", // Placeholder - needs better extraction
        clientInstructions: "Inferred from query", // Placeholder
      });
      console.log("Legal Document Analysis response:", response);
      return { analysis: response.analysisReport };

    } else if (lowerCaseQuery.includes("case study analysis")) {
       console.log("Routing to Case Study Insights...");
       const response = await caseStudyInsights({
         caseDetails: query, // Using the full query as case details
       });
       console.log("Case Study Insights response:", response);
       return { analysis: response.analysis };

    } else if (lowerCaseQuery.includes("legal research")) {
       console.log("Routing to Legal Research Assistant...");
       const response = await legalResearchAssistant({
         researchQuery: query,
       });
       console.log("Legal Research Assistant response:", response);
       return { analysis: response.analysis };

    } else {
      console.log("No specific keyword detected.");
      return { error: "Please specify whether you require Legal Research, Case Study Analysis, or Contract Analysis for assistance." };
    }
  } catch (error) {
     console.error("Error during analysis:", error);
     // Check if the error object has a message property
     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during analysis.";
     return { error: `Analysis failed: ${errorMessage}` };
  }
}
