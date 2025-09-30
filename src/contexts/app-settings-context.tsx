"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AppSettings {
  appName: string;
  setAppName: (name: string) => void;
  appLogo: string;
  setAppLogo: (logo: string) => void;
  resetToDefaults: () => void;
  handleLogoUpload: (file: File) => Promise<string>;
}

const AppSettingsContext = createContext<AppSettings | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [appName, setAppName] = useState("USMS Dashboard");
  const [appLogo, setAppLogo] = useState("/media/usmsbadge.png");

  // Load settings from localStorage on mount - simplified to avoid SSR issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedAppName = localStorage.getItem('usms-app-name');
        const savedAppLogo = localStorage.getItem('usms-app-logo');

        if (savedAppName) {
          setAppName(savedAppName);
        }

        if (savedAppLogo) {
          setAppLogo(savedAppLogo);
        }
      } catch (error) {
        console.error('Failed to load settings from localStorage:', error);
      }
    }
  }, []);

  // Save appName to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('usms-app-name', appName);
      } catch (error) {
        console.error('Failed to save app name to localStorage:', error);
      }
    }
  }, [appName]);

  // Save appLogo to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('usms-app-logo', appLogo);
      } catch (error) {
        console.error('Failed to save app logo to localStorage:', error);
      }
    }
  }, [appLogo]);

  const resetToDefaults = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('usms-app-name');
        localStorage.removeItem('usms-app-logo');
        setAppName("USMS Dashboard");
        setAppLogo("/media/usmsbadge.png");
      } catch (error) {
        console.error('Failed to reset settings to defaults:', error);
      }
    }
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
    <AppSettingsContext.Provider value={{ appName, setAppName, appLogo, setAppLogo, resetToDefaults, handleLogoUpload }}>
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