require('@testing-library/jest-dom');

const authMock = {
  signInWithPassword: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null }),
  signOut: jest.fn().mockResolvedValue({ error: null }),
  getSession: jest.fn().mockResolvedValue({ data: { session: { user: { id: 'test-user' } } } }),
  getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user', user_metadata: { name: 'Test User' } } } }),
};

const fromMock = {
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: {}, error: null }),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue({ data: [], error: null }),
};

const supabaseClientMock = {
  auth: authMock,
  from: () => fromMock,
  channel: () => ({
    on: () => ({
      subscribe: () => ({
        unsubscribe: jest.fn(),
      }),
    }),
  }),
  removeChannel: jest.fn(),
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: () => supabaseClientMock,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

jest.mock('@/components/notification-container', () => ({
  useNotification: () => ({
    showSuccess: jest.fn(),
    showError: jest.fn(),
    confirm: jest.fn((message, onConfirm) => onConfirm()),
  }),
}));

beforeEach(() => {
  Object.values(authMock).forEach(mockFn => mockFn.mockClear());
  Object.values(fromMock).forEach(mockFn => mockFn.mockClear());
});