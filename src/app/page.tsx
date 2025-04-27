import { LegaleseAI } from '@/components/legalese-ai';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react"; // Import Info icon
import { ClientOnly } from '@/components/client-only';

export default function Home() {
  return (
    // Adjusted padding and ensures full height for gradient effect
    <main className="container mx-auto px-4 py-12 md:px-8 md:py-16 lg:px-12 lg:py-20 min-h-screen flex flex-col items-center relative overflow-hidden">
       {/* Optional: Placeholder for animated background - requires JS */}
       {/* <canvas id="particle-canvas"></canvas> */}

       {/* Hero Section */}
       <div className="text-center mb-12 z-10">
           <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500 animate-gradient-x"> {/* Gradient Text */}
               MzansiLegal AI
           </h1>
           <p className="text-2xl font-semibold text-muted-foreground max-w-3xl"> {/* Updated typography */}
               Your AI-powered assistant for Contract Analysis, Case Study Insights, and Legal Research in South African Law.
           </p>
       </div>


      {/* Disclaimer Section */}
      <ClientOnly>
         {/* Stylish semi-transparent card with soft red gradient */}
         <Alert className="max-w-3xl mb-10 border-destructive/30 text-destructive [&>svg]:text-destructive bg-gradient-to-r from-destructive/10 to-destructive/5 backdrop-blur-sm p-5 rounded-xl shadow-lg">
           <div className="flex items-start">
               <Info className="h-5 w-5 mr-3 flex-shrink-0" /> {/* Info icon */}
               <div>
                  <AlertTitle className="font-semibold text-lg mb-1">Disclaimer</AlertTitle> {/* Slightly larger title */}
                  {/* Smaller font for description, bold keywords */}
                  <AlertDescription className="text-sm"> {/* Smaller font */}
                      This AI provides information for legal research and analysis. It is a tool to support, not replace, independent legal judgment. This output does <strong className="font-bold">not constitute legal advice</strong> and should not be relied upon as such. Always verify findings with primary legal sources and exercise professional discretion. <strong className="font-bold">Do not submit client confidential information</strong>.
                  </AlertDescription>
              </div>
           </div>
        </Alert>
      </ClientOnly>

      {/* Analysis Section Component */}
      <LegaleseAI />
    </main>
  );
}

// Add gradient animation utility if not already present in tailwind config
// You might need to add this keyframe/animation to globals.css or tailwind.config.js
/*
@keyframes gradient-x {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 5s ease infinite;
}
*/
```