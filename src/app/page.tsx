
'use client'; // Landing pages often benefit from client-side interactivity

import React from 'react';
import Link from 'next/link'; // Use Next.js Link for navigation
import { motion } from 'framer-motion'; // Import motion for animations
import { ClientOnly } from '@/components/client-only'; // Import ClientOnly
import { cn } from "@/lib/utils"; // Import cn utility

// Logo Component (Inline SVG for simplicity and performance)
const MzansiLegalLogo = ({ className }: { className?: string }) => (
  <svg
    className={cn("h-8 w-auto sm:h-10", className)} // Adjust size as needed
    viewBox="0 0 180 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="MzansiLegal AI Logo"
  >
    {/* Using primary color from theme */}
    <defs>
      <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="hsl(var(--primary))" />
        <stop offset="100%" stopColor="hsl(var(--accent))" />
      </linearGradient>
    </defs>
    {/* Abstract 'M' shape incorporating scales */}
    <path
      d="M10 35 V5 H20 L30 25 L40 5 H50 V35 H40 V15 L30 35 L20 15 V35 H10 Z"
      fill="url(#logoGradient)"
    />
    {/* Text part */}
    <text
      x="60"
      y="28"
      fontFamily="Poppins, sans-serif"
      fontSize="24"
      fontWeight="bold"
      fill="hsl(var(--foreground))"
    >
      MzansiLegal
    </text>
    <text
      x="155" // Position 'AI' slightly offset
      y="18" // Position 'AI' slightly higher
      fontFamily="Poppins, sans-serif"
      fontSize="14"
      fontWeight="600"
      fill="hsl(var(--primary))" // Use primary color for 'AI'
    >
      AI
    </text>
  </svg>
);


// Animation variants
const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};


