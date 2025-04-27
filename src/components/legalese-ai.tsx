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
import { cn } from "@/lib/utils"; // Import cn for conditional class names

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
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<AnalysisType>('Legal Research'); // Default to Legal Research

  const handleTypeSelection = (type: AnalysisType) => {
    setSelectedAnalysisType(type);
    // Optionally clear query or result when type changes
    // setQuery("");
    // setResult(null);
    // setError(null);
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
    return Icon ? <Icon className="h-6 w-6 text-primary" /> : null;
  };

  return (
    <div className="w-full max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Analysis Type & Enter Details</CardTitle>
          <CardDescription>
            Choose the type of analysis you need, then provide the necessary details or text below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {analysisTypes.map(({ type, icon: Icon }) => (
              <Button
                key={type}
                variant={selectedAnalysisType === type ? "secondary" : "outline"}
                onClick={() => handleTypeSelection(type)}
                disabled={isPending}
                className={cn(
                  "flex-grow sm:flex-grow-0", // Allow wrap on small screens
                   selectedAnalysisType === type && "ring-2 ring-primary ring-offset-2"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {type}
              </Button>
            ))}
          </div>

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
            className="min-h-[150px] text-base resize-y"
            disabled={isPending}
          />
          <Button
            onClick={handleSubmit}
            disabled={isPending || !query.trim() || !selectedAnalysisType}
            className="w-full"
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
        <Alert variant="destructive">
           <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isPending && (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Processing your request for {selectedAnalysisType}...</p>
          </CardContent>
        </Card>
      )}

      {result && !isPending && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-xl font-semibold">AI Analysis Result ({selectedAnalysisType})</CardTitle>
            {getIconForAnalysisType()}
          </CardHeader>
          <CardContent>
            <div className="prose prose-blue dark:prose-invert max-w-none text-foreground">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
