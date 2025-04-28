'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClientOnly } from '@/components/client-only'; // Import ClientOnly
import { Sparkles, Search, BookOpenCheck, FileText, Info, Loader2, Newspaper, FilePlus2 } from 'lucide-react'; // Added FilePlus2
import ReactMarkdown from 'react-markdown';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


// Import Genkit flow functions and types
import { legalResearchAssistant, LegalResearchAssistantInput, LegalResearchAssistantOutput } from '@/ai/flows/legal-research-assistant';
import { caseStudyInsights, CaseStudyInsightsInput, CaseStudyInsightsOutput } from '@/ai/flows/case-study-insights';
import { legalDocumentAnalysis, LegalDocumentAnalysisInput, LegalDocumentAnalysisOutput } from '@/ai/flows/legal-document-analysis';
import { dailyLegalNews, DailyLegalNewsOutput } from '@/ai/flows/daily-legal-news';
import { docGeneration, DocGenerationInput, DocGenerationOutput } from '@/ai/flows/doc-generation'; // Import new flow

type AnalysisType = 'Legal Research' | 'Case Study Analysis' | 'Contract Analysis' | 'Daily Legal News' | 'Doc Generation'; // Added Doc Generation

interface AnalysisResult {
  type: AnalysisType;
  input?: string; // Input might not be relevant for all types like news
  output: string;
}

// Functional component to render the icon based on analysis type
const AnalysisResultIcon = ({ type }: { type: AnalysisType }) => {
  switch (type) {
    case 'Legal Research':
       return <Search size={20} />; // Using base size, responsive handled in parent
    case 'Case Study Analysis':
       return <BookOpenCheck size={20} />;
    case 'Contract Analysis':
       return <FileText size={20} />;
    case 'Daily Legal News':
       return <Newspaper size={20} />;
     case 'Doc Generation': // Added Doc Generation icon
       return <FilePlus2 size={20} />;
    default:
      return null;
  }
};


