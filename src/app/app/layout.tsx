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
   // AppLayout should only return the content to be nested within the RootLayout's body
   return <>{children}</>;
 }
