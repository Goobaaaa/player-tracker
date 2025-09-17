"use client";

import { ReactNode } from "react";

interface FadeInCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function FadeInCard({ children, delay = 0, className = "", onClick }: FadeInCardProps) {
  const delayClass = delay > 0 ? `animate-stagger-${delay}` : "";

  return (
    <div
      className={`opacity-0 animate-subtleFadeIn ${delayClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}