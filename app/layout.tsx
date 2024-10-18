import type { Metadata } from "next";
import "./globals.css";
import AppWalletProvider from "./context/AppWalletProvider";
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from "sonner";


const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'], // Choose weights you need
  variable: '--font-plus-jakarta-sans',
});
export const metadata: Metadata = {
  title: "Step",
  description: "Stake step tokens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${plusJakartaSans.variable} antialiased`}
      >
        <AppWalletProvider>
          {children}
          <Toaster
              position="bottom-left"
              toastOptions={{
                unstyled: true,
                classNames: {
                  toast: 'flex items-center  !bg-black-1 rounded-sm p-3 text-green bg-card',
                  title: 'font-semibold pr-4',
                  description: 'text-sm ',
                  icon: 'flex items-center justify-center size-10',
                },
              }} />
        </AppWalletProvider>
      </body>
    </html>
  );
}
