// Default session timeout in milliseconds (8 hours)
const DEFAULT_SESSION_TIMEOUT = 8 * 60 * 60 * 1000;

import { getUserByUsername, HIDDEN_ADMIN } from './mock-data';
import { globalAppSettings } from './global-storage';

// Global session storage (cross-computer compatible)
interface SessionData {
  user: any;
  session: { access_token: string };
  loginTime: number;
  expiresAt: number;
  isHiddenAdmin: boolean;
}

// Global session storage (works across all computers)
const GLOBAL_SESSIONS: Map<string, SessionData> = new Map();

// No default authentication - requires explicit login
// Only hidden admin credentials will work in factory reset

export const mockSignIn = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check for hidden admin credentials first
  if (email === HIDDEN_ADMIN.username && password === HIDDEN_ADMIN.password) {
    const sessionId = `admin-session-${Date.now()}`;
    const sessionData: SessionData = {
      user: {
        id: HIDDEN_ADMIN.id,
        email: `${HIDDEN_ADMIN.username}@playertracker.com`,
        name: HIDDEN_ADMIN.name,
        role: HIDDEN_ADMIN.role,
        username: HIDDEN_ADMIN.username,
        isHiddenAdmin: true
      },
      session: { access_token: 'admin-token-hidden' },
      loginTime: Date.now(),
      expiresAt: Date.now() + DEFAULT_SESSION_TIMEOUT,
      isHiddenAdmin: true
    };

    GLOBAL_SESSIONS.set(sessionId, sessionData);

    return {
      data: {
        user: sessionData.user,
        session: sessionData.session
      },
      error: null
    };
  }

  // Check regular users (admin-created only - no dynamic creation)
  if (email && password) {
    // Check if user exists
    const user = getUserByUsername(email);

    if (user) {
      if (user.isSuspended) {
        return {
          data: { user: null, session: null },
          error: { message: 'Account suspended. Please contact an administrator.' }
        };
      }

      // Verify password for existing users
      if (user.password === password) {
        const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const sessionData: SessionData = {
          user: {
            id: user.id,
            email: `${user.username}@playertracker.com`,
            name: user.name,
            role: user.role,
            username: user.username,
            isHiddenAdmin: false
          },
          session: { access_token: 'mock-token' },
          loginTime: Date.now(),
          expiresAt: Date.now() + DEFAULT_SESSION_TIMEOUT,
          isHiddenAdmin: false
        };

        GLOBAL_SESSIONS.set(sessionId, sessionData);

        return {
          data: {
            user: sessionData.user,
            session: { access_token: 'mock-token' }
          },
          error: null
        };
      }
    }
  }

  return {
    data: { user: null, session: null },
    error: { message: 'Invalid credentials. Contact an administrator to create an account.' }
  };
};

export const mockSignOut = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));

  // Clear all global sessions
  GLOBAL_SESSIONS.clear();

  return { error: null };
};

export const mockGetSession = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));

  // Check if any active sessions exist in global storage
  const currentTime = Date.now();
  const sessionTimeout = globalAppSettings.getSetting('sessionTimeout') || DEFAULT_SESSION_TIMEOUT;

  // Find the most recent valid session
  let validSession: SessionData | null = null;
  let expiredSessionIds: string[] = [];

  for (const [sessionId, session] of GLOBAL_SESSIONS.entries()) {
    const expiryTime = session.expiresAt || (session.loginTime + sessionTimeout);

    if (currentTime < expiryTime) {
      if (!validSession || session.loginTime > validSession.loginTime) {
        validSession = session;
      }
    } else {
      expiredSessionIds.push(sessionId);
    }
  }

  // Clean up expired sessions
  expiredSessionIds.forEach(sessionId => {
    GLOBAL_SESSIONS.delete(sessionId);
    console.log('Session expired, removing from global storage');
  });

  if (validSession) {
    // Check if user is suspended
    if (validSession.user && validSession.user.username) {
      const user = getUserByUsername(validSession.user.username);
      if (user && user.isSuspended) {
        // Force logout by removing session
        for (const [sessionId, session] of GLOBAL_SESSIONS.entries()) {
          if (session.user.username === validSession.user.username) {
            GLOBAL_SESSIONS.delete(sessionId);
          }
        }
        return {
          data: { session: null, user: null },
          error: { message: 'Account suspended. Please contact an administrator.' }
        };
      }
    }

    // Session is still valid
    return {
      data: {
        session: validSession.session,
        user: validSession.user
      },
      error: null
    };
  }

  // No valid session found
  return {
    data: { session: null, user: null },
    error: { message: 'No active session' }
  };
};

// Utility functions for session management
export const setSessionTimeout = (timeoutMs: number) => {
  globalAppSettings.setSetting('sessionTimeout', timeoutMs);

  // Update current session expiry if it exists
  for (const [sessionId, session] of GLOBAL_SESSIONS.entries()) {
    session.expiresAt = Date.now() + timeoutMs;
  }
};

export const getSessionTimeout = (): number => {
  return globalAppSettings.getSetting('sessionTimeout') || DEFAULT_SESSION_TIMEOUT;
};

export const isSessionActive = (): boolean => {
  const currentTime = Date.now();
  const sessionTimeout = globalAppSettings.getSetting('sessionTimeout') || DEFAULT_SESSION_TIMEOUT;

  for (const session of GLOBAL_SESSIONS.values()) {
    const expiryTime = session.expiresAt || (session.loginTime + sessionTimeout);

    // Check if session has expired
    if (currentTime >= expiryTime) {
      continue;
    }

    // Check if user is suspended
    if (session.user && session.user.username) {
      const user = getUserByUsername(session.user.username);
      if (user && user.isSuspended) {
        // Force logout by removing session
        for (const [sessionId, s] of GLOBAL_SESSIONS.entries()) {
          if (s.user.username === session.user.username) {
            GLOBAL_SESSIONS.delete(sessionId);
          }
        }
        continue;
      }
    }

    return true;
  }

  return false;
};

export const checkUserSuspension = (): boolean => {
  for (const session of GLOBAL_SESSIONS.values()) {
    if (session.user && session.user.username) {
      const user = getUserByUsername(session.user.username);
      if (user && user.isSuspended) {
        // Force logout by removing session
        for (const [sessionId, s] of GLOBAL_SESSIONS.entries()) {
          if (s.user.username === session.user.username) {
            GLOBAL_SESSIONS.delete(sessionId);
          }
        }
        return true; // User was suspended and logged out
      }
    }
  }
  return false;
};

console.log('Global authentication system initialized - sessions work across all computers');