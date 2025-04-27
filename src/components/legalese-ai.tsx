
"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, FileText, BookOpenCheck, Search, AlertCircle } from "lucide-react";
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

  const handleTypeSelection = (type: AnalysisType) => {
    setSelectedAnalysisType(type);
    setQuery(""); // Clear query when type changes for better UX
    setResult(null);
    setError(null);
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


    startTransition(async () => {
      try {
        console.log(`Submitting query for ${selectedAnalysisType}:`, query);
        const response = await analyzeQuery(query, selectedAnalysisType);
        console.log("Analysis response:", response);
        if (response.error) {
          setError(response.error);
          setResult(null);
        } else {
          setResult(response.analysis || "No analysis provided.");
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
    // Wrap icon in ClientOnly
    return Icon ? <ClientOnly><Icon className="h-6 w-6 text-primary" /></ClientOnly> : null;
  };

  return (
    <div className="w-full max-w-3xl space-y-6">
      {/* Apply shadow and slightly adjust background for better contrast */}
      <Card className="shadow-lg bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Select Analysis Type & Enter Details</CardTitle>
          <CardDescription>
            Choose the type of analysis you need, then provide the necessary details or text below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Wrap the buttons section in ClientOnly */}
          <ClientOnly>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {analysisTypes.map(({ type, icon: Icon }) => (
                <Button
                  key={type}
                  variant={selectedAnalysisType === type ? "secondary" : "outline"}
                  onClick={() => handleTypeSelection(type)}
                  disabled={isPending}
                  className={cn(
                    "flex-grow sm:flex-grow-0 transition-all duration-200 hover:scale-105", // Allow wrap on small screens and add subtle hover effect
                     selectedAnalysisType === type && "ring-2 ring-primary ring-offset-2 bg-primary/20 text-primary-foreground" // Enhanced selected style
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {type}
                </Button>
              ))}
            </div>
          </ClientOnly>

          <Textarea
            placeholder={
              selectedAnalysisType === 'Contract Analysis'
                ? "Paste the full contract text here..."
                : selectedAnalysisType === 'Case Study Analysis'
                ? "Describe the case details..."
                : "Enter your legal research question or topic..." // Legal Research placeholder
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[150px] text-base resize-y bg-background/80 backdrop-blur-sm focus:ring-primary" // Input styling
            disabled={isPending}
          />
          <Button
            onClick={handleSubmit}
            disabled={isPending || !query.trim() || !selectedAnalysisType}
            className="w-full font-semibold text-lg py-3 transition-all duration-200 hover:bg-primary/90 hover:shadow-md" // Enhanced button style
           >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
              </>
            ) : (
              "Analyze"
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
         <Alert variant="destructive" className="shadow-lg bg-destructive/20 backdrop-blur-sm">
           <ClientOnly><AlertCircle className="h-4 w-4" /></ClientOnly>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isPending && (
        <Card className="shadow-lg bg-card/95 backdrop-blur-sm">
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
            <ClientOnly><Loader2 className="h-12 w-12 animate-spin text-primary" /></ClientOnly>
            <p className="text-muted-foreground">Processing your request for {selectedAnalysisType}...</p>
          </CardContent>
        </Card>
      )}

      {result && !isPending && (
         <Card className="shadow-lg bg-card/95 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-xl font-semibold text-primary">{selectedAnalysisType} Result</CardTitle>
             {getIconForAnalysisType()}
          </CardHeader>
          <CardContent>
             {/* Enhanced prose styles for readability */}
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground prose-headings:text-primary prose-a:text-accent hover:prose-a:text-accent/80 prose-strong:text-primary-foreground prose-strong:bg-primary/50 prose-strong:px-1 prose-strong:rounded">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
