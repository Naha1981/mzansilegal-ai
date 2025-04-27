"use server";

import { legalResearchAssistant } from "@/ai/flows/legal-research-assistant";
import { caseStudyInsights } from "@/ai/flows/case-study-insights";
import { legalDocumentAnalysis } from "@/ai/flows/legal-document-analysis";

// Define the possible analysis types
type AnalysisType = 'Legal Research' | 'Case Study Analysis' | 'Contract Analysis';

export async function analyzeQuery(
    query: string,
    analysisType: AnalysisType // Explicitly pass the analysis type
): Promise<{ analysis?: string | null; error?: string }> {

  console.log(`Received request for ${analysisType}`);

  try {
    switch (analysisType) {
      case "Contract Analysis":
        console.log("Routing to Legal Document Analysis...");
        // Assume query contains the document text.
        // ContractType and ClientInstructions might need more sophisticated extraction
        // or separate input fields in a more complex UI.
        const contractResponse = await legalDocumentAnalysis({
          documentText: query,
          contractType: "Provided in text", // Placeholder
          clientInstructions: "Analyze the provided contract text.", // Placeholder
        });
        console.log("Legal Document Analysis response:", contractResponse);
        return { analysis: contractResponse.analysisReport };

      case "Case Study Analysis":
        console.log("Routing to Case Study Insights...");
        // Assume query contains the case details.
        const caseResponse = await caseStudyInsights({
          caseDetails: query,
        });
        console.log("Case Study Insights response:", caseResponse);
        return { analysis: caseResponse.analysis };

      case "Legal Research":
        console.log("Routing to Legal Research Assistant...");
        const researchResponse = await legalResearchAssistant({
          researchQuery: query,
        });
        console.log("Legal Research Assistant response:", researchResponse);
        return { analysis: researchResponse.analysis };

      default:
        // This case should technically not be reachable if the UI enforces selection
        console.log("Unknown analysis type specified.");
        return { error: "An unknown analysis type was specified. Please select a valid type." };
    }
  } catch (error) {
     console.error(`Error during ${analysisType}:`, error);
     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during analysis.";
     return { error: `Analysis failed: ${errorMessage}` };
  }
}
