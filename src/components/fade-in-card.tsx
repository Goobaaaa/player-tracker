"use client";

import { ReactNode } from "react";

interface FadeInCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function FadeInCard({ children, delay = 0, className = "" }: FadeInCardProps) {
  const delayClass = delay > 0 ? `animate-stagger-${delay}` : "";

  return (
    <div className={`opacity-0 animate-subtleFadeIn ${delayClass} ${className}`}>
      {children}
    </div>
  );
}