
'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image'; // Added import for Image component
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClientOnly } from '@/components/client-only';
import { Sparkles, Search, BookOpenCheck, FileText, Info, Loader2, Newspaper, FilePlus2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { legalResearchAssistant, LegalResearchAssistantInput, LegalResearchAssistantOutput } from '@/ai/flows/legal-research-assistant';
import { caseStudyInsights, CaseStudyInsightsInput, CaseStudyInsightsOutput } from '@/ai/flows/case-study-insights';
import { legalDocumentAnalysis, LegalDocumentAnalysisInput, LegalDocumentAnalysisOutput } from '@/ai/flows/legal-document-analysis';
import { dailyLegalNews, DailyLegalNewsOutput } from '@/ai/flows/daily-legal-news';
import { docGeneration, DocGenerationInput, DocGenerationOutput } from '@/ai/flows/doc-generation';

type AnalysisType = 'Legal Research' | 'Case Study Analysis' | 'Contract Analysis' | 'Doc Generation' | 'Daily Legal News';

interface AnalysisResult {
  type: AnalysisType;
  input?: string;
  output: string;
}

const AnalysisResultIcon = ({ type }: { type: AnalysisType }) => {
  const iconProps = { size: 20, className: "text-foreground" };
  switch (type) {
    case 'Legal Research': return <Search {...iconProps} />;
    case 'Case Study Analysis': return <BookOpenCheck {...iconProps} />;
    case 'Contract Analysis': return <FileText {...iconProps} />;
    case 'Doc Generation': return <FilePlus2 {...iconProps} />;
    case 'Daily Legal News': return <Newspaper {...iconProps} />;
    default: return null;
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
    { type: 'Doc Generation', icon: FilePlus2, placeholder: 'Describe the document needed (e.g., Letter of Demand), context, and key points. Optionally paste reference text.', description: 'Automate and streamline your legal document generation process.' },
    { type: 'Daily Legal News', icon: Newspaper, placeholder: 'Click "Get News" for Daily Legal News' },
  ];

  const handleAnalysis = async () => {
    if (selectedType !== 'Daily Legal News' && !inputText.trim()) {
      setError('Please enter some text for analysis/generation.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      let result: LegalResearchAssistantOutput | CaseStudyInsightsOutput | LegalDocumentAnalysisOutput | DailyLegalNewsOutput | DocGenerationOutput;
      let outputText: string | undefined;
      let analysisInput: AnalysisResult['input'] = inputText;
      const fullInputText = (selectedType !== 'Daily Legal News' && selectedType !== 'Doc Generation') ? `${selectedType}: ${inputText}` : inputText;

      switch (selectedType) {
        case 'Legal Research':
          result = await legalResearchAssistant({ researchQuery: fullInputText });
          outputText = result.analysis;
          break;
        case 'Case Study Analysis':
          result = await caseStudyInsights({ caseDetails: fullInputText });
          outputText = result.analysis;
          break;
        case 'Contract Analysis':
          result = await legalDocumentAnalysis({ documentDetails: fullInputText });
          outputText = result.analysisReport;
          break;
        case 'Doc Generation':
           const docGenInput: DocGenerationInput = {
               docType: "User Defined",
               context: inputText,
           };
           result = await docGeneration(docGenInput);
           outputText = result.generatedDocument;
           break;
        case 'Daily Legal News':
          result = await dailyLegalNews();
          outputText = result.newsReport;
          analysisInput = undefined;
          setInputText('');
          break;
        default: throw new Error('Invalid analysis type selected');
      }

       if (!outputText) {
         const errorMsg = (result as any)?.analysis || (result as any)?.analysisReport || (result as any)?.newsReport || (result as any)?.generatedDocument;
         if (typeof errorMsg === 'string' && errorMsg.toLowerCase().includes('error')) {
             setError(errorMsg);
         } else {
             setError('Failed to return output. Please check the details or try again.');
         }
         setAnalysisResult(null);
       } else {
         setAnalysisResult({ type: selectedType, input: analysisInput, output: outputText });
       }

    } catch (err: any) {
      setError(`Failed to perform action: ${err.message || 'Unknown error'}`);
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const currentInfo = analysisTypes.find(t => t.type === selectedType);
  const currentPlaceholder = currentInfo?.placeholder || 'Enter your query or select an action...';
  const currentDescription = currentInfo?.description;

  return (
      <main className="flex flex-col items-center justify-start min-h-screen p-4 sm:p-6 md:p-10 bg-background text-foreground font-serif">
       <ClientOnly>
         <>
            <div className="flex items-center justify-center space-x-3 mb-2 animate-fade-in">
              <Image
                src="https://ideogram.ai/assets/progressive-image/balanced/response/rC4tDYcAThW2P25_d3u9Gg"
                alt="MzansiLegal AI Logo"
                width={40}
                height={40}
                className="rounded"
                data-ai-hint="logo branding"
              />
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                MzansiLegal AI
              </h1>
            </div>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 md:mb-8 text-center animate-fade-in animation-delay-200 font-sans">
              AI-powered legal assistance for South African professionals
            </p>

             <button
                onClick={() => setShowDisclaimer((prev) => !prev)}
                className="mb-10 bg-red-600 animate-pulse hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full text-base transition-all duration-300 flex items-center gap-2 font-sans"
            >
               <Info size={18} /> {showDisclaimer ? 'Hide Disclaimer' : 'Show Disclaimer'}
            </button>

             <AnimatePresence>
               {showDisclaimer && (
                 <motion.div
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   transition={{ duration: 0.4, ease: "easeInOut" }}
                   className="overflow-hidden w-full max-w-3xl mb-8 font-sans"
                 >
                   <Alert variant="destructive" className="alert-destructive">
                     <AlertTitle className="font-semibold text-red-100">Disclaimer</AlertTitle>
                     <AlertDescription className="text-red-200">
                       This AI provides information for legal research and analysis. It is a tool to support, not replace, independent legal judgment. This output does not constitute legal advice and should not be relied upon as such. Always verify findings with primary legal sources and exercise professional discretion. Do not submit client confidential information.
                     </AlertDescription>
                   </Alert>
                 </motion.div>
               )}
             </AnimatePresence>

            <Card className="w-full max-w-3xl bg-card border-border rounded-lg shadow-xl transition-all duration-300 animate-fade-in animation-delay-400">
               <CardHeader className="text-center pt-6 pb-4">
                   <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground text-center font-serif">
                        Select an action
                   </CardTitle>
                   {currentDescription && (
                     <p className="text-sm text-muted-foreground mt-1 px-2 font-sans">{currentDescription}</p>
                   )}
               </CardHeader>

              <CardContent className="space-y-6 p-6 font-sans">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {analysisTypes.map(({ type, icon: Icon }) => (
                      <Button
                        key={type}
                        variant={selectedType === type ? 'default' : 'secondary'}
                        onClick={() => {
                           setSelectedType(type);
                           setInputText('');
                           setAnalysisResult(null);
                           setError(null);
                           }}
                        disabled={isLoading}
                        className={`flex items-center justify-start p-4 transition-all duration-300 rounded-md text-sm font-semibold h-auto min-h-[60px] group
                          ${selectedType === type
                            ? 'bg-accent text-accent-foreground border-primary ring-2 ring-primary'
                            : 'bg-secondary text-secondary-foreground border-border hover:bg-accent hover:border-accent'
                          }`}
                         title={type}
                      >
                        <Icon className="mr-3 h-6 w-6 flex-shrink-0 text-foreground" />
                         <span className="text-left text-foreground">{type}</span>
                         {selectedType === type && (
                            <motion.div
                                className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary"
                                layoutId="underline"
                                initial={false}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                         )}
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
                    className="bg-input border-border rounded-md p-3 sm:p-4 text-base focus:ring-ring focus:border-ring focus:shadow-lg animated-input min-h-[120px] sm:min-h-[150px] text-foreground placeholder-muted-foreground"
                    aria-label="Input text for analysis or generation"
                  />
                )}

                 {error && (
                   <Alert variant="destructive" className="mt-4 alert-destructive">
                     <Info className="h-4 w-4" />
                     <AlertTitle>Error</AlertTitle>
                     <AlertDescription>{error}</AlertDescription>
                   </Alert>
                 )}


                <Button
                  onClick={handleAnalysis}
                   disabled={isLoading || (selectedType !== 'Daily Legal News' && !inputText.trim())}
                  className="w-full bg-primary text-primary-foreground font-bold text-base sm:text-lg py-3 rounded-md uppercase tracking-wider transition-all duration-300 hover:shadow-xl hover:brightness-110 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {selectedType === 'Doc Generation' ? 'Generating...' : (selectedType === 'Daily Legal News' ? 'Fetching...' : 'Analyzing...')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                       {selectedType === 'Daily Legal News' ? 'Get News' : (selectedType === 'Doc Generation' ? 'Generate Document' : 'Analyze')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>


            {isLoading && !analysisResult && (
               <div className="mt-8 text-center text-muted-foreground flex items-center justify-center font-sans">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
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
                <Card className="bg-card border-border rounded-lg shadow-xl">
                   <CardHeader className="pt-4 pb-2 sm:pt-6 sm:pb-3">
                      <CardTitle className="text-xl sm:text-2xl font-semibold text-primary flex items-center gap-2 justify-center font-serif">
                            <AnalysisResultIcon type={analysisResult.type} />
                        Results ({analysisResult.type})
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 font-sans">
                       <div className="prose prose-sm sm:prose-base md:prose-lg prose-invert max-w-none bg-background/50 p-4 rounded-md overflow-x-auto max-h-[50vh] sm:max-h-[60vh]">
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
