"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '@/lib/api-client';

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  isSuspended: boolean;
}

interface Session {
  access_token: string;
}

interface SessionContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    setLoading(true);
    try {
      const response = await authApi.getSession();

      if (response.error || !response.data) {
        setUser(null);
        setSession(null);
      } else {
        setUser(response.data.user);
        setSession(response.data.session);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const result = await authApi.login(username, password);

      if (result.success && result.data) {
        setUser(result.data.user);
        setSession(result.data.session);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const signOut = async () => {
    try {
      await authApi.logout();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        user,
        session,
        loading,
        signOut,
        refreshSession,
        login
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

export type { SessionContextType };