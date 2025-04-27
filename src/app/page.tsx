import { LegaleseAI } from '@/components/legalese-ai';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { ClientOnly } from '@/components/client-only'; // Import ClientOnly

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8 lg:p-12 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4 text-primary">
        MzansiLegal AI
      </h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl">
        Your AI-powered assistant for Contract Analysis, Case Study Insights, and Legal Research in South African Law.
      </p>

      {/* Wrap the Alert in ClientOnly to prevent hydration issues */}
      <ClientOnly>
        <Alert className="max-w-3xl mb-8 border-destructive/50 text-destructive [&>svg]:text-destructive">
          {/* Use ClientOnly for the icon too */}
          <ClientOnly><Terminal className="h-4 w-4" /></ClientOnly>
          <AlertTitle>Disclaimer</AlertTitle>
          <AlertDescription>
            This AI provides information for legal research and analysis. It is a tool to support, not replace, independent legal judgment. This output does not constitute legal advice and should not be relied upon as such. Always verify findings with primary legal sources and exercise professional discretion. Do not submit client confidential information.
          </AlertDescription>
        </Alert>
      </ClientOnly>

      <LegaleseAI />
    </main>
  );
}
