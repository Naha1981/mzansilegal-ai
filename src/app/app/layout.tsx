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
          {/* Keep head for potential future meta tags, links, etc. */}
       </head>
       <body>
         {children}
       </body>
     </html>
   );
 }
