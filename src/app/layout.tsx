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
     <html lang="en" suppressHydrationWarning>
       <head>
         {/* Font links are good here as they might be used by both landing and app */}
         <link rel="preconnect" href="https://fonts.googleapis.com" />
         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
         <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
       </head>
       {/* Body uses font defined in globals.css - applied globally */}
       <body>
         {children}
       </body>
     </html>
   );
 }
