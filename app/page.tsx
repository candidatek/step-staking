"use client";
import LandingContent from "../components/StakeOperations";
 import HeaderComponent from "../components/HeaderComponent";
import { useWalletConnectNotify } from "./hooks/useWalletInfo";
 
export default function Home() {
  useWalletConnectNotify();
  
  return (
    <main className="min-h-screen bg-black">
      <HeaderComponent />
      <LandingContent />
    </main>
  );
}