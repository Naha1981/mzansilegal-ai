// Root layout primarily for the landing page
import type { Metadata } from 'next';
import './globals.css'; // Keep global styles

export const metadata: Metadata = {
  title: 'MzansiLegal AI - AI Legal Assistant for South Africa',
  description: 'AI-Powered Legal Assistant for South African Lawyers - Contract Analysis, Case Studies, Legal Research.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        {/* Font links are now consolidated in globals.css via @import */}
      </head>
      {/* Body uses font defined in globals.css - applied globally */}
      <body>
        {children}
      </body>
    </html>
  );
}
