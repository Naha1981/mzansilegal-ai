'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, Loader2, Newspaper, Search, BookOpenCheck, FileText, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Alert } from '@/components/ui/alert';
import { ClientOnly } from '@/components/client-only';

// Import Genkit flow functions and types
import { legalResearchAssistant, LegalResearchAssistantInput, LegalResearchAssistantOutput } from '@/ai/flows/legal-research-assistant';
import { caseStudyInsights, CaseStudyInsightsInput, CaseStudyInsightsOutput } from '@/ai/flows/case-study-insights';
import { legalDocumentAnalysis, LegalDocumentAnalysisInput, LegalDocumentAnalysisOutput } from '@/ai/flows/legal-document-analysis';
import { dailyLegalNews, DailyLegalNewsInput, DailyLegalNewsOutput } from '@/ai/flows/daily-legal-news';

type AnalysisType = 'Legal Research' | 'Case Study Analysis' | 'Contract Analysis' | 'Daily Legal News';

interface AnalysisResult {
  type: AnalysisType;
  input?: string;
  output: string;
}

// Functional component to render the icon
const AnalysisResultIcon = ({ type }: { type: AnalysisType }) => {
  switch (type) {
    case 'Legal Research':
      return <Search size={20} />;
    case 'Case Study Analysis':
      return <BookOpenCheck size={20} />;
    case 'Contract Analysis':
      return <FileText size={20} />;
    case 'Daily Legal News':
      return <Newspaper size={20} />;
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

  const analysisTypes: { type: AnalysisType; icon: React.ElementType; placeholder?: string }[] = [
    { type: 'Legal Research', icon: Search, placeholder: 'Enter your legal research question or topic...' },
    { type: 'Case Study Analysis', icon: BookOpenCheck, placeholder: 'Describe the case details, facts, and desired outcome...' },
    { type: 'Contract Analysis', icon: FileText, placeholder: 'Paste the full contract text or describe it, including type, client context, and specific clauses of interest...' },
    { type: 'Daily Legal News', icon: Newspaper },
  ];

  const handleAnalysis = async () => {
    if (selectedType !== 'Daily Legal News' && !inputText.trim()) {
      setError('Please enter some text for analysis.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      let result: LegalResearchAssistantOutput | CaseStudyInsightsOutput | LegalDocumentAnalysisOutput | DailyLegalNewsOutput;
      let outputText: string | undefined;
      let analysisInput: AnalysisResult['input'] = inputText;

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
          const newsInput: DailyLegalNewsInput = {};
          result = await dailyLegalNews(newsInput);
          outputText = result.newsReport;
          analysisInput = undefined;
          setInputText('');
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
  const currentPlaceholder = currentInfo?.placeholder || 'Click Analyze to get Daily Legal News';

  const cardTitleIcon = () => {
    if (analysisResult) {
      return <AnalysisResultIcon type={analysisResult.type} />;
    }
    return null;
  };

  return (
    <ClientOnly>
      <main className="flex flex-col items-center justify-start min-h-screen p-4 sm:p-6 md:p-10 bg-gradient-to-br from-[#0D0D2B] to-[#161636] text-[#f5f5f5]">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#4ADE80] mb-2 text-center animate-fade-in drop-shadow-[0_2px_4px_rgba(74,222,128,0.4)]">
          MzansiLegal AI
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-[#A0AEC0] mb-6 md:mb-8 text-center animate-fade-in animation-delay-200">
          Your AI-powered assistant for South African Law
        </p>

        <AnimatePresence>
        </AnimatePresence>

        <Card className="w-full max-w-3xl bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[28px] shadow-xl backdrop-blur-lg transition-all duration-300 hover:shadow-2xl hover:shadow-[#4ADE80]/10 animate-fade-in animation-delay-400">
           <CardHeader className="text-center pt-4 pb-2 sm:pt-6 sm:pb-2">
               <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">
                   Select Action
               </CardTitle>
           </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-3 justify-center relative">
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
                    className={`flex-grow justify-center transition-all duration-300 rounded-lg text-xs sm:text-sm font-semibold uppercase tracking-normal sm:tracking-wider relative overflow-hidden px-2 py-2 sm:px-4 sm:py-3 ${
                      selectedType === type
                        ? 'bg-[#4ADE80] text-[#0D0D2B] shadow-lg shadow-[#4ADE80]/30 hover:bg-[#3BDC7F] hover:brightness-110'
                        : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white hover:scale-105'
                    }`}
                  >
                    <Icon className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">{type}</span>
                     {selectedType === type && (
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 h-1 bg-[#4ADE80]"
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
                className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 text-sm sm:text-base focus:ring-[#4ADE80] focus:border-[#4ADE80] focus:shadow-lg focus:shadow-[#4ADE80]/20 transition-all duration-300 min-h-[120px] sm:min-h-[150px] animated-input"
                aria-label="Input text for analysis"
              />
            )}

            <Button
              onClick={handleAnalysis}
              disabled={isLoading || (selectedType !== 'Daily Legal News' && !inputText.trim())}
              className="w-full bg-gradient-to-r from-[#4ADE80] to-[#3B82F6] text-white font-bold text-base sm:text-lg py-2.5 sm:py-3 rounded-lg uppercase tracking-wider transition-all duration-300 hover:shadow-xl hover:shadow-[#4ADE80]/40 hover:brightness-110 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  Analyzing...
                  <div className="absolute inset-0 bg-white/20 animate-shimmer opacity-50 group-disabled:hidden"></div>
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                   {selectedType === 'Daily Legal News' ? 'Get News' : 'Analyze'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

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
                       {cardTitleIcon()}
                       Results ({analysisResult.type})
                  </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
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
