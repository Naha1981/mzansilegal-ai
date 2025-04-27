
"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, FileText, BookOpenCheck, Search, AlertCircle, CheckCircle } from "lucide-react"; // Added CheckCircle
import { analyzeQuery } from "@/app/actions";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from "@/lib/utils";
import { ClientOnly } from '@/components/client-only';

type AnalysisType = 'Legal Research' | 'Case Study Analysis' | 'Contract Analysis';

const analysisTypes: { type: AnalysisType; icon: React.ElementType }[] = [
  { type: 'Legal Research', icon: Search },
  { type: 'Case Study Analysis', icon: BookOpenCheck },
  { type: 'Contract Analysis', icon: FileText },
];

export function LegaleseAI() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<AnalysisType>('Legal Research');
  const [showSuccess, setShowSuccess] = useState(false); // State for success animation

  const handleTypeSelection = (type: AnalysisType) => {
    setSelectedAnalysisType(type);
    setQuery("");
    setResult(null);
    setError(null);
    setShowSuccess(false); // Reset success state
  };

  const handleSubmit = () => {
    if (!query.trim()) {
      setError("Please enter your details or query.");
      return;
    }
    if (!selectedAnalysisType) {
        setError("Please select an analysis type.");
        return;
    }
    setError(null);
    setResult(null);
    setShowSuccess(false); // Reset success state

    startTransition(async () => {
      try {
        const response = await analyzeQuery(query, selectedAnalysisType);
        if (response.error) {
          setError(response.error);
          setResult(null);
        } else {
          setResult(response.analysis || "No analysis provided.");
          setShowSuccess(true); // Show success animation
          // Optional: Hide success animation after a delay
          setTimeout(() => setShowSuccess(false), 2000);
        }
      } catch (err) {
        console.error("Analysis failed:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred during analysis.");
        setResult(null);
      }
    });
  };

  const getIconForAnalysisType = (type: AnalysisType | null = selectedAnalysisType) => {
    const analysis = analysisTypes.find(t => t.type === type);
    const Icon = analysis?.icon;
    return Icon ? <ClientOnly><Icon className="h-6 w-6 text-primary" /></ClientOnly> : null;
  };

  return (
    <div className="w-full max-w-3xl space-y-8 z-10"> {/* Increased spacing */}
      {/* Apply glassmorphism effect and center align */}
      <Card className="glassmorphism-card p-2 sm:p-4 md:p-6"> {/* Add padding for inner content spacing */}
        <CardHeader className="text-center"> {/* Center header text */}
          <CardTitle className="text-xl md:text-2xl font-semibold">Select Analysis Type & Enter Details</CardTitle> {/* Adjusted size */}
          <CardDescription className="text-base text-muted-foreground"> {/* Adjusted size */}
            Choose the type of analysis, then provide the details below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6"> {/* Increased spacing */}
          {/* Tab-like Buttons with animated underline */}
          <ClientOnly>
            <div className="flex justify-center border-b border-border/20 mb-6">
              {analysisTypes.map(({ type, icon: Icon }) => (
                <button
                  key={type}
                  data-state={selectedAnalysisType === type ? 'active' : 'inactive'} // State for CSS selector
                  onClick={() => handleTypeSelection(type)}
                  disabled={isPending}
                  className={cn(
                    "tab-button flex-1 sm:flex-none sm:px-6 py-3 text-lg font-semibold text-center transition-colors duration-200 relative", // Base tab style
                    selectedAnalysisType === type ? "text-primary" : "text-muted-foreground hover:text-foreground", // Active/inactive colors
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  <Icon className="inline-block mr-2 h-5 w-5 align-middle" /> {/* Adjusted icon size/alignment */}
                  <span className="align-middle">{type}</span>
                </button>
              ))}
            </div>
          </ClientOnly>

          <Textarea
            placeholder={
              selectedAnalysisType === 'Contract Analysis'
                ? "Paste the full contract text here..."
                : selectedAnalysisType === 'Case Study Analysis'
                ? "Describe the case details..."
                : "Enter your legal research question or topic..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="animated-input min-h-[180px] text-base resize-y bg-background/10 backdrop-blur-sm focus:ring-primary border-border/30" // Animated input class
            disabled={isPending}
          />
          <Button
            onClick={handleSubmit}
            disabled={isPending || !query.trim() || !selectedAnalysisType}
             className={cn(
                 "w-full font-bold text-lg uppercase py-4 transition-all duration-200 hover:bg-primary/90 hover:shadow-lg relative overflow-hidden", // Uppercase, larger padding
                 isPending && "button-loading" // Apply shimmer effect when loading
             )}
           >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...
              </>
            ) : showSuccess ? ( // Show success animation
              <span className="flex items-center justify-center animate-pulse"> {/* Simple pulse animation */}
                 <CheckCircle className="mr-2 h-5 w-5 text-accent" /> Complete
              </span>
            ) : (
              "Analyze"
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
         <Alert variant="destructive" className="glassmorphism-card border-destructive/50 p-5">
           <div className="flex items-start">
              <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              <div>
                  <AlertTitle className="font-semibold text-lg mb-1">Error</AlertTitle>
                  <AlertDescription className="text-sm">{error}</AlertDescription>
               </div>
           </div>
        </Alert>
      )}

      {/* Loading Indicator uses glassmorphism */}
      {isPending && !result && (
        <Card className="glassmorphism-card p-6">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <ClientOnly><Loader2 className="h-12 w-12 animate-spin text-primary" /></ClientOnly>
            <p className="text-muted-foreground text-lg">Processing your {selectedAnalysisType} request...</p>
             {/* Optional: Typing dots simulation */}
             {/* <div className="flex space-x-1 mt-2">
               <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
               <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
               <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
             </div> */}
          </CardContent>
        </Card>
      )}

      {result && !isPending && (
         <Card className="glassmorphism-card p-4 md:p-6"> {/* Glassmorphism result card */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border/20 mb-4"> {/* Added border */}
             <CardTitle className="text-xl font-semibold text-primary">{selectedAnalysisType} Result</CardTitle>
             {getIconForAnalysisType()}
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground prose-headings:text-primary prose-a:text-accent hover:prose-a:text-accent/80 prose-strong:text-foreground prose-strong:font-semibold prose-p:text-muted-foreground prose-li:text-muted-foreground"> {/* Adjusted prose styles */}
               <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Add bounce animation if not already present
/*
@keyframes bounce {
  0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
  50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
}
.animate-bounce {
  animation: bounce 1s infinite;
}
*/

```