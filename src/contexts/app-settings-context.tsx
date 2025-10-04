"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { globalAppSettings } from '@/lib/global-storage';

interface AppSettings {
  appName: string;
  appLogo: string;
  theme: 'dark' | 'light';
  sessionTimeout: number;
}

interface AppSettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  resetSettings: () => void;
  handleLogoUpload: (file: File) => void;
}

const defaultSettings: AppSettings = {
  appName: 'USMS Player Tracker',
  appLogo: '',
  theme: 'dark',
  sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    // Load settings from global storage on mount - simplified to avoid SSR issues
    try {
      // Load settings from global storage
      const savedAppName = globalAppSettings.getSetting('appName');
      const savedAppLogo = globalAppSettings.getSetting('appLogo');
      const savedTheme = globalAppSettings.getSetting('theme');
      const savedTimeout = globalAppSettings.getSetting('sessionTimeout');

      if (savedAppName || savedAppLogo || savedTheme || savedTimeout) {
        setSettings({
          appName: savedAppName || defaultSettings.appName,
          appLogo: savedAppLogo || defaultSettings.appLogo,
          theme: savedTheme || defaultSettings.theme,
          sessionTimeout: savedTimeout || defaultSettings.sessionTimeout
        });
        console.log('Loaded settings from global storage');
      }
    } catch (error) {
      console.error('Error loading settings from global storage:', error);
    }
  }, []);

  // Load theme from global storage separately to avoid SSR issues
  useEffect(() => {
    try {
      const savedTheme = globalAppSettings.getSetting('theme');
      if (savedTheme && savedTheme !== settings.theme) {
        setSettings(prev => ({ ...prev, theme: savedTheme }));
      }
    } catch (error) {
      console.warn('Error loading theme from global storage:', error);
    }
  }, [settings.theme]);

  // Save settings to global storage when they change
  useEffect(() => {
    try {
      globalAppSettings.setSetting('appName', settings.appName);
    } catch (error) {
      console.error('Error saving app name to global storage:', error);
    }
  }, [settings.appName]);

  useEffect(() => {
    try {
      globalAppSettings.setSetting('appLogo', settings.appLogo);
    } catch (error) {
      console.error('Error saving app logo to global storage:', error);
    }
  }, [settings.appLogo]);

  useEffect(() => {
    try {
      globalAppSettings.setSetting('theme', settings.theme);
    } catch (error) {
      console.error('Error saving theme to global storage:', error);
    }
  }, [settings.theme]);

  useEffect(() => {
    try {
      globalAppSettings.setSetting('sessionTimeout', settings.sessionTimeout);
    } catch (error) {
      console.error('Error saving session timeout to global storage:', error);
    }
  }, [settings.sessionTimeout]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    try {
      globalAppSettings.setSetting('appName', defaultSettings.appName);
      globalAppSettings.setSetting('appLogo', defaultSettings.appLogo);
      globalAppSettings.setSetting('theme', defaultSettings.theme);
      globalAppSettings.setSetting('sessionTimeout', defaultSettings.sessionTimeout);
    } catch (error) {
      console.error('Error resetting settings to global storage:', error);
    }
  };

  const handleLogoUpload = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        globalAppSettings.setSetting('appLogo', base64);
        setSettings(prev => ({ ...prev, appLogo: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AppSettingsContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
        handleLogoUpload
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
}

