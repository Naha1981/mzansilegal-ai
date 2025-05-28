
'use client'; 

import React from 'react';
import Link from 'next/link'; 
import { motion } from 'framer-motion';
import { ClientOnly } from '@/components/client-only'; 
import { cn } from '@/lib/utils'; 
import { useTheme } from 'next-themes';
import { Moon, Sun, FileText, BookOpenCheck, Search, Newspaper, FilePlus2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image'; 

const MzansiLegalLogo = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center space-x-1 sm:space-x-2", className)}>
    <Image
      src="https://ideogram.ai/assets/progressive-image/balanced/response/rC4tDYcAThW2P25_d3u9Gg"
      alt="MzansiLegal AI Logo"
      width={32} 
      height={32}
      className="flex-shrink-0 rounded sm:w-9 sm:h-9" 
      data-ai-hint="logo branding"
    />
    <span className="text-lg sm:text-xl font-semibold text-gray-100">MzansiLegal AI</span>
  </div>
);

const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function LandingPage() {
  return (
    <div className="font-poppins text-[#f5f5f5] min-h-screen overflow-x-hidden bg-slate-900">

      <ClientOnly>
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeDown}
          className="bg-stone-800 sticky top-0 z-50 py-2.5 sm:py-3 px-4 sm:px-8 md:px-12 flex justify-between items-center shadow-md"
        >
          <Link href="/" aria-label="Go to MzansiLegal AI Home">
            <MzansiLegalLogo className="cursor-pointer transition-transform duration-300 hover:scale-105" />
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <nav className="hidden sm:flex space-x-3 md:space-x-5 items-center">
              <Link href="/#features" className="font-medium text-gray-300 hover:text-amber-400 transition-colors duration-300 text-xs sm:text-sm">
                Features
              </Link>
              <Link href="/#pricing" className="font-medium text-gray-300 hover:text-amber-400 transition-colors duration-300 text-xs sm:text-sm">
                Pricing
              </Link>
            </nav>
            <Link href="/app" passHref>
              <Button
                variant="default"
                className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold text-xs px-3 py-1.5 sm:text-sm sm:px-4 sm:py-2 rounded-md"
              >
                Get Started
              </Button>
            </Link>
            <div className="hidden sm:block"> 
              <ThemeToggle />
            </div>
          </div>
           <div className="sm:hidden flex items-center gap-2">
             <ThemeToggle />
           </div>
        </motion.header>
      </ClientOnly>

       <ClientOnly>
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="py-12 sm:py-16 md:py-20 px-4 sm:px-8 bg-slate-900"
          >
            <div className="container mx-auto grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-100 !leading-tight"> 
                  AI-Powered<br />Legal<br />Assistance
                </h1>
                <p className="text-sm sm:text-base md:text-lg max-w-md mx-auto md:mx-0 mb-6 sm:mb-8 text-gray-400">
                  Transforming South African law practice with advanced AI tool for legal research and contract analysis.
                </p>
                <Link href="/#features" passHref>
                  <Button
                    variant="default"
                    size="lg" 
                    className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold px-5 py-2 sm:px-6 md:py-2.5 rounded-md text-xs sm:text-sm md:text-base"
                  >
                    Explore Features
                  </Button>
                </Link>
              </div>
              <div className="flex justify-center items-center mt-8 md:mt-0">
                <div className="w-full max-w-[300px] sm:max-w-[380px] md:max-w-[420px] mx-auto">
                    <Image
                      src="https://ideogram.ai/assets/progressive-image/balanced/response/JRiQSuWWS-urwlo5-L6Tqg"
                      alt="AI Legal Concept Illustration"
                      width={450} 
                      height={350}
                      priority
                      className="rounded-lg object-cover shadow-2xl border-2 border-amber-500/30 w-full h-auto"
                      data-ai-hint="AI law"
                    />
                </div>
              </div>
            </div>
          </motion.section>
       </ClientOnly>

       <ClientOnly>
         <motion.section
           id="features"
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, amount: 0.2 }} 
           variants={fadeUp}
           className="py-12 sm:py-16 md:py-20 px-4 sm:px-5 text-center bg-slate-800/70 backdrop-blur-md"
         >
           <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 sm:mb-12 text-amber-400">Core Features</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 max-w-7xl mx-auto">
             <FeatureCard icon={<Search size={20} className="sm:size-24" />} title="Legal Research" description="Comprehensive SA & International research." />
             <FeatureCard icon={<BookOpenCheck size={20} className="sm:size-24" />} title="Case Study Analysis" description="Insights from historical cases & precedents." />
             <FeatureCard icon={<FileText size={20} className="sm:size-24" />} title="Contract Analysis" description="Identify key clauses, assess risks." />
             <FeatureCard icon={<FilePlus2 size={20} className="sm:size-24" />} title="Doc Generation" description="Automate templates, correspondence & statements." />
             <FeatureCard icon={<Newspaper size={20} className="sm:size-24" />} title="Daily Legal News" description="Stay updated with curated legal news feeds." />
           </div>
         </motion.section>
       </ClientOnly>

      <ClientOnly>
        <motion.section
          id="pricing"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="bg-slate-900 py-12 sm:py-16 md:py-20 px-4 sm:px-5 text-center"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 sm:mb-12 text-amber-400">Simple, Transparent Pricing</h2>
          <div className="flex flex-wrap justify-center items-stretch gap-4 sm:gap-6 md:gap-8"> 
            <PricingCard
              title="Starter"
              price="R500"
              description="For law students, legal interns, and individual researchers."
              features={[
                "AI Legal Assistant (basic)",
                "Legal Research (South Africa only, 20 queries/month)",
                "Daily Legal News (5 articles/day)",
                "Disclaimer notice",
                "Full UI Access",
              ]}
              trialText="3-day free trial available"
            />
            <PricingCard
              title="Professional"
              price="R1000"
              description="For solo attorneys, small practices, and legal consultants."
              features={[
                "AI Legal Assistant (advanced prompts, faster processing)",
                "Legal Research (South Africa + selected international jurisdictions)",
                "Case Study Analysis (basic: 5 cases/month)",
                "Contract Analysis (5 contracts/month)",
                "Daily Legal News (10+ articles/day)",
                "Disclaimer",
                "Full UI Access",
              ]}
              trialText="3-day free trial available"
              highlighted
            />
            <PricingCard
              title="Enterprise"
              price="R1500"
              description="For law firms, corporate legal teams, and serious users."
              features={[
                "AI Legal Assistant (unlimited use, priority speed)",
                "Legal Research (full access to South African + international law databases)",
                "Case Study Analysis (unlimited cases, outcome prediction scoring)",
                "Contract Analysis (unlimited uploads, advanced clause suggestions)",
                "Daily Legal News (priority feed, customizable alerts)",
                "Customizable Disclaimer",
                "Premium UI themes (dark mode + custom branding options)",
                "Dedicated onboarding + premium support",
                "API access (on request)",
              ]}
              trialText="3-day free trial available"
            />
          </div>
          <div className="overflow-x-auto mt-10 sm:mt-12 md:mt-16">
             <motion.table
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, amount: 0.3 }}
               variants={fadeUp}
               className="w-full max-w-4xl mx-auto text-left text-xs sm:text-sm bg-stone-800/50 backdrop-blur-sm rounded-lg border border-stone-700 shadow-lg"
             >
              <caption className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 text-gray-300 p-3 sm:p-4">Feature Comparison</caption>
              <thead>
                <tr className="text-amber-400 border-b border-stone-700">
                    <th className="py-2 px-2 sm:px-3 md:px-4 font-semibold">Feature</th>
                    <th className="py-2 px-2 sm:px-3 md:px-4 text-center font-semibold">Starter (R500)</th>
                    <th className="py-2 px-2 sm:px-3 md:px-4 text-center font-semibold">Professional (R1000)</th>
                    <th className="py-2 px-2 sm:px-3 md:px-4 text-center font-semibold">Enterprise (R1500)</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <ComparisonRow feature="AI Legal Assistance" starter="Limited" professional="Full" enterprise="Unlimited" />
                <ComparisonRow feature="Legal Research" starter="SA Only" professional="SA + Intl" enterprise="Full Access" />
                <ComparisonRow feature="Case Study Analysis" starter="❌" professional="Basic (5/month)" enterprise="Unlimited" />
                <ComparisonRow feature="Contract Analysis" starter="❌" professional="5 docs/month" enterprise="Unlimited" />
                <ComparisonRow feature="Doc Generation" starter="❌" professional="Basic" enterprise="Advanced (inc. Training)" />
                <ComparisonRow feature="Daily Legal News" starter="5 articles/day" professional="10+ articles/day" enterprise="Custom alerts" />
                <ComparisonRow feature="Disclaimer" starter="Standard" professional="Standard" enterprise="Customizable" />
                <ComparisonRow feature="UI Access" starter="Full" professional="Full" enterprise="Premium UI" isLast />
              </tbody>
            </motion.table>
          </div>
        </motion.section>
      </ClientOnly>

       <ClientOnly>
          <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-stone-800 py-3 sm:py-4 px-4 text-center text-xs text-gray-500 mt-10 border-t border-stone-700"
          >
            Built by: T.Naha
          </motion.footer>
       </ClientOnly>
    </div>
  );
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div
    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(234, 179, 8, 0.1), 0 4px 6px -2px rgba(234, 179, 8, 0.05)" }} 
    className="bg-slate-700/60 backdrop-blur-sm rounded-xl p-4 sm:p-5 shadow-lg border border-slate-600 min-h-[140px] sm:min-h-[160px] md:min-h-[180px] flex flex-col items-center justify-center transition-shadow"
  >
    <div className="text-amber-400 mb-2 sm:mb-3">{icon}</div>
    <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2 text-gray-100">{title}</h3>
    <p className="text-xs sm:text-sm text-gray-400">{description}</p>
  </motion.div>
);

