import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Import Inter
// Removed: import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

// Initialize Inter font with subsets
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' }); // Define variable

export const metadata: Metadata = {
  title: 'MzansiLegal AI',
  description: 'AI-Powered Legal Assistant for South African Lawyers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Apply dark theme globally and Inter font variable
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
      {/* Apply Inter font via its variable */}
      <body className={`${inter.variable} font-sans antialiased fade-in`}> {/* Use Inter variable */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
