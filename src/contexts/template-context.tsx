"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Template } from "@/lib/database";
import { getTemplateById } from "@/lib/mock-data";

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

  // Check URL for template parameter on mount and route changes
  useEffect(() => {
    const checkTemplateInUrl = () => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const templateId = urlParams.get('template');

        if (templateId) {
          const template = getTemplateById(templateId);
          if (template) {
            setCurrentTemplate(template);
            setManuallyExited(false);
          }
        } else {
          // Check if we're on a template page
          const pathParts = window.location.pathname.split('/');
          if (pathParts[1] === 'template' && pathParts[2]) {
            const template = getTemplateById(pathParts[2]);
            if (template) {
              setCurrentTemplate(template);
              setManuallyExited(false);
            }
          }
          // Don't automatically clear template state - let it persist unless manually exited
        }
      }
    };

    // Check initially
    checkTemplateInUrl();

    // Listen for route changes
    const handleRouteChange = () => {
      checkTemplateInUrl();
    };

    // Override pushState to detect navigation
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(handleRouteChange, 0);
    };

    // Override replaceState to detect navigation
    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(handleRouteChange, 0);
    };

    // Listen for popstate (back/forward buttons)
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const isTemplateMode = currentTemplate !== null && !manuallyExited;

  const exitTemplateMode = () => {
    setCurrentTemplate(null);
    setManuallyExited(true);
    // Remove template parameter from URL if present
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('template');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const navigateWithinTemplate = (path: string) => {
    if (typeof window !== 'undefined' && currentTemplate && !manuallyExited) {
      const url = new URL(path, window.location.origin);
      url.searchParams.set('template', currentTemplate.id);
      window.location.href = url.toString();
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