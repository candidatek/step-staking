"use client";
 
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { WalletButton } from "./components/WalletButton";
 
export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="border hover:border-slate-900 rounded">
        <WalletMultiButton style={{}} />
        <WalletButton />
      </div>
    </main>
  );
}