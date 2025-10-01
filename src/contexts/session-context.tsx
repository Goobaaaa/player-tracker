"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppSettings } from "./app-settings-context";

interface SessionContext {
  isSessionActive: boolean;
  resetSessionTimer: () => void;
  lastActivity: number;
}

const SessionContext = createContext<SessionContext | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isSessionActive, setIsSessionActive] = useState(true);
  const { sessionTimeout } = useAppSettings();
  const router = useRouter();

  const resetSessionTimer = () => {
    setLastActivity(Date.now());
    setIsSessionActive(true);
  };

  useEffect(() => {
    const checkSessionTimeout = () => {
      const now = Date.now();
      const inactiveTime = now - lastActivity;
      const timeoutMs = sessionTimeout * 60 * 1000; // Convert minutes to milliseconds

      if (inactiveTime > timeoutMs) {
        setIsSessionActive(false);
        // Clear any stored session data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('usms-session');
        }
        // Redirect to login
        router.push('/login');
      }
    };

    // Check every minute
    const interval = setInterval(checkSessionTimeout, 60 * 1000);

    return () => clearInterval(interval);
  }, [lastActivity, sessionTimeout, router]);

  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      resetSessionTimer();
    };

    // Listen for various user activity events
    const events = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'
    ];

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  return (
    <SessionContext.Provider value={{ isSessionActive, resetSessionTimer, lastActivity }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}