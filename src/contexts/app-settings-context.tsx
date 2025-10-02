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
      try {
        // Load settings from localStorage without clearing session data
        const savedAppName = localStorage.getItem('usms-app-name');
        const savedAppLogo = localStorage.getItem('usms-app-logo');
        const savedTheme = localStorage.getItem('usms-theme');
        const savedTimeout = localStorage.getItem('usms-session-timeout');

        if (savedAppName) setAppName(savedAppName);
        if (savedAppLogo) setAppLogo(savedAppLogo);
        if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme);
        if (savedTimeout) setSessionTimeout(parseInt(savedTimeout));

        console.log('Loaded settings from localStorage');
      } catch (error) {
        console.error('Error loading settings from localStorage:', error);
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

  // Ensure dark mode is applied on initial load for new users
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('usms-theme');
      if (!savedTheme) {
        // No saved theme, set to dark for new users
        setTheme('dark');
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('usms-app-name', appName);
      } catch (error) {
        console.error('Error saving app name:', error);
      }
    }
  }, [appName]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('usms-app-logo', appLogo);
      } catch (error) {
        console.error('Error saving app logo:', error);
      }
    }
  }, [appLogo]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('usms-theme', theme);
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('usms-session-timeout', String(sessionTimeout));
      } catch (error) {
        console.error('Error saving session timeout:', error);
      }
    }
  }, [sessionTimeout]);

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