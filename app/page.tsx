"use client";
import LandingScreen from "../components/StakeWrapper";
 import Navbar from "../components/Navbar";
import { useWalletConnectNotify } from "./hooks/useWalletInfo";
 
export default function Home() {
  useWalletConnectNotify();
  
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <LandingScreen />
    </main>
  );
}