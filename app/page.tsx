"use client";
import LandingContent from "../components/StakeOperations";
 import HeaderComponent from "../components/HeaderComponent";
 
export default function Home() {
  
  return (
    <main className="min-h-screen bg-black">
      <HeaderComponent />
      <LandingContent />
    </main>
  );
}