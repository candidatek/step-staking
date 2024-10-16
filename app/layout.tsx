import type { Metadata } from "next";
import "./globals.css";
import AppWalletProvider from "./context/AppWalletProvider";
import { Plus_Jakarta_Sans } from '@next/font/google';


// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

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
        </AppWalletProvider>
      </body>
    </html>
  );
}
