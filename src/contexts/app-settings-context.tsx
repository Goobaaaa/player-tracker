"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { validateAndCleanLocalStorage } from "@/lib/localStorage-cleanup";

interface AppSettings {
  appName: string;
  setAppName: (name: string) => void;
  appLogo: string;
  setAppLogo: (logo: string) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  sessionTimeout: number; // in minutes
  setSessionTimeout: (timeout: number) => void;
  resetToDefaults: () => void;
  handleLogoUpload: (file: File) => Promise<string>;
}

const AppSettingsContext = createContext<AppSettings | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [appName, setAppName] = useState("USMS Dashboard");
  const [appLogo, setAppLogo] = useState("/media/usmsbadge.png");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [sessionTimeout, setSessionTimeout] = useState(30); // default 30 minutes

  // Load settings from localStorage on mount - simplified to avoid SSR issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear all localStorage data to avoid corruption issues
      try {
        localStorage.removeItem('usms-app-name');
        localStorage.removeItem('usms-app-logo');
        localStorage.removeItem('usms-theme');
        localStorage.removeItem('usms-session-timeout');
        localStorage.removeItem('usms-session');
        console.log('Cleared localStorage to avoid corruption issues');
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
  }, []);

  // Apply theme to document root
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'light') {
        root.classList.add('light-theme');
        root.classList.remove('dark-theme');
      } else {
        root.classList.add('dark-theme');
        root.classList.remove('light-theme');
      }
    }
  }, [theme]);

  const resetToDefaults = () => {
    setAppName("USMS Dashboard");
    setAppLogo("/media/usmsbadge.png");
    setTheme("dark");
    setSessionTimeout(30);
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Function to handle logo upload and convert to base64
  const handleLogoUpload = async (file: File): Promise<string> => {
    try {
      const base64 = await fileToBase64(file);
      if (typeof window !== 'undefined') {
        localStorage.setItem('usms-app-logo', base64);
      }
      return base64;
    } catch (error) {
      console.error('Failed to convert logo to base64:', error);
      throw error;
    }
  };

  return (
    <AppSettingsContext.Provider value={{ appName, setAppName, appLogo, setAppLogo, theme, setTheme, sessionTimeout, setSessionTimeout, resetToDefaults, handleLogoUpload }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error("useAppSettings must be used within an AppSettingsProvider");
  }
  return context;
}