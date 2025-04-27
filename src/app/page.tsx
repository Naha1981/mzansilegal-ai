
'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ClientOnly } from '@/components/client-only';
import { Sparkles, Search, BookOpenCheck, FileText, Info, Loader2, Newspaper } from 'lucide-react'; // Added Newspaper
import ReactMarkdown from 'react-markdown';

// Import Genkit flow functions and types
import { legalResearchAssistant, LegalResearchAssistantInput, LegalResearchAssistantOutput } from '@/ai/flows/legal-research-assistant';
import { caseStudyInsights, CaseStudyInsightsInput, CaseStudyInsightsOutput } from '@/ai/flows/case-study-insights';
import { legalDocumentAnalysis, LegalDocumentAnalysisInput, LegalDocumentAnalysisOutput } from '@/ai/flows/legal-document-analysis';
import { dailyLegalNews, DailyLegalNewsInput, DailyLegalNewsOutput } from '@/ai/flows/daily-legal-news'; // Added Daily Legal News

type AnalysisType = 'Legal Research' | 'Case Study Analysis' | 'Contract Analysis' | 'Daily Legal News'; // Added Daily Legal News

interface AnalysisResult {
  type: AnalysisType;
  input?: string; // Input is optional for news
  output: string;
}

export default function Home() {
  const [selectedType, setSelectedType] = useState<AnalysisType>('Legal Research');
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const analysisTypes: { type: AnalysisType; icon: React.ElementType; placeholder?: string }[] = [ // Made placeholder optional
    { type: 'Legal Research', icon: Search, placeholder: 'Enter your legal research question or topic...' },
    { type: 'Case Study Analysis', icon: BookOpenCheck, placeholder: 'Describe the case details, facts, and desired outcome...' },
    { type: 'Contract Analysis', icon: FileText, placeholder: 'Paste the full contract text or describe it, including type, client context, and specific clauses of interest...' },
    { type: 'Daily Legal News', icon: Newspaper }, // Added Daily Legal News - no placeholder needed
  ];

  const handleAnalysis = async () => {
    // For news, no input text is required
    if (selectedType !== 'Daily Legal News' && !inputText.trim()) {
      setError('Please enter some text for analysis.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null); // Clear previous results

    try {
      let result: LegalResearchAssistantOutput | CaseStudyInsightsOutput | LegalDocumentAnalysisOutput | DailyLegalNewsOutput;
      let outputText: string | undefined;
      let analysisInput: AnalysisResult['input'] = inputText; // Store input for result display

      // Automatically prepend the analysis type to the input text for the LLM, except for News
      const fullInputText = selectedType !== 'Daily Legal News' ? `${selectedType}: ${inputText}` : '';

      switch (selectedType) {
        case 'Legal Research':
          const researchInput: LegalResearchAssistantInput = { researchQuery: fullInputText };
          result = await legalResearchAssistant(researchInput);
          outputText = result.analysis;
          break;
        case 'Case Study Analysis':
          const caseInput: CaseStudyInsightsInput = { caseDetails: fullInputText };
          result = await caseStudyInsights(caseInput);
          outputText = result.analysis;
          break;
        case 'Contract Analysis':
          const contractInput: LegalDocumentAnalysisInput = { documentDetails: fullInputText };
          result = await legalDocumentAnalysis(contractInput);
          outputText = result.analysisReport;
          break;
        case 'Daily Legal News':
          const newsInput: DailyLegalNewsInput = {}; // No input needed
          result = await dailyLegalNews(newsInput);
          outputText = result.newsReport;
          analysisInput = undefined; // No user input for news
          setInputText(''); // Clear input area for news
          break;
        default:
           throw new Error('Invalid analysis type selected');
      }

       if (!outputText) {
         const errorAnalysis = (result as any)?.analysis || (result as any)?.analysisReport || (result as any)?.newsReport;
         if (typeof errorAnalysis === 'string' && errorAnalysis.toLowerCase().includes('error')) {
             setError(errorAnalysis);
         } else {
             throw new Error('Analysis did not return any output.');
         }
         setAnalysisResult(null);
       } else {
         setAnalysisResult({ type: selectedType, input: analysisInput, output: outputText });
       }

    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError(`Failed to perform analysis: ${err.message || 'Unknown error'}`);
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const currentInfo = analysisTypes.find(t => t.type === selectedType);
  const currentPlaceholder = currentInfo?.placeholder || 'Click Analyze to get Daily Legal News'; // Placeholder for news

  return (
    <ClientOnly>
      <main className="flex flex-col items-center justify-start min-h-screen p-6 sm:p-10 bg-gradient-to-br from-[#0D0D2B] to-[#161636] text-[#f5f5f5]">

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#4ADE80] mb-2 text-center animate-fade-in drop-shadow-[0_2px_4px_rgba(74,222,128,0.4)]">
          MzansiLegal AI
        </h1>
        <p className="text-lg md:text-xl text-[#A0AEC0] mb-8 text-center animate-fade-in animation-delay-200">
          Your AI-powered assistant for South African Law
        </p>

        <button
            onClick={() => setShowDisclaimer((prev) => !prev)}
            className="mb-10 bg-red-600 animate-pulse hover:bg-red-700 hover:scale-105 text-white font-bold py-2 px-5 rounded-full text-base transition-all duration-300 flex items-center gap-2"
        >
            <Info size={18} /> {showDisclaimer ? 'Hide Disclaimer' : 'Show Disclaimer'}
        </button>

        <AnimatePresence>
          {showDisclaimer && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden w-full max-w-2xl mb-10" // Added mb-10 for spacing
            >
              <div className="bg-[rgba(254,226,226,0.1)] border border-red-400/30 text-red-200 p-5 rounded-lg text-sm shadow-md backdrop-blur-sm">
                <strong className="font-semibold text-red-100">Disclaimer:</strong> This AI provides information for legal research and analysis. It is a tool to support, not replace, independent legal judgment. This output does not constitute legal advice and should not be relied upon as such. Always verify findings with primary legal sources and exercise professional discretion. <strong className="text-red-100">Do not submit client confidential information.</strong>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="w-full max-w-3xl bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[28px] shadow-xl backdrop-blur-lg transition-all duration-300 hover:shadow-2xl hover:shadow-[#4ADE80]/10 animate-fade-in animation-delay-400">
           <CardHeader className="text-center pt-6 pb-2"> {/* Adjusted padding */}
               <CardTitle className="text-xl md:text-2xl font-semibold text-foreground">
                   Select Action
               </CardTitle>
           </CardHeader>

          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
              {analysisTypes.map(({ type, icon: Icon }) => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'secondary'}
                  onClick={() => {
                     setSelectedType(type);
                     setInputText(''); // Clear input when changing type
                     setAnalysisResult(null); // Clear results when changing type
                     setError(null); // Clear error when changing type
                     }}
                  disabled={isLoading}
                  className={`flex-grow justify-center transition-all duration-300 rounded-lg text-base font-semibold uppercase tracking-wider relative overflow-hidden px-4 py-3 ${
                    selectedType === type
                      ? 'bg-[#4ADE80] text-[#0D0D2B] shadow-lg shadow-[#4ADE80]/30 hover:bg-[#3BDC7F] hover:brightness-110' // Enhanced active style with hover
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white hover:scale-105' // Enhanced inactive style with hover
                  }`}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {type}
                   {selectedType === type && (
                      <motion.div
                          className="absolute bottom-0 left-0 right-0 h-1 bg-[#4ADE80]" // Was already green, kept it
                          layoutId="underline"
                          initial={false}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                   )}
                </Button>
              ))}
            </div>

            {/* Only show Textarea if not Daily Legal News */}
            {selectedType !== 'Daily Legal News' && (
              <Textarea
                ref={textareaRef}
                placeholder={currentPlaceholder}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
                rows={8}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-base focus:ring-[#4ADE80] focus:border-[#4ADE80] focus:shadow-lg focus:shadow-[#4ADE80]/20 transition-all duration-300 min-h-[150px] animated-input"
                aria-label="Input text for analysis"
              />
            )}

            <Button
              onClick={handleAnalysis}
              disabled={isLoading || (selectedType !== 'Daily Legal News' && !inputText.trim())} // Check input only if not news
              className="w-full bg-gradient-to-r from-[#4ADE80] to-[#3B82F6] text-white font-bold text-lg py-3 rounded-lg uppercase tracking-wider transition-all duration-300 hover:shadow-xl hover:shadow-[#4ADE80]/40 hover:brightness-110 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                  <div className="absolute inset-0 bg-white/20 animate-shimmer opacity-50 group-disabled:hidden"></div>
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                   {selectedType === 'Daily Legal News' ? 'Get News' : 'Analyze'} {/* Dynamic button text */}
                </>
              )}
            </Button>

            {error && (
              <Alert variant="destructive" className="alert-destructive">
                <Info className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {analysisResult && (
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full max-w-3xl mt-10"
          >
            <Card className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[28px] shadow-xl backdrop-blur-lg">
              <CardHeader>
                  <CardTitle className="text-xl md:text-2xl font-semibold text-[#4ADE80] flex items-center gap-2">
                       {/* Use appropriate icon for result type */}
                       {analysisResult.type === 'Legal Research' && <Search size={24} />}
                       {analysisResult.type === 'Case Study Analysis' && <BookOpenCheck size={24} />}
                       {analysisResult.type === 'Contract Analysis' && <FileText size={24} />}
                       {analysisResult.type === 'Daily Legal News' && <Newspaper size={24} />}
                       Results ({analysisResult.type})
                  </CardTitle>
              </CardHeader>
              <CardContent>
                   <div className="prose prose-invert max-w-none text-white/90 bg-black/20 p-4 rounded-lg overflow-x-auto">
                      <ReactMarkdown>{analysisResult.output}</ReactMarkdown>
                  </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </ClientOnly>
  );
}
