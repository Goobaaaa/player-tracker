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
  return { error: null };
};

export const mockGetSession = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    data: {
      session: mockAuth.isAuthenticated ? {
        access_token: 'mock-token',
        user: mockAuth.user
      } : null
    },
    error: null
  };
};