'use client'; // Landing pages often benefit from client-side interactivity

import React from 'react';
import Link from 'next/link'; // Use Next.js Link for navigation
import { motion } from 'framer-motion'; // Import motion for animations

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
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeDown}
        className="bg-[#141432] py-6 px-4 sm:px-12 flex justify-between items-center" // Adjusted padding for responsiveness
      >
        <div className="text-2xl sm:text-3xl font-bold text-[#00d4ff]">MzansiLegal AI</div>
        <nav className="hidden sm:flex space-x-8"> {/* Hide nav on small screens, adjust spacing */}
          <a href="#pricing" className="font-medium text-[#ccc] hover:text-[#00d4ff] transition-colors duration-300">Pricing</a>
          <a href="#features" className="font-medium text-[#ccc] hover:text-[#00d4ff] transition-colors duration-300">Features</a>
          {/* Link to the actual app page */}
          <Link href="/app" className="font-medium text-[#00d4ff] hover:text-white transition-colors duration-300 border border-[#00d4ff] px-3 py-1 rounded-md text-sm">
            Go to App
          </Link>
        </nav>
         {/* Simple Link for Mobile */}
         <nav className="sm:hidden">
           <Link href="/app" className="font-medium text-[#00d4ff] hover:text-white transition-colors duration-300 border border-[#00d4ff] px-3 py-1 rounded-md text-sm">
             Launch App
           </Link>
         </nav>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0.4} // Delay animation
        className="text-center py-20 px-4 sm:py-32 sm:px-5" // Adjusted padding
      >
        <h1 className="text-3xl sm:text-5xl font-bold mb-5 text-[#00d4ff]">Empowering South African Legal Professionals with AI</h1>
        <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-10 text-[#ccc]">
          Your trusted AI partner for Legal Research, Case Studies, and Contract Analysis. Fast, accurate, and built for the South African legal system.
        </p>
        {/* Link to the actual app page */}
        <Link href="/app" className="inline-block bg-[#00d4ff] text-[#0b0b1f] py-3 px-8 rounded-lg font-bold text-base sm:text-lg transition-all duration-300 hover:bg-[#00aacd] hover:scale-105">
          Get Started
        </Link>
      </motion.section>

      {/* Pricing Section */}
      <motion.section
        id="pricing"
        initial="hidden"
        whileInView="visible" // Animate when in view
        viewport={{ once: true, amount: 0.3 }} // Trigger animation once when 30% visible
        variants={fadeUp}
        custom={0.8} // Animation delay
        className="bg-[#1c1c45] py-20 px-4 sm:px-5 text-center" // Adjusted padding
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-[#00d4ff]">Simple, Transparent Pricing</h2>
        <div className="flex flex-wrap justify-center gap-8"> {/* Use flex-wrap and gap */}

          {/* Pricing Card 1 */}
          <motion.div
             whileHover={{ y: -10, scale: 1.05 }} // Hover animation
             className="bg-[#27275a] rounded-2xl p-8 w-full sm:w-auto max-w-sm sm:max-w-xs shadow-xl transition-transform duration-300" // Responsive width
           >
            <h3 className="text-2xl font-semibold mb-3 text-[#f5f5f5]">Starter</h3>
            <p className="text-4xl font-bold text-[#00d4ff] my-5">R500<span className="text-lg font-normal text-[#ccc]"> / month</span></p>
            <ul className="list-none p-0 mb-6 text-base text-[#ccc] space-y-2 text-left pl-4"> {/* Align text left */}
              <li>✓ Legal Research Access</li>
              <li>✓ Basic Case Study Insights</li>
              <li>✓ Email Support</li>
            </ul>
            {/* Link to the actual app page */}
            <Link href="/app" className="inline-block bg-[#00d4ff] text-[#0b0b1f] py-3 px-6 rounded-lg font-bold text-sm transition-all duration-300 hover:bg-[#00aacd] hover:scale-105">
              Choose Starter
            </Link>
          </motion.div>

          {/* Pricing Card 2 */}
           <motion.div
             whileHover={{ y: -10, scale: 1.05 }}
             className="bg-[#27275a] rounded-2xl p-8 w-full sm:w-auto max-w-sm sm:max-w-xs shadow-xl transition-transform duration-300 border-2 border-[#00d4ff]" // Highlighted card
           >
            <h3 className="text-2xl font-semibold mb-3 text-[#f5f5f5]">Professional</h3>
            <p className="text-4xl font-bold text-[#00d4ff] my-5">R1000<span className="text-lg font-normal text-[#ccc]"> / month</span></p>
            <ul className="list-none p-0 mb-6 text-base text-[#ccc] space-y-2 text-left pl-4">
              <li>✓ Everything in Starter</li>
              <li>✓ Advanced Case Study Analysis</li>
              <li>✓ Contract Draft Assistance</li>
              <li>✓ Priority Email Support</li>
            </ul>
            <Link href="/app" className="inline-block bg-[#00d4ff] text-[#0b0b1f] py-3 px-6 rounded-lg font-bold text-sm transition-all duration-300 hover:bg-[#00aacd] hover:scale-105">
              Choose Professional
            </Link>
          </motion.div>

          {/* Pricing Card 3 */}
           <motion.div
             whileHover={{ y: -10, scale: 1.05 }}
             className="bg-[#27275a] rounded-2xl p-8 w-full sm:w-auto max-w-sm sm:max-w-xs shadow-xl transition-transform duration-300"
           >
            <h3 className="text-2xl font-semibold mb-3 text-[#f5f5f5]">Elite</h3>
            <p className="text-4xl font-bold text-[#00d4ff] my-5">R1500<span className="text-lg font-normal text-[#ccc]"> / month</span></p>
            <ul className="list-none p-0 mb-6 text-base text-[#ccc] space-y-2 text-left pl-4">
              <li>✓ Everything in Professional</li>
              <li>✓ Custom Legal Research Reports</li>
              <li>✓ Dedicated AI Legal Advisor</li>
              <li>✓ 24/7 Premium Support</li>
            </ul>
            <Link href="/app" className="inline-block bg-[#00d4ff] text-[#0b0b1f] py-3 px-6 rounded-lg font-bold text-sm transition-all duration-300 hover:bg-[#00aacd] hover:scale-105">
              Choose Elite
            </Link>
          </motion.div>

        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={1.2} // Animation delay
        className="bg-[#141432] py-5 px-4 text-center text-sm text-[#777] mt-10" // Add margin top
      >
        Built by: T.Naha
      </motion.footer>

    </div>
  );
}
