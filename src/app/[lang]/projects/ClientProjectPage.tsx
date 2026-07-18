"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import WelcomeScreen from "@/components/portfolio/WelcomeScreen";
import ProjectGallery from "@/components/portfolio/ProjectGallery";
import dynamic from 'next/dynamic'
const ParticlesBackground = dynamic(() => import('@/components/portfolio/ParticlesBackground'), { ssr: false })

export default function ClientProjectPage() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,153,255,0.25),rgba(255,255,255,0))] text-dark-900 dark:text-white font-sans overflow-hidden selection:bg-primary-500 selection:text-white relative z-50">
      <ParticlesBackground />
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <WelcomeScreen key="welcome" onEnter={() => setShowWelcome(false)} />
        ) : (
          <ProjectGallery key="gallery" />
        )}
      </AnimatePresence>
    </div>
  );
}
