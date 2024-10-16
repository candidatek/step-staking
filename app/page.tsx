"use client";
 import HeaderComponent from "./components/HeaderComponent";
import LandingContent from "./components/StakeOperations";
 
export default function Home() {
  
  return (
    <main className="min-h-screen bg-black">
      <HeaderComponent />
      <LandingContent />
    </main>
  );
}