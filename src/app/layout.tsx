import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

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
    // Apply dark theme globally
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${GeistSans.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
