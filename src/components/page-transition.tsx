"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [currentContent, setCurrentContent] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const pathname = usePathname();
  const previousContentRef = useRef(children);

  useEffect(() => {
    if (currentContent !== children) {
      // Start transition
      setIsTransitioning(true);
      setContentReady(false);
      previousContentRef.current = currentContent;

      // Switch content after a very short delay
      const timer = setTimeout(() => {
        setCurrentContent(children);
        setContentReady(true);

        // Complete transition
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 50);

      return () => clearTimeout(timer);
    } else if (!contentReady) {
      // Mark content as ready when it first loads
      setContentReady(true);
    }
  }, [children, currentContent, contentReady]);

  return (
    <div className="relative min-h-full">
      {/* Keep previous content visible during transition */}
      <div
        className={`
          absolute inset-0 transition-all duration-150 ease-out
          ${isTransitioning ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}
        `}
      >
        {previousContentRef.current}
      </div>

      {/* New content fades in underneath */}
      <div
        className={`
          relative transition-opacity duration-150 ease-out
          ${contentReady && !isTransitioning ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {children}
      </div>
    </div>
  );
}