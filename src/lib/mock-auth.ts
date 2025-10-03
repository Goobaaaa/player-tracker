// Default session timeout in milliseconds (8 hours)
const DEFAULT_SESSION_TIMEOUT = 8 * 60 * 60 * 1000;

import { getUserByUsername, HIDDEN_ADMIN } from './mock-data';

// No default authentication - requires explicit login
// Only hidden admin credentials will work in factory reset

export const mockSignIn = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check for hidden admin credentials first
  if (email === HIDDEN_ADMIN.username && password === HIDDEN_ADMIN.password) {
    const sessionData = {
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
      expiresAt: Date.now() + DEFAULT_SESSION_TIMEOUT
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('usms-session', JSON.stringify(sessionData));
      localStorage.setItem('usms-session-timeout', String(DEFAULT_SESSION_TIMEOUT));
    }

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
        // Store session for valid user
        if (typeof window !== 'undefined') {
          const sessionData = {
            user: user,
            session: { access_token: user.id === HIDDEN_ADMIN.id ? 'admin-token-hidden' : 'mock-token' },
            loginTime: Date.now(),
            expiresAt: Date.now() + DEFAULT_SESSION_TIMEOUT,
            isHiddenAdmin: user.id === HIDDEN_ADMIN.id
          };
          localStorage.setItem('usms-session', JSON.stringify(sessionData));

          // Also store session timeout preference (can be customized later)
          const timeoutPreference = localStorage.getItem('usms-session-timeout');
          if (!timeoutPreference) {
            localStorage.setItem('usms-session-timeout', String(DEFAULT_SESSION_TIMEOUT));
          }
        }

        return {
          data: {
            user: {
              id: user.id,
              email: `${user.username}@playertracker.com`,
              name: user.name,
              role: user.role,
              username: user.username,
              isHiddenAdmin: user.id === HIDDEN_ADMIN.id
            },
            session: { access_token: user.id === HIDDEN_ADMIN.id ? 'admin-token-hidden' : 'mock-token' }
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

  // Clear session from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('usms-session');
  }

  return { error: null };
};

export const mockGetSession = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));

  // Check if session exists in localStorage
  if (typeof window !== 'undefined') {
    try {
      const sessionData = localStorage.getItem('usms-session');
      if (sessionData) {
        const session = JSON.parse(sessionData);

        // Validate the session structure and check timeout
        if (session && session.session && session.user) {
          // Check if session has expired
          const currentTime = Date.now();
          const sessionTimeout = parseInt(localStorage.getItem('usms-session-timeout') || String(DEFAULT_SESSION_TIMEOUT));

          // Use expiresAt if available, otherwise calculate from loginTime
          const expiryTime = session.expiresAt || (session.loginTime + sessionTimeout);

          if (currentTime < expiryTime) {
            // Session is still valid
            return {
              data: {
                session: session.session,
                user: session.user
              },
              error: null
            };
          } else {
            // Session has expired, clean it up
            console.log('Session expired, removing from localStorage');
            localStorage.removeItem('usms-session');
            localStorage.removeItem('usms-session-timeout');
          }
        } else {
          // Invalid session structure, remove it
          console.log('Invalid session structure, removing from localStorage');
          localStorage.removeItem('usms-session');
        }
      }
    } catch (error) {
      // Only clear the specific problematic session data
      console.error('Invalid session data in localStorage:', error);
      localStorage.removeItem('usms-session');
    }
  }

  // No valid session found
  return {
    data: { session: null, user: null },
    error: { message: 'No active session' }
  };
};

// Utility functions for session management
export const setSessionTimeout = (timeoutMs: number) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('usms-session-timeout', String(timeoutMs));

    // Update current session expiry if it exists
    const sessionData = localStorage.getItem('usms-session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        session.expiresAt = Date.now() + timeoutMs;
        localStorage.setItem('usms-session', JSON.stringify(session));
      } catch (error) {
        console.error('Error updating session timeout:', error);
      }
    }
  }
};

export const getSessionTimeout = (): number => {
  if (typeof window !== 'undefined') {
    const timeout = localStorage.getItem('usms-session-timeout');
    return timeout ? parseInt(timeout) : DEFAULT_SESSION_TIMEOUT;
  }
  return DEFAULT_SESSION_TIMEOUT;
};

export const isSessionActive = (): boolean => {
  if (typeof window !== 'undefined') {
    const sessionData = localStorage.getItem('usms-session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        const currentTime = Date.now();
        const expiryTime = session.expiresAt || (session.loginTime + getSessionTimeout());

        // Check if session has expired
        if (currentTime >= expiryTime) {
          return false;
        }

        // Check if user is suspended
        if (session.user && session.user.username) {
          const user = getUserByUsername(session.user.username);
          if (user && user.isSuspended) {
            // Force logout by removing session
            localStorage.removeItem('usms-session');
            return false;
          }
        }

        return true;
      } catch {
        return false;
      }
    }
  }
  return false;
};

export const checkUserSuspension = (): boolean => {
  if (typeof window !== 'undefined') {
    const sessionData = localStorage.getItem('usms-session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        if (session.user && session.user.username) {
          const user = getUserByUsername(session.user.username);
          if (user && user.isSuspended) {
            // Force logout by removing session
            localStorage.removeItem('usms-session');
            return true; // User was suspended and logged out
          }
        }
      } catch {
        return false;
      }
    }
  }
  return false;
};