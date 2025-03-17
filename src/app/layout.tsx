'use client';
import { Josefin_Sans, Poppins } from 'next/font/google';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import SocketContextComponent from '../hoc/socket';
import ProviderRedux from '../redux/Provider';
import ThemeProvider from '../themes/theme-provider';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins'
});

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-josefin'
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${josefin.variable} bg-[rgb(231,241,250)] bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300`}
      >
        <ProviderRedux>
          <SessionProvider>
            <SocketContextComponent>
              <ThemeProvider attribute="class" enableSystem defaultTheme="system">
                {children}
                <Toaster position="top-center" />
              </ThemeProvider>
            </SocketContextComponent>
          </SessionProvider>
        </ProviderRedux>
      </body>
    </html>
  );
}
