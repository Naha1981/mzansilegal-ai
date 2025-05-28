
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ClientOnly } from '@/components/client-only';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import {
  Moon,
  Sun,
  Search,
  FileCheck2,
  Database,
  ShieldCheck,
  Briefcase,
  Users,
  UserCheck,
  Star,
  Sparkles,
  Check,
  GraduationCap,
  Lock,
  Play,
  FilePlus2, // For Doc Generation
  Newspaper, // For Daily Legal News
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

// Re-defined MzansiLegalLogo to match the header style
const MzansiLegalLogo = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center space-x-1 sm:space-x-2", className)}>
    <Image
      src="https://ideogram.ai/assets/progressive-image/balanced/response/rC4tDYcAThW2P25_d3u9Gg"
      alt="MzansiLegal AI Logo"
      width={48}
      height={48}
      className="flex-shrink-0 rounded w-10 h-10 sm:w-12 sm:h-12"
      data-ai-hint="logo branding"
    />
    <span className="text-lg sm:text-xl font-bold text-[#155E63]">MzansiLegal AI</span>
  </div>
);

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function LandingPage() {
  return (
    <ClientOnly>
      <div className="font-poppins text-[#1C1C1C] min-h-screen overflow-x-hidden bg-[#F8FAF9]">

        {/* Header */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="sticky top-0 z-50 py-3 sm:py-4 px-4 sm:px-8 md:px-12 flex justify-between items-center shadow-sm bg-gradient-to-r from-[#E6F1F1] to-white"
        >
          <Link href="/" aria-label="Go to MzansiLegal AI Home">
            <MzansiLegalLogo className="cursor-pointer transition-transform duration-300 hover:scale-105" />
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <nav className="hidden sm:flex space-x-4 md:space-x-6 items-center">
              {[
                { label: 'Features', href: '#features' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'About', href: '#about' },
                { label: 'Contact', href: '#contact' }
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="font-medium text-[#223133] hover:text-[#155E63] transition-colors duration-300 text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link href="/app" passHref>
              <Button
                className="bg-[#155E63] hover:bg-[#10484F] text-white font-semibold text-xs px-3 py-1.5 sm:text-sm sm:px-4 sm:py-2 rounded-md"
              >
                Get Started
              </Button>
            </Link>
            <ThemeToggle />
          </div>
          <div className="sm:hidden">
            <ThemeToggle />
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="py-16 sm:py-20 md:py-28 px-4 sm:px-8 bg-[#F8FAF9]"
        >
          <div className="container mx-auto grid md:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 sm:mb-7 text-[#1C1C1C] !leading-tight">
                Modern AI Legal Support <br className="hidden md:inline" />for South Africa
              </h1>
              <p className="text-base sm:text-lg md:text-xl max-w-md mx-auto md:mx-0 mb-8 sm:mb-10 text-[#475867]">
                Empowering legal professionals with instant legal research, contract review, case analysis, document generation, and daily news powered by AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                <Link href="#features" passHref>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-[#155E63] text-[#155E63] hover:bg-[#E6F1F1] hover:text-[#10484F] font-semibold px-6 py-2.5 sm:px-7 rounded-md text-sm sm:text-base"
                  >
                    <Search size={18} className="mr-2" /> Explore Features
                  </Button>
                </Link>
                <Link href="/app" passHref>
                  <Button
                    size="lg"
                    className="bg-[#155E63] hover:bg-[#10484F] text-white font-semibold px-6 py-2.5 sm:px-7 rounded-md text-sm sm:text-base"
                  >
                    <Sparkles size={18} className="mr-2" /> Get Started
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center items-center mt-10 md:mt-0">
              <Image
                src="https://ideogram.ai/assets/progressive-image/balanced/response/JRiQSuWWS-urwlo5-L6Tqg"
                alt="AI Legal Concept Illustration"
                width={500}
                height={500}
                priority
                className="rounded-lg object-contain shadow-xl w-full max-w-sm md:max-w-md"
                data-ai-hint="AI law"
              />
            </div>
          </div>
        </motion.section>

        {/* Key Features Section */}
        <motion.section
          id="features"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="py-16 sm:py-20 md:py-24 px-4 sm:px-8 text-center bg-white"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 sm:mb-16 text-[#155E63]">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8 max-w-7xl mx-auto">
            <FeatureCard icon={<Search size={32} className="text-[#155E63]" />} title="AI Legal Research" description="Instant access to relevant South African legal precedents and statutes." />
            <FeatureCard icon={<FileCheck2 size={32} className="text-[#155E63]" />} title="Contract Review" description="Analyze contracts, identify key clauses, and assess risks quickly." />
            <FeatureCard icon={<Database size={32} className="text-[#155E63]" />} title="SA Case Law" description="Navigate local case law with AI insights." />
            <FeatureCard icon={<FilePlus2 size={32} className="text-[#155E63]" />} title="Doc Generation" description="Automate legal document and template creation." />
            <FeatureCard icon={<Newspaper size={32} className="text-[#155E63]" />} title="Daily Legal News" description="Stay updated with the latest legal developments from SA." />
          </div>
        </motion.section>

        {/* Why MzansiLegal Section */}
        <motion.section
          id="about"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="py-16 sm:py-20 md:py-24 px-4 sm:px-8 bg-[#F8FAF9]"
        >
          <div className="container mx-auto grid md:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div className="flex justify-center items-center order-last md:order-first">
              <Image
                src="https://placehold.co/500x380.png"
                alt="Lawyer using MzansiLegal AI"
                width={500}
                height={380}
                className="rounded-lg object-cover shadow-xl"
                data-ai-hint="lawyer computer"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#155E63]">Why MzansiLegal AI?</h2>
              <ul className="space-y-3 text-[#475867] text-base sm:text-lg">
                {[
                  "Specifically built and trained for South African law.",
                  "Save countless hours on manual legal research and document review.",
                  "Reduce the risk of human error with AI-assisted analysis.",
                  "Ensure your practice operates with secure and confidential data handling.",
                  "User-friendly interface designed for legal professionals.",
                  "Streamline document generation for correspondence and statements.",
                  "Stay informed with curated daily legal news."
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check size={20} className="text-[#155E63] mr-2 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>
        
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            className="py-16 sm:py-20 md:py-24 px-4 sm:px-8 text-center bg-white"
        >
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 sm:mb-16 text-[#155E63]">Empowering the Entire Legal Ecosystem</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
                <UseCaseCard icon={<Briefcase size={36} className="text-[#155E63]" />} title="Legal Firms" description="Streamline workflows and enhance associate productivity." />
                <UseCaseCard icon={<Users size={36} className="text-[#155E63]" />} title="Govt. Legal Depts" description="Improve efficiency in public sector legal analysis." />
                <UseCaseCard icon={<UserCheck size={36} className="text-[#155E63]" />} title="Solo Practitioners" description="Access powerful AI tools on a budget." />
                <UseCaseCard icon={<GraduationCap size={36} className="text-[#155E63]" />} title="Law Students" description="Accelerate learning and research for academic success." />
            </div>
        </motion.section>

        <motion.section
          id="pricing"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="bg-[#F8FAF9] py-16 sm:py-20 md:py-24 px-4 sm:px-8 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 sm:mb-16 text-[#155E63]">Flexible Plans for Every Need</h2>
          <div className="flex flex-wrap justify-center items-stretch gap-6 sm:gap-8">
            <PricingCard
              title="Starter"
              price="R0"
              description="For law students, legal interns, and individual researchers."
              features={[
                "AI Legal Assistant (basic)",
                "Legal Research (South Africa only, 20 queries/month)",
                "Daily Legal News (5 articles/day)",
                "Disclaimer notice",
                "Full UI Access",
              ]}
              trialText="Free Tier"
              buttonLink="/app"
            />
            <PricingCard
              title="Professional"
              price="R500"
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
              buttonLink="/app"
            />
            <PricingCard
              title="Enterprise"
              price="R1000"
              description="For law firms, corporate legal teams, and serious users."
              features={[
                "AI Legal Assistant (unlimited use, priority speed)",
                "Legal Research (full access to South African + international law databases)",
                "Case Study Analysis (unlimited cases, outcome prediction scoring)",
                "Contract Analysis (unlimited uploads, advanced clause suggestions)",
                "Doc Generation (advanced template creation, historical doc training)",
                "Daily Legal News (priority feed, customizable alerts)",
                "Customizable Disclaimer",
                "Premium UI themes (dark mode + custom branding options)",
                "Dedicated onboarding + premium support",
                "API access (on request)",
              ]}
              trialText="3-day free trial available"
              buttonLink="/app"
            />
          </div>
          <ComparisonTable />
        </motion.section>

        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            className="py-16 sm:py-20 md:py-24 px-4 sm:px-8 bg-white"
        >
            <div className="container mx-auto text-center max-w-3xl">
                <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-[#155E63]">Trusted by Legal Professionals</h2>
                <div className="bg-[#E6F1F1] p-8 rounded-lg shadow-md">
                    <div className="flex justify-center mb-4">
                        {[...Array(5)].map((_, i) => <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />)}
                    </div>
                    <p className="text-lg sm:text-xl text-[#475867] italic mb-6">
                        "MzansiLegal AI has revolutionized how our firm handles initial research and document review. It's cut down our non-billable hours significantly!"
                    </p>
                    <p className="font-semibold text-[#1C1C1C]">Advocate Themba Mokoena</p>
                    <p className="text-sm text-[#475867]">Lead Counsel, Mokoena Legal Chambers</p>
                </div>
            </div>
        </motion.section>

        <motion.section
          id="contact"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="py-16 sm:py-20 md:py-24 px-4 sm:px-8 text-center bg-gradient-to-r from-[#E6F1F1] to-white"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#1C1C1C]">Ready to Modernize Your Legal Practice?</h2>
          <p className="text-base sm:text-lg md:text-xl text-[#475867] mb-8 sm:mb-10 max-w-xl mx-auto">
            Get started with MzansiLegal AI today and experience the future of legal work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app" passHref>
              <Button
                size="lg"
                className="bg-[#155E63] hover:bg-[#10484F] text-white font-semibold px-8 py-3 sm:px-10 rounded-md text-base sm:text-lg"
              >
                <Lock size={20} className="mr-2" /> Sign Up Free
              </Button>
            </Link>
            <Link href="#features" passHref>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-[#155E63] text-[#155E63] hover:bg-[#E6F1F1] hover:text-[#10484F] font-semibold px-8 py-3 sm:px-10 rounded-md text-base sm:text-lg"
              >
                <Play size={20} className="mr-2" /> View Demo
              </Button>
            </Link>
          </div>
        </motion.section>

        <footer className="bg-[#223133] py-6 px-4 text-center text-sm text-gray-400">
          Built by: T.Naha | © {new Date().getFullYear()} MzansiLegal AI. All rights reserved.
        </footer>
      </div>
    </ClientOnly>
  );
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 text-left min-h-[180px] sm:min-h-[200px] flex flex-col">
    <div className="mb-3 sm:mb-4">
      {React.cloneElement(icon as React.ReactElement, { className: "h-7 w-7 sm:h-8 sm:w-8 text-[#155E63]" })}
    </div>
    <h3 className="text-md sm:text-lg font-semibold mb-1 sm:mb-2 text-[#1C1C1C]">{title}</h3>
    <p className="text-xs sm:text-sm text-[#475867] flex-grow">{description}</p>
  </div>
);

const UseCaseCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-[#F8FAF9] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center border border-gray-200">
        <div className="text-[#155E63] inline-block mb-4">
             {React.cloneElement(icon as React.ReactElement, { className: "h-8 w-8 sm:h-9 sm:w-9" })}
        </div>
        <h3 className="text-lg font-semibold mb-2 text-[#1C1C1C]">{title}</h3>
        <p className="text-xs text-[#475867]">{description}</p>
    </div>
);

const PricingCard = ({ title, price, description, features, trialText, highlighted, buttonLink }: { title: string, price: string, description: string, features: string[], trialText?: string, highlighted?: boolean, buttonLink: string }) => (
  <div
    className={cn(
      "bg-white rounded-xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm shadow-lg transition-all duration-300 border flex flex-col text-left", // Adjusted max-w for smaller cards
      highlighted ? "border-2 border-[#155E63] ring-2 ring-[#155E63]/30 transform sm:scale-105" : "border-gray-200"
    )}
  >
    {highlighted && (
        <div className="self-center bg-[#155E63] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md mb-4 -mt-7 sm:-mt-9">
            Most Popular
        </div>
    )}
    <div className="flex-grow mb-4 sm:mb-6">
      <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-[#1C1C1C]">{title}</h3>
      <p className="text-xs sm:text-sm mb-3 sm:mb-4 text-[#475867] min-h-[3em]">{description}</p>
      <p className="text-3xl sm:text-4xl font-extrabold text-[#155E63] my-3 sm:my-4">{price}<span className="text-sm sm:text-base font-normal text-[#475867]"> / month</span></p>
      {trialText && <p className="text-xs text-gray-500 mb-3 sm:mb-4 text-center">{trialText}</p>}
      <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-[#475867]">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check size={14} className="text-green-500 mr-1.5 sm:mr-2 mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
    <Link href={buttonLink} passHref>
      <Button
        size="lg"
        className={cn(
            "mt-auto w-full font-semibold py-2 sm:py-2.5 rounded-md text-xs sm:text-sm",
            highlighted ? "bg-[#155E63] hover:bg-[#10484F] text-white" : "bg-gray-200 hover:bg-gray-300 text-[#1C1C1C]"
        )}
      >
        Choose {title}
      </Button>
    </Link>
  </div>
);

const ComparisonTable = () => (
  <div className="overflow-x-auto mt-12 sm:mt-16">
    <motion.table
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
      className="w-full max-w-4xl mx-auto text-left text-xs sm:text-sm bg-white/80 backdrop-blur-sm rounded-lg border border-gray-300 shadow-lg"
    >
      <caption className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[#1C1C1C] p-3 sm:p-4">Feature Comparison</caption>
      <thead>
        <tr className="text-[#155E63] border-b border-gray-300">
          <th className="py-2 px-1 sm:px-2 md:px-4 font-semibold">Feature</th>
          <th className="py-2 px-1 sm:px-2 md:px-4 text-center font-semibold">Starter (R0)</th>
          <th className="py-2 px-1 sm:px-2 md:px-4 text-center font-semibold">Professional (R500)</th>
          <th className="py-2 px-1 sm:px-2 md:px-4 text-center font-semibold">Enterprise (R1000)</th>
        </tr>
      </thead>
      <tbody className="text-[#475867]">
        <ComparisonRow feature="AI Legal Assistance" starter="Limited" professional="Full" enterprise="Unlimited" />
        <ComparisonRow feature="Legal Research" starter="SA Only (20/month)" professional="SA + Intl" enterprise="Full Access" />
        <ComparisonRow feature="Case Study Analysis" starter="❌" professional="Basic (5/month)" enterprise="Unlimited" />
        <ComparisonRow feature="Contract Analysis" starter="❌" professional="5 docs/month" enterprise="Unlimited" />
        <ComparisonRow feature="Doc Generation" starter="❌" professional="Basic" enterprise="Advanced" />
        <ComparisonRow feature="Daily Legal News" starter="5 articles/day" professional="10+ articles/day" enterprise="Custom alerts" />
        <ComparisonRow feature="Disclaimer" starter="Standard" professional="Standard" enterprise="Customizable" />
        <ComparisonRow feature="UI Access" starter="Full" professional="Full" enterprise="Premium UI" isLast />
      </tbody>
    </motion.table>
  </div>
);

const ComparisonRow = ({ feature, starter, professional, enterprise, isLast = false }: { feature: string, starter: string, professional: string, enterprise: string, isLast?: boolean }) => (
  <tr className={cn("hover:bg-gray-100 transition-colors", !isLast && "border-b border-gray-200")}>
    <td className="py-2 px-1 sm:px-2 md:px-4 font-medium text-[#1C1C1C]">{feature}</td>
    <td className="py-2 px-1 sm:px-2 md:px-4 text-center">{starter}</td>
    <td className="py-2 px-1 sm:px-2 md:px-4 text-center">{professional}</td>
    <td className="py-2 px-1 sm:px-2 md:px-4 text-center">{enterprise}</td>
  </tr>
);

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-8 w-8 sm:h-9 sm:w-9" />;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="bg-transparent border-gray-400/50 text-[#223133] hover:bg-gray-200/50 hover:text-[#155E63] hover:border-[#155E63]/50 rounded-md h-8 w-8 sm:h-9 sm:w-9"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
      ) : (
        <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
      )}
    </Button>
  );
}
