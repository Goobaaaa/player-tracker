"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { mockGetSession } from '@/lib/mock-auth';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  username: string;
  isHiddenAdmin?: boolean;
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
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    setLoading(true);
    try {
      const { data: { session, user }, error } = await mockGetSession();

      if (error) {
        // Clear session if error occurs
        setUser(null);
        setSession(null);
      } else {
        setUser(user);
        setSession(session);
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

  const signOut = async () => {
    // Session management is now handled globally in mock-auth
    await refreshSession();
  };

  return (
    <SessionContext.Provider
      value={{
        user,
        session,
        loading,
        signOut,
        refreshSession
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