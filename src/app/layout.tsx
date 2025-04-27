import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
// Removed GeistMono import as it's not found
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
    <html lang="en" suppressHydrationWarning>
      {/* Removed GeistMono from className as it's not imported */}
      <body className={`${GeistSans.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
