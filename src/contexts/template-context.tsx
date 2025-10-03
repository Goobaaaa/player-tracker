"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Template } from "@/lib/database";
import { getTemplateById } from "@/lib/data";

interface TemplateContextType {
  currentTemplate: Template | null;
  setCurrentTemplate: (template: Template | null) => void;
  isTemplateMode: boolean;
  exitTemplateMode: () => void;
  navigateWithinTemplate: (path: string) => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [manuallyExited, setManuallyExited] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check URL for template parameter on mount and route changes
  useEffect(() => {
    const checkTemplateInUrl = async () => {
      // Check if we're on a template page
      const pathParts = pathname.split('/');
      if (pathParts[1] === 'template' && pathParts[2]) {
        const template = await getTemplateById(pathParts[2]);
        if (template) {
          setCurrentTemplate(template);
          setManuallyExited(false);
        }
      } else if (pathname === '/homepage') {
        // Only clear template state when explicitly going to homepage
        if (!manuallyExited) {
          setCurrentTemplate(null);
        }
      }
    };

    // Check initially and whenever pathname changes
    checkTemplateInUrl();
  }, [pathname, manuallyExited]);

  const isTemplateMode = currentTemplate !== null && !manuallyExited;

  const exitTemplateMode = () => {
    setCurrentTemplate(null);
    setManuallyExited(true);
    router.push('/homepage');
  };

  const navigateWithinTemplate = (path: string) => {
    if (currentTemplate && !manuallyExited) {
      // Navigate to the template-specific path
      router.push(`/template/${currentTemplate.id}${path}`);
    }
  };

  return (
    <TemplateContext.Provider value={{
      currentTemplate,
      setCurrentTemplate,
      isTemplateMode,
      exitTemplateMode,
      navigateWithinTemplate
    }}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error("useTemplate must be used within a TemplateProvider");
  }
  return context;
}