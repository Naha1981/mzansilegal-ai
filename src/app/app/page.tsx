
'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClientOnly } from '@/components/client-only';
import { Sparkles, Search, BookOpenCheck, FileText, Info, Loader2, Newspaper, FilePlus2, ChevronLeft } from 'lucide-react';
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
            <div className="w-full max-w-3xl flex items-center justify-between mb-2 animate-fade-in relative">
              <Link href="/" passHref>
                <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent absolute left-2 sm:left-0 top-1/2 -translate-y-1/2">
                  <ChevronLeft size={24} className="sm:hidden" />
                  <ChevronLeft size={28} className="hidden sm:block" />
                  <span className="sr-only">Back to Home</span>
                </Button>
              </Link>
              <div className="flex-grow flex items-center justify-center space-x-2 sm:space-x-3">
                <Image
                  src="https://ideogram.ai/assets/progressive-image/balanced/response/rC4tDYcAThW2P25_d3u9Gg"
                  alt="MzansiLegal AI Logo"
                  width={48}
                  height={48}
                  className="rounded w-10 h-10 sm:w-12 sm:h-12"
                  data-ai-hint="logo branding"
                />
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                  MzansiLegal AI
                </h1>
              </div>
              <div className="w-10 h-10"></div> {/* Spacer for balance */}
            </div>

            <p className="text-md sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 text-center animate-fade-in animation-delay-200 font-sans">
              AI-powered legal assistance for South African professionals
            </p>

             <button
                onClick={() => setShowDisclaimer((prev) => !prev)}
                className="mb-6 sm:mb-10 bg-red-600 animate-pulse hover:bg-red-700 text-white font-bold py-2 px-4 sm:px-5 rounded-full text-sm sm:text-base transition-all duration-300 flex items-center gap-2 font-sans"
            >
               <Info size={16} className="sm:size-18" /> {showDisclaimer ? 'Hide Disclaimer' : 'Show Disclaimer'}
            </button>

             <AnimatePresence>
               {showDisclaimer && (
                 <motion.div
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   transition={{ duration: 0.4, ease: "easeInOut" }}
                   className="overflow-hidden w-full max-w-3xl mb-6 sm:mb-8 font-sans"
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
               <CardHeader className="text-center pt-4 pb-3 sm:pt-6 sm:pb-4">
                   <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center font-serif">
                        Select an action
                   </CardTitle>
                   {currentDescription && (
                     <p className="text-xs sm:text-sm text-muted-foreground mt-1 px-2 font-sans">{currentDescription}</p>
                   )}
               </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 font-sans">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                        className={`flex items-center justify-start p-3 sm:p-4 transition-all duration-300 rounded-md text-xs sm:text-sm font-semibold h-auto min-h-[52px] sm:min-h-[60px] group
                          ${selectedType === type
                            ? 'bg-accent text-accent-foreground border-primary ring-2 ring-primary'
                            : 'bg-secondary text-secondary-foreground border-border hover:bg-accent hover:border-accent'
                          }`}
                         title={type}
                      >
                        <Icon className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-foreground" />
                         <span className="text-left text-foreground whitespace-normal break-words leading-tight">{type}</span>
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
                    rows={5}
                    className="bg-input border-border rounded-md p-2 sm:p-3 md:p-4 text-sm sm:text-base focus:ring-ring focus:border-ring focus:shadow-lg animated-input min-h-[100px] sm:min-h-[120px] md:min-h-[150px] text-foreground placeholder-muted-foreground"
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
                  className="w-full bg-primary text-primary-foreground font-bold text-md sm:text-lg py-2.5 sm:py-3 rounded-md uppercase tracking-wider transition-all duration-300 hover:shadow-xl hover:brightness-110 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      {selectedType === 'Doc Generation' ? 'Generating...' : (selectedType === 'Daily Legal News' ? 'Fetching...' : 'Analyzing...')}
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


            {isLoading && !analysisResult && (
               <div className="mt-6 sm:mt-8 text-center text-muted-foreground flex items-center justify-center font-sans">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
                    Fetching analysis...
                </div>
             )}


            {analysisResult && (
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-full max-w-3xl mt-6 sm:mt-8 md:mt-10"
              >
                <Card className="bg-card border-border rounded-lg shadow-xl">
                   <CardHeader className="pt-3 pb-2 sm:pt-4 sm:pb-2 md:pt-6 md:pb-3">
                      <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-primary flex items-center gap-2 justify-center font-serif">
                            <AnalysisResultIcon type={analysisResult.type} />
                        Results ({analysisResult.type})
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 md:p-6 font-sans">
                       <div className="prose prose-xs sm:prose-sm md:prose-base lg:prose-lg prose-invert max-w-none bg-background/50 p-3 sm:p-4 rounded-md overflow-x-auto max-h-[40vh] sm:max-h-[50vh] md:max-h-[60vh]">
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
