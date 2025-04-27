import type { Metadata } from 'next';
 import '../globals.css'; // Import global styles

 export const metadata: Metadata = {
   title: 'MzansiLegal AI App',
   description: 'AI-Powered Legal Assistant Application Interface',
 };

 export default function AppLayout({
   children,
 }: {
   children: React.ReactNode;
 }) {
   return (
     <html lang="en" suppressHydrationWarning>
       <head>
          {/* Include fonts if needed specifically for the app layout */}
         <link rel="preconnect" href="https://fonts.googleapis.com" />
         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
         <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
       </head>
       <body>
         {children}
       </body>
     </html>
   );
 }
