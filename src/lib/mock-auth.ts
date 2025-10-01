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
        loginTime: Date.now()
      };
      localStorage.setItem('usms-session', JSON.stringify(sessionData));
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
        return {
          data: {
            session: session.session,
            user: session.user
          },
          error: null
        };
      }
    } catch (error) {
      // Invalid session data, clear it and any other problematic data
      console.error('Invalid session data in localStorage:', error);
      localStorage.removeItem('usms-session');
      // Also clear any potentially corrupted settings
      try {
        localStorage.removeItem('usms-session-timeout');
        localStorage.removeItem('usms-theme');
        localStorage.removeItem('usms-app-name');
        localStorage.removeItem('usms-app-logo');
      } catch (clearError) {
        console.error('Error clearing localStorage:', clearError);
      }
    }
  }

  // No valid session found
  return {
    data: { session: null, user: null },
    error: { message: 'No active session' }
  };
};