const PricingCard = ({ title, price, description, features, trialText, highlighted }: { title: string, price: string, description: string, features: string[], trialText?: string, highlighted?: boolean }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02, boxShadow: "0 10px 20px -5px rgba(234, 179, 8, 0.2), 0 6px 10px -5px rgba(234, 179, 8, 0.1)" }}
    className={cn(
      "bg-slate-700/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 w-full sm:max-w-xs md:max-w-sm shadow-xl transition-all duration-300 border border-slate-600 flex flex-col",
      highlighted && "border-2 border-amber-500 ring-2 ring-amber-500/50 relative sm:scale-105 z-10"
    )}
  >
    {highlighted && (
        <div className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-stone-900 text-xs font-semibold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg">
            Most Popular
        </div>
    )}
    <div className="flex-grow">
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1.5 sm:mb-2 text-gray-100">{title}</h3>
      <p className="text-xs sm:text-sm mb-2.5 sm:mb-3 text-gray-400 min-h-[2.5em] sm:min-h-[3em]">{description}</p>
      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-400 my-3 sm:my-4 md:my-5">{price}<span className="text-sm sm:text-base font-normal text-gray-400"> / month</span></p>
      {trialText && <p className="text-xs text-gray-500 mb-2.5 sm:mb-3 md:mb-4">{trialText}</p>}
      <ul className="list-none p-0 mb-4 sm:mb-5 md:mb-6 text-xs sm:text-sm text-gray-300 space-y-1 sm:space-y-1.5 text-left pl-1 sm:pl-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-amber-400 mr-1.5 sm:mr-2 shrink-0 text-sm sm:text-base">✓</span> 
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
    <Link href="/app" passHref>
      <Button
        variant="default"
        className={cn(
            "mt-auto w-full font-semibold py-2 sm:py-2.5 rounded-md text-xs sm:text-sm",
            highlighted ? "bg-amber-500 hover:bg-amber-600 text-stone-900" : "bg-stone-600 hover:bg-stone-500 text-gray-100"
        )}
      >
        Choose {title}
      </Button>
    </Link>
  </motion.div>
);

const ComparisonRow = ({ feature, starter, professional, enterprise, isLast = false }: { feature: string, starter: string, professional: string, enterprise: string, isLast?: boolean }) => (
  <tr className={cn("hover:bg-stone-700/70 transition-colors", !isLast && "border-b border-stone-700/50")}>
    <td className="py-2 px-2 sm:px-3 md:px-4 font-medium">{feature}</td>
    <td className="py-2 px-2 sm:px-3 md:px-4 text-center">{starter}</td>
    <td className="py-2 px-2 sm:px-3 md:px-4 text-center">{professional}</td>
    <td className="py-2 px-2 sm:px-3 md:px-4 text-center">{enterprise}</td>
  </tr>
);

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() =>
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
      }
      className="bg-transparent border-gray-500/50 text-gray-300 hover:bg-gray-700/40 hover:text-amber-400 hover:border-amber-500/50 rounded-md h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
      ) : (
        <Moon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

