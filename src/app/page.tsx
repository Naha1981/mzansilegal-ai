'use client'; // Mark as client component to use useEffect

import React, AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useRef } from 'react';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Replicate the script logic inside useEffect
  useEffect(() => {
    const buttons = containerRef.current?.querySelectorAll('.tab-buttons button');
    const textarea = containerRef.current?.querySelector('textarea');

    if (buttons && textarea) {
      const handleClick = (event: MouseEvent) => {
        const targetButton = event.currentTarget as HTMLButtonElement;

        // Remove active class from all buttons
        buttons.forEach(btn => btn.classList.remove('active'));
        // Add active class to the clicked button
        targetButton.classList.add('active');

        // Update textarea placeholder based on active button
        const activeType = targetButton.textContent;
        if (activeType === 'Contract Analysis') {
          textarea.placeholder = "Paste the full contract text here...";
        } else if (activeType === 'Case Study Analysis') {
          textarea.placeholder = "Describe the case details...";
        } else { // Legal Research
          textarea.placeholder = "Enter your legal research question or topic...";
        }
      };

      buttons.forEach(button => {
        button.addEventListener('click', handleClick);
      });

      // Cleanup function to remove event listeners
      return () => {
        buttons.forEach(button => {
          button.removeEventListener('click', handleClick);
        });
      };
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    // Apply container styles directly or via CSS class if defined globally
    <div
      ref={containerRef}
      // Apply centering styles here
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '40px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{
        background: '#141432',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.7)',
        maxWidth: '700px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <h1>MzansiLegal AI</h1>
        <div className="subtitle">Your AI-powered assistant for Contract Analysis, Case Study Insights, and Legal Research in South African Law.</div>

        <div className="disclaimer">
          ⚠️ Disclaimer: This AI provides information for legal research and analysis. It is a tool to support, not replace, independent legal judgment. This output does not constitute legal advice and should not be relied upon as such. Always verify findings with primary legal sources and exercise professional discretion. Do not submit client confidential information.
        </div>

        <div className="form-section">
          <div className="tab-buttons">
            {/* Default active state set here, JS will handle changes */}
            <button className="active">Legal Research</button>
            <button>Case Study Analysis</button>
            <button>Contract Analysis</button>
          </div>

          {/* Initial placeholder, JS updates it */}
          <textarea placeholder="Enter your legal research question or topic..."></textarea>

          {/* Note: The submit button currently doesn't trigger any action */}
          <button className="submit-btn">Analyze</button>
        </div>
      </div>
    </div>
  );
}