export default function Home() {
  const [selectedType, setSelectedType] = useState<AnalysisType>('Legal Research');
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const analysisTypes: { type: AnalysisType; icon: React.ElementType; placeholder?: string; description?: string }[] = [
    { type: 'Legal Research', icon: Search, placeholder: 'Enter your legal research question or topic...' },
    { type: 'Case Study Analysis', icon: BookOpenCheck, placeholder: 'Describe the case details, facts, and desired outcome...' },
    { type: 'Contract Analysis', icon: FileText, placeholder: 'Paste the full contract text or describe it, including type, client context, and specific clauses of interest...' },
    { type: 'Doc Generation', icon: FilePlus2, placeholder: 'Describe the document needed (e.g., Letter of Demand to X regarding Y), context, and key points. Optionally paste reference text.', description: 'Automate and streamline your legal document generation process. Generate templates or draft correspondence/statements based on context and optional historical documents.' }, // Added Doc Generation
    { type: 'Daily Legal News', icon: Newspaper, placeholder: 'Click "Get News" for Daily Legal News' },
  ];

  const handleAnalysis = async () => {
    // Check input only if the type requires it
    if (selectedType !== 'Daily Legal News' && !inputText.trim()) {
      setError('Please enter some text for analysis/generation.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    console.log(`Starting process for: ${selectedType}`); // Log start

    try {
      let result: LegalResearchAssistantOutput | CaseStudyInsightsOutput | LegalDocumentAnalysisOutput | DailyLegalNewsOutput | DocGenerationOutput;
      let outputText: string | undefined;
      let analysisInput: AnalysisResult['input'] = inputText;

      // Prefix input only if necessary and not Daily News
      // For Doc Gen, the prompt handles parsing type/context, so prefixing might be less critical or different
      const fullInputText = (selectedType !== 'Daily Legal News' && selectedType !== 'Doc Generation') ? `${selectedType}: ${inputText}` : inputText;
      console.log("Input Text (prefixed for relevant types):", fullInputText);


      switch (selectedType) {
        case 'Legal Research':
           console.log("Calling legalResearchAssistant...");
          const researchInput: LegalResearchAssistantInput = { researchQuery: fullInputText };
          result = await legalResearchAssistant(researchInput);
          outputText = result.analysis;
           console.log("legalResearchAssistant finished.");
          break;
        case 'Case Study Analysis':
           console.log("Calling caseStudyInsights...");
          const caseInput: CaseStudyInsightsInput = { caseDetails: fullInputText };
          result = await caseStudyInsights(caseInput);
          outputText = result.analysis;
           console.log("caseStudyInsights finished.");
          break;
        case 'Contract Analysis':
           console.log("Calling legalDocumentAnalysis...");
          const contractInput: LegalDocumentAnalysisInput = { documentDetails: fullInputText };
          result = await legalDocumentAnalysis(contractInput);
          outputText = result.analysisReport;
           console.log("legalDocumentAnalysis finished.");
          break;
        case 'Doc Generation': // Added Doc Generation case
           console.log("Calling docGeneration...");
           // The flow expects specific fields, construct the input object
           // For simplicity, we'll just pass the raw text for now, assuming the user includes type/context
           // A more robust UI would have separate fields for type, context, historical docs
           const docGenInput: DocGenerationInput = {
               // Inferring docType might be tricky, prompt needs to handle this
               // Or add a dropdown/input for docType in the UI later
               docType: "User Defined", // Placeholder
               context: inputText, // Pass the main text area content as context
               // historicalDocs: "" // Add later if implementing uploads/separate input
           };
           result = await docGeneration(docGenInput);
           outputText = result.generatedDocument;
           console.log("docGeneration finished.");
           break;
        case 'Daily Legal News':
           console.log("Calling dailyLegalNews...");
          // Directly call the function which now handles fetching internally
          result = await dailyLegalNews(); // No input needed here
          outputText = result.newsReport;
          analysisInput = undefined; // No user input for news
          setInputText(''); // Clear input field for news
          console.log("dailyLegalNews finished.");
          break;
        default:
           console.error(`Invalid analysis type: ${selectedType}`);
           throw new Error('Invalid analysis type selected');
      }

       console.log("Raw Output:", outputText);

       if (!outputText) {
         console.warn("Analysis/Generation returned no output text.");
         // Attempt to get error message from potential output properties
         const errorAnalysis = (result as any)?.analysis || (result as any)?.analysisReport || (result as any)?.newsReport || (result as any)?.generatedDocument;
         if (typeof errorAnalysis === 'string' && errorAnalysis.toLowerCase().includes('error')) {
             console.error("Process returned an error message:", errorAnalysis);
             setError(errorAnalysis); // Show the error from the flow
         } else {
             console.error("Process returned empty or non-string output.");
             // Provide a more generic error if no specific message is found
             setError('Failed to return output. Please check the details or try again.');
         }
         setAnalysisResult(null);
       } else {
         console.log("Setting result.");
         setAnalysisResult({ type: selectedType, input: analysisInput, output: outputText });
       }

    } catch (err: any) {
      console.error("Process Error Caught:", err);
      setError(`Failed to perform action: ${err.message || 'Unknown error'}`);
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
      console.log("Analysis/Generation process finished.");
    }
  };


  const currentInfo = analysisTypes.find(t => t.type === selectedType);
  const currentPlaceholder = currentInfo?.placeholder || 'Enter your query or select an action...';
  const currentDescription = currentInfo?.description;


  return (
      // Ensure ClientOnly wraps the dynamic parts if hydration errors persist
      <main className="flex flex-col items-center justify-start min-h-screen p-4 sm:p-6 md:p-10 bg-gradient-to-br from-[#0D0D2B] to-[#161636] text-[#f5f5f5]">
       <ClientOnly>
         <>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#4ADE80] mb-2 text-center animate-fade-in drop-shadow-[0_2px_4px_rgba(74,222,128,0.4)]">
              MzansiLegal AI
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#A0AEC0] mb-6 md:mb-8 text-center animate-fade-in animation-delay-200">
              Your AI-powered assistant for South African Law
            </p>

            {/* Disclaimer Button */}
             <button
                onClick={() => setShowDisclaimer((prev) => !prev)}
                className="mb-10 bg-red-600 animate-pulse hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full text-base transition-all duration-300 flex items-center gap-2"
            >
               <Info size={18} /> {showDisclaimer ? 'Hide Disclaimer' : 'Show Disclaimer'}
            </button>

             {/* Animated Disclaimer Text */}
             <AnimatePresence>
               {showDisclaimer && (
                 <motion.div
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   transition={{ duration: 0.4, ease: "easeInOut" }}
                   className="overflow-hidden w-full max-w-3xl mb-8" // Adjusted margin
                 >
                   <Alert variant="destructive" className="bg-red-100/10 border border-red-400/30 text-red-200 p-4 rounded-lg text-sm shadow-md backdrop-blur-sm alert-destructive">
                     <AlertTitle className="font-semibold">Disclaimer</AlertTitle>
                     <AlertDescription>
                       This AI provides information for legal research and analysis. It is a tool to support, not replace, independent legal judgment. This output does not constitute legal advice and should not be relied upon as such. Always verify findings with primary legal sources and exercise professional discretion. Do not submit client confidential information.
                     </AlertDescription>
                   </Alert>
                 </motion.div>
               )}
             </AnimatePresence>


            <Card className="w-full max-w-3xl bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[28px] shadow-xl backdrop-blur-lg transition-all duration-300 hover:shadow-2xl hover:shadow-[#4ADE80]/10 animate-fade-in animation-delay-400">
               <CardHeader className="text-center pt-4 pb-2 sm:pt-6 sm:pb-2">
                   <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground text-center"> {/* Added text-center */}
                        Select Action
                   </CardTitle>
                   {currentDescription && ( // Show description if available for the selected type
                     <p className="text-xs sm:text-sm text-muted-foreground mt-1 px-2">{currentDescription}</p>
                   )}
               </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                 {/* Adjusted grid columns for 5 items */}
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 justify-center relative">
                  {analysisTypes.map(({ type, icon: Icon }) => (
                      <Button
                        key={type}
                        variant={selectedType === type ? 'default' : 'secondary'}
                        onClick={() => {
                           setSelectedType(type);
                           setInputText(''); // Clear text unless it's news? Maybe keep for Doc Gen?
                           setAnalysisResult(null);
                           setError(null);
                           }}
                        disabled={isLoading}
                        className={`flex-grow justify-center items-center transition-all duration-300 rounded-lg text-xs sm:text-sm font-semibold uppercase tracking-normal sm:tracking-wider relative overflow-hidden px-2 py-2 sm:px-4 sm:py-3 group hover:scale-[1.03] hover:shadow-md h-16 sm:h-20 flex-col sm:flex-row ${ // Increased height, allow flex-col on small screens
                          selectedType === type
                            ? 'bg-[#4ADE80] text-[#0D0D2B] shadow-lg shadow-[#4ADE80]/30 hover:bg-[#3BDC7F] hover:brightness-110'
                            : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                        }`}
                         title={type} // Add title for hover tooltip
                      >
                        <Icon className="mb-1 sm:mb-0 sm:mr-1 h-5 w-5 sm:h-5 sm:w-5 flex-shrink-0" /> {/* Adjusted margins */}
                         {/* Use span with line-clamp for multi-line truncation if needed */}
                         <span className="text-center sm:text-left overflow-hidden text-ellipsis line-clamp-2 sm:line-clamp-1">{type}</span>
                         {selectedType === type && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-1 bg-[#4ADE80]" // Changed to accent color for better visibility
                                layoutId="underline"
                                initial={false}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                         )}
                          {/* Optional: Add a subtle glow effect on hover for non-active buttons */}
                         <div className={`absolute inset-0 rounded-lg bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-10 ${selectedType === type ? 'hidden' : ''}`}></div>
                      </Button>
                  ))}
                </div>

                {selectedType !== 'Daily Legal News' && (
                  <Textarea
                    ref={textareaRef}
                    placeholder={currentPlaceholder}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={isLoading}
                    rows={6}
                    className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 text-sm sm:text-base focus:ring-[#4ADE80] focus:border-[#4ADE80] focus:shadow-lg focus:shadow-[#4ADE80]/20 transition-all duration-300 min-h-[120px] sm:min-h-[150px] animated-input"
                    aria-label="Input text for analysis or generation"
                  />
                )}

                 {error && (
                   <Alert variant="destructive" className="mt-4">
                     <Info className="h-4 w-4" />
                     <AlertTitle>Error</AlertTitle>
                     <AlertDescription>{error}</AlertDescription>
                   </Alert>
                 )}


                <Button
                  onClick={handleAnalysis}
                   disabled={isLoading || (selectedType !== 'Daily Legal News' && !inputText.trim())}
                  className="w-full bg-gradient-to-r from-[#4ADE80] to-[#3B82F6] text-white font-bold text-base sm:text-lg py-2.5 sm:py-3 rounded-lg uppercase tracking-wider transition-all duration-300 hover:shadow-xl hover:shadow-[#4ADE80]/40 hover:brightness-110 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      {selectedType === 'Doc Generation' ? 'Generating...' : 'Analyzing...'}
                      <div className="absolute inset-0 bg-white/20 animate-shimmer opacity-50 group-disabled:hidden"></div>
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                       {selectedType === 'Daily Legal News' ? 'Get News' : (selectedType === 'Doc Generation' ? 'Generate Document' : 'Analyze')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>


            {isLoading && !analysisResult && ( // Show loading indicator below card only when loading and no result yet
               <div className="mt-8 text-center text-gray-400 flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#4ADE80]" />
                    Fetching analysis...
                </div>
             )}


            {analysisResult && (
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-full max-w-3xl mt-8 md:mt-10"
              >
                <Card className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[28px] shadow-xl backdrop-blur-lg">
                   <CardHeader className="pt-4 pb-2 sm:pt-6 sm:pb-3">
                      <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-[#4ADE80] flex items-center gap-2 justify-center">
                           {/* Dynamic Icon based on result type */}
                            <AnalysisResultIcon type={analysisResult.type} />
                        Results ({analysisResult.type})
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                       {/* Apply prose styles for better Markdown rendering */}
                       <div className="prose prose-sm sm:prose-base md:prose-lg prose-invert max-w-none bg-black/20 p-4 rounded-lg overflow-x-auto max-h-[50vh] sm:max-h-[60vh]">
                          <ReactMarkdown>{analysisResult.output}</ReactMarkdown>
                      </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
         </>
        </ClientOnly>
      </main>
  );
}
