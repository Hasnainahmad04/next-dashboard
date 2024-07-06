import React from 'react';
import '@/styles/globals.css';
import { inter } from '@/styles/fonts';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <NextTopLoader showSpinner={false} />
        <Toaster position="top-right" />

        {children}
      </body>
    </html>
  );
}
