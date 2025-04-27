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

export function LegaleseAI() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [analysisType, setAnalysisType] = useState<string | null>(null); // To show relevant icon

  const handleSubmit = () => {
    if (!query.trim()) {
      setError("Please enter a query.");
      return;
    }
    setError(null);
    setResult(null);
    setAnalysisType(null);

    startTransition(async () => {
      try {
        const response = await analyzeQuery(query);
        if (response.error) {
          setError(response.error);
          setResult(null);
        } else {
          setResult(response.analysis || "No analysis provided.");
          // Determine analysis type for icon based on keywords (simple check)
          if (query.toLowerCase().includes("contract analysis")) {
            setAnalysisType("Contract Analysis");
          } else if (query.toLowerCase().includes("case study analysis")) {
            setAnalysisType("Case Study Analysis");
          } else if (query.toLowerCase().includes("legal research")) {
            setAnalysisType("Legal Research");
          } else {
             setAnalysisType(null); // If no keywords, might be an error or general response
          }
        }
      } catch (err) {
        console.error("Analysis failed:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred during analysis.");
        setResult(null);
      }
    });
  };

  const getIconForAnalysisType = () => {
    switch (analysisType) {
      case "Contract Analysis":
        return <FileText className="h-6 w-6 text-primary" />;
      case "Case Study Analysis":
        return <BookOpenCheck className="h-6 w-6 text-primary" />;
      case "Legal Research":
        return <Search className="h-6 w-6 text-primary" />;
      default:
        return null; // No icon if type is unknown or response is error
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enter Your Legal Query</CardTitle>
          <CardDescription>
            Specify "Contract Analysis", "Case Study Analysis", or "Legal Research" followed by your details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., Legal Research: What are the requirements for a valid will in South African law..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[150px] text-base resize-y"
            disabled={isPending}
          />
          <Button onClick={handleSubmit} disabled={isPending || !query.trim()} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
              </>
            ) : (
              "Analyze Query"
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
            <p className="text-muted-foreground">Processing your request...</p>
          </CardContent>
        </Card>
      )}

      {result && !isPending && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-xl font-semibold">AI Analysis</CardTitle>
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
