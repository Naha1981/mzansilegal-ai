
import type {Metadata} from 'next';
import './globals.css';
// Removed Toaster import as it's not used in the new static design

// Initialize Poppins font - assuming it's added via CSS link now
// const poppins = Poppins({
//   weight: ['400', '600', '700'],
//   subsets: ['latin'],
//   variable: '--font-poppins' // If needed for Tailwind integration later
// });

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
    // Removed dark theme class and font variables
    <html lang="en" suppressHydrationWarning>
      {/* Add Google Font link directly */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      {/* Body uses font defined in globals.css */}
      <body>
        {children}
        {/* Removed Toaster component */}
      </body>
    </html>
  );
}