export default function LandingPage() {
  return (
    // Apply global styles equivalent to body styling
    <div className="font-poppins bg-gradient-to-br from-[#0b0b1f] to-[#1f2a5d] text-[#f5f5f5] min-h-screen overflow-x-hidden">

      {/* Header */}
      <ClientOnly> {/* Wrap header for client-side animation */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeDown}
          className="bg-[#141432]/80 backdrop-blur-sm sticky top-0 z-50 py-4 px-4 sm:px-12 flex justify-between items-center border-b border-white/10" // Adjusted padding, added backdrop blur, sticky
        >
          {/* Clickable Logo */}
          <Link href="/app" aria-label="Go to MzansiLegal AI App">
            <MzansiLegalLogo className="cursor-pointer transition-transform duration-300 hover:scale-105" />
          </Link>
          <nav className="hidden sm:flex space-x-8 items-center"> {/* Hide nav on small screens, adjust spacing, center items */}
            <a href="#pricing" className="font-medium text-[#ccc] hover:text-[#00d4ff] transition-colors duration-300">Pricing</a>
            {/* Link to the actual app page */}
            <Link href="/app" className="font-medium text-[#00d4ff] hover:text-white transition-colors duration-300 border border-[#00d4ff] px-4 py-2 rounded-lg text-sm hover:bg-[#00d4ff]/10">
              Go to App
            </Link>
          </nav>
           {/* Simple Link for Mobile */}
           <nav className="sm:hidden">
             <Link href="/app" className="font-medium text-[#00d4ff] hover:text-white transition-colors duration-300 border border-[#00d4ff] px-3 py-1.5 rounded-md text-xs hover:bg-[#00d4ff]/10">
               Launch App
             </Link>
           </nav>
        </motion.header>
      </ClientOnly>

      {/* Hero Section */}
       <ClientOnly> {/* Wrap hero section for client-side animation */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0.4} // Delay animation
            className="text-center py-20 px-4 sm:py-32 sm:px-5" // Adjusted padding
          >
            <h1 className="text-3xl sm:text-5xl font-bold mb-5 text-[#00d4ff] drop-shadow-[0_2px_10px_rgba(0,212,255,0.3)]">Empowering South African Legal Professionals with AI</h1>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-10 text-[#ccc]">
              Your trusted AI partner for Legal Research, Case Studies, and Contract Analysis. Fast, accurate, and built for the South African legal system.
            </p>
            {/* Link to the actual app page */}
            <Link href="/app" className="inline-block bg-[#00d4ff] text-[#0b0b1f] py-3 px-8 rounded-lg font-bold text-base sm:text-lg transition-all duration-300 hover:bg-[#00aacd] hover:scale-105 shadow-lg shadow-[#00d4ff]/30">
              Get Started
            </Link>
          </motion.section>
       </ClientOnly>

      {/* Pricing Section */}
      <ClientOnly> {/* Wrap pricing section for client-side animation */}
        <motion.section
          id="pricing"
          initial="hidden"
          whileInView="visible" // Animate when in view
          viewport={{ once: true, amount: 0.3 }} // Trigger animation once when 30% visible
          variants={fadeUp}
          custom={0.8} // Animation delay
          className="bg-[#1c1c45]/70 backdrop-blur-md py-20 px-4 sm:px-5 text-center" // Adjusted padding, added backdrop blur
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-[#00d4ff]">Simple, Transparent Pricing</h2>
          <div className="flex flex-wrap justify-center gap-8"> {/* Use flex-wrap and gap */}

            {/* Pricing Card 1: Starter */}
            <motion.div
               whileHover={{ y: -10, scale: 1.05 }} // Hover animation
               className="bg-[#27275a]/80 backdrop-blur-sm rounded-2xl p-8 w-full sm:w-auto max-w-sm sm:max-w-xs shadow-xl transition-transform duration-300 border border-white/10" // Responsive width, added border
             >
              <h3 className="text-2xl font-semibold mb-3 text-[#f5f5f5]">Starter</h3>
              <p className="text-lg mb-2 text-[#ccc]">For law students, legal interns, and individual researchers.</p>
              <p className="text-4xl font-bold text-[#00d4ff] my-5">R0<span className="text-lg font-normal text-[#ccc]"> / month</span></p>
              <ul className="list-none p-0 mb-6 text-base text-[#ccc] space-y-2 text-left pl-4"> {/* Align text left */}
                 <li>✅ AI Legal Assistant (basic)</li>
                 <li>✅ Legal Research (SA only, 20 queries/month)</li>
                 <li>✅ Daily Legal News (5 articles/day)</li>
                 <li>✅ Disclaimer notice</li>
                 <li>✅ Full UI Access</li>
              </ul>
              {/* Link to the actual app page */}
              <Link href="/app" className="inline-block bg-[#00d4ff] text-[#0b0b1f] py-3 px-6 rounded-lg font-bold text-sm transition-all duration-300 hover:bg-[#00aacd] hover:scale-105 shadow-md shadow-[#00d4ff]/20">
                Choose Starter
              </Link>
            </motion.div>

            {/* Pricing Card 2: Professional */}
             <motion.div
               whileHover={{ y: -10, scale: 1.05 }}
               className="bg-[#27275a]/80 backdrop-blur-sm rounded-2xl p-8 w-full sm:w-auto max-w-sm sm:max-w-xs shadow-xl transition-transform duration-300 border-2 border-[#00d4ff]" // Highlighted card
             >
              <h3 className="text-2xl font-semibold mb-3 text-[#f5f5f5]">Professional</h3>
              <p className="text-lg mb-2 text-[#ccc]">For solo attorneys, small practices, and legal consultants.</p>
              <p className="text-4xl font-bold text-[#00d4ff] my-5">R500<span className="text-lg font-normal text-[#ccc]"> / month</span></p>
              <ul className="list-none p-0 mb-6 text-base text-[#ccc] space-y-2 text-left pl-4">
                 <li>✅ AI Legal Assistant (advanced)</li>
                 <li>✅ Legal Research (SA + Intl)</li>
                 <li>✅ Case Study Analysis (5/month)</li>
                 <li>✅ Contract Analysis (5/month)</li>
                 <li>✅ Daily Legal News (10+/day)</li>
                 <li>✅ Disclaimer</li>
                 <li>✅ Full UI Access</li>
              </ul>
              <Link href="/app" className="inline-block bg-[#00d4ff] text-[#0b0b1f] py-3 px-6 rounded-lg font-bold text-sm transition-all duration-300 hover:bg-[#00aacd] hover:scale-105 shadow-md shadow-[#00d4ff]/20">
                Choose Professional
              </Link>
            </motion.div>

            {/* Pricing Card 3: Enterprise */}
             <motion.div
               whileHover={{ y: -10, scale: 1.05 }}
               className="bg-[#27275a]/80 backdrop-blur-sm rounded-2xl p-8 w-full sm:w-auto max-w-sm sm:max-w-xs shadow-xl transition-transform duration-300 border border-white/10"
             >
              <h3 className="text-2xl font-semibold mb-3 text-[#f5f5f5]">Enterprise</h3>
              <p className="text-lg mb-2 text-[#ccc]">For law firms, corporate legal teams, and serious users.</p>
              <p className="text-4xl font-bold text-[#00d4ff] my-5">R1000<span className="text-lg font-normal text-[#ccc]"> / month</span></p>
              <ul className="list-none p-0 mb-6 text-base text-[#ccc] space-y-2 text-left pl-4">
                 <li>✅ AI Legal Assistant (unlimited, priority)</li>
                 <li>✅ Legal Research (Full Access)</li>
                 <li>✅ Case Study Analysis (Unlimited)</li>
                 <li>✅ Contract Analysis (Unlimited)</li>
                 <li>✅ Daily Legal News (Custom Alerts)</li>
                 <li>✅ Customizable Disclaimer</li>
                 <li>✅ Premium UI Themes</li>
                 <li>✅ Dedicated Support</li>
                 <li>✅ API Access (on request)</li>
              </ul>
              <Link href="/app" className="inline-block bg-[#00d4ff] text-[#0b0b1f] py-3 px-6 rounded-lg font-bold text-sm transition-all duration-300 hover:bg-[#00aacd] hover:scale-105 shadow-md shadow-[#00d4ff]/20">
                Choose Enterprise
              </Link>
            </motion.div>

          </div>
          {/* Summary Table */}
          <div className="overflow-x-auto mt-16"> {/* Increased margin-top */}
             <motion.table
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, amount: 0.5 }}
               variants={fadeUp}
               custom={1.0} // Animation delay
               className="w-full max-w-4xl mx-auto text-left text-sm sm:text-base bg-gradient-to-br from-[#27275a]/50 to-[#1c1c45]/50 rounded-lg border border-white/10 shadow-lg"
             >
              <caption className="text-xl font-semibold mb-4 text-white/80 p-4">Feature Comparison</caption>
              <thead >
                <tr className="text-[#00d4ff] border-b border-white/20">
                  <th className="py-3 px-2 sm:px-4 font-semibold">Feature</th>
                  <th className="py-3 px-2 sm:px-4 text-center font-semibold">Starter (R0)</th>
                  <th className="py-3 px-2 sm:px-4 text-center font-semibold">Professional (R500)</th>
                  <th className="py-3 px-2 sm:px-4 text-center font-semibold">Enterprise (R1000)</th>
                </tr>
              </thead>
              <tbody className="text-white/90">
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 sm:px-4 font-medium">AI Legal Assistance</td>
                  <td className="py-3 px-2 sm:px-4 text-center">Limited</td>
                  <td className="py-3 px-2 sm:px-4 text-center">Full</td>
                  <td className="py-3 px-2 sm:px-4 text-center">Unlimited</td>
                </tr>
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 sm:px-4 font-medium">Legal Research</td>
                  <td className="py-3 px-2 sm:px-4 text-center">SA Only</td>
                  <td className="py-3 px-2 sm:px-4 text-center">SA + Intl</td>
                  <td className="py-3 px-2 sm:px-4 text-center">Full Access</td>
                </tr>
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 sm:px-4 font-medium">Case Study Analysis</td>
                  <td className="py-3 px-2 sm:px-4 text-center">❌</td>
                  <td className="py-3 px-2 sm:px-4 text-center">Basic (5/month)</td>
                  <td className="py-3 px-2 sm:px-4 text-center">Unlimited</td>
                </tr>
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 sm:px-4 font-medium">Contract Analysis</td>
                  <td className="py-3 px-2 sm:px-4 text-center">❌</td>
                  <td className="py-3 px-2 sm:px-4 text-center">5 docs/month</td>
                  <td className="py-3 px-2 sm:px-4 text-center">Unlimited</td>
                </tr>
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 sm:px-4 font-medium">Daily Legal News</td>
                  <td className="py-3 px-2 sm:px-4 text-center">5 articles/day</td>
                  <td className="py-3 px-2 sm:px-4 text-center">10+ articles/day</td>
                  <td className="py-3 px-2 sm:px-4 text-center">Custom alerts</td>
                </tr>
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 sm:px-4 font-medium">Disclaimer</td>
                  <td className="py-3 px-2 sm:px-4 text-center">Standard</td>
                  <td className="py-3 px-2 sm:px-4 text-center">Standard</td>
                  <td className="py-3 px-2 sm:px-4 text-center">Customizable</td>
                </tr>
                 <tr className="hover:bg-white/5 transition-colors"> {/* Removed last border */}
                  <td className="py-3 px-2 sm:px-4 font-medium">UI Access</td>
                  <td className="py-3 px-2 sm:px-4 text-center">Full</td>
                  <td className="py-3 px-2 sm:px-4 text-center">Full</td>
                  <td className="py-3 px-2 sm:px-4 text-center">Premium UI</td>
                </tr>
              </tbody>
            </motion.table>
          </div>
        </motion.section>
      </ClientOnly>

      {/* Footer */}
       <ClientOnly> {/* Wrap footer for client-side animation */}
          <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1.2} // Animation delay
            className="bg-[#141432]/80 backdrop-blur-sm py-5 px-4 text-center text-sm text-[#777] mt-10 border-t border-white/10" // Add margin top, backdrop blur, border
          >
            Built by: T.Naha
          </motion.footer>
       </ClientOnly>

    </div>
  );
}

