// Default session timeout in milliseconds (8 hours)
const DEFAULT_SESSION_TIMEOUT = 8 * 60 * 60 * 1000;

// Mock authentication for preview purposes
export const mockAuth = {
  isAuthenticated: true,
  user: {
    id: '1',
    email: 'admin@playertracker.com',
    name: 'Admin User',
    role: 'admin'
  }
};

export const mockSignIn = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Accept any non-empty credentials for preview
  if (email && password) {
    // Store session in localStorage for session management
    if (typeof window !== 'undefined') {
      const sessionData = {
        user: mockAuth.user,
        session: { access_token: 'mock-token' },
        loginTime: Date.now(),
        expiresAt: Date.now() + DEFAULT_SESSION_TIMEOUT
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
        user: mockAuth.user,
        session: { access_token: 'mock-token' }
      },
      error: null
    };
  }

  return {
    data: { user: null, session: null },
    error: { message: 'Invalid credentials' }
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
        return currentTime < expiryTime;
      } catch (error) {
        return false;
      }
    }
  }
  return false;
};