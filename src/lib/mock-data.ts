import { Player, Asset, FinanceTransaction, Task, DashboardSummary, Mugshot, Media } from './database';

// Mock players data - made mutable for editing
export const mockPlayers: Player[] = [];

// Mock assets data
export const mockAssets: Asset[] = [];

// Mock transactions data
export const mockTransactions: FinanceTransaction[] = [];

// Mock tasks data
export const mockTasks: Task[] = [];

// Mock mugshots data - empty array for clean start
export const mockMugshots: Mugshot[] = [];

// Mock media data - empty array for clean start
export const mockMedia: Media[] = [];

// Mock dashboard summary
export const mockDashboardSummary: DashboardSummary = {
  totalPlayers: 0,
  totalAssetsValue: 0,
  totalCashBalance: 0,
  recentTasks: [],
  recentActivity: []
};

// Helper functions to get data by player ID
export const getPlayerAssets = (playerId: string): Asset[] => {
  return mockAssets.filter(asset => asset.playerId === playerId);
};

export const getPlayerTransactions = (playerId: string): FinanceTransaction[] => {
  return mockTransactions.filter(transaction => transaction.playerId === playerId);
};

export const calculatePlayerBalance = (playerId: string): number => {
  const transactions = getPlayerTransactions(playerId);
  return transactions.reduce((balance, transaction) => {
    return transaction.type === 'credit' ? balance + transaction.amount : balance - transaction.amount;
  }, 0);
};

export const calculatePlayerAssetsValue = (playerId: string): number => {
  const assets = getPlayerAssets(playerId);
  return assets.reduce((total, asset) => total + asset.vehicleValue, 0);
};

// Helper functions to get mugshots by player ID
export const getPlayerMugshots = (playerId: string): Mugshot[] => {
  return mockMugshots.filter(mugshot => mugshot.playerId === playerId);
};

export const getPlayerProfilePicture = (playerId: string): string | null => {
  const profileMugshot = mockMugshots.find(mugshot =>
    mugshot.playerId === playerId && mugshot.isProfilePicture
  );
  return profileMugshot ? profileMugshot.url : null;
};

export const setProfilePicture = (playerId: string, mugshotId: string): void => {
  // Remove profile picture flag from all mugshots for this player
  mockMugshots.forEach(mugshot => {
    if (mugshot.playerId === playerId) {
      mugshot.isProfilePicture = false;
    }
  });

  // Set the new profile picture
  const mugshotIndex = mockMugshots.findIndex(mugshot => mugshot.id === mugshotId);
  if (mugshotIndex !== -1) {
    mockMugshots[mugshotIndex].isProfilePicture = true;
  }
};

export const addMugshot = (playerId: string, url: string): Mugshot | null => {
  // Validate URL and file extension
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  const urlLower = url.toLowerCase();

  const hasValidExtension = validExtensions.some(ext =>
    urlLower.endsWith(ext) || urlLower.includes(ext + '?')
  );

  if (!hasValidExtension) {
    return null; // Invalid file extension
  }

  // Extract filename from URL
  const filename = url.split('/').pop() || 'mugshot.jpg';

  // Generate unique ID
  const id = Date.now().toString();

  // Create new mugshot
  const newMugshot: Mugshot = {
    id,
    playerId,
    filename,
    url,
    isProfilePicture: mockMugshots.length === 0, // Set as profile if first mugshot
    createdAt: new Date().toISOString()
  };

  mockMugshots.push(newMugshot);
  return newMugshot;
};

// Helper functions to get media by player ID
export const getPlayerMedia = (playerId: string): Media[] => {
  return mockMedia.filter(media => media.playerId === playerId);
};

export const addMedia = (playerId: string, url: string): Media | null => {
  // Validate URL and file extension
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.mp4', '.avi', '.mov', '.mp3', '.wav', '.pdf', '.doc', '.docx'];
  const urlLower = url.toLowerCase();

  const hasValidExtension = validExtensions.some(ext =>
    urlLower.endsWith(ext) || urlLower.includes(ext + '?')
  );

  if (!hasValidExtension) {
    return null; // Invalid file extension
  }

  // Extract filename from URL
  const filename = url.split('/').pop() || 'media.jpg';

  // Generate unique ID
  const id = Date.now().toString();

  // Create new media
  const newMedia: Media = {
    id,
    playerId,
    filename,
    url,
    createdAt: new Date().toISOString()
  };

  mockMedia.push(newMedia);
  return newMedia;
};

// Function to update player data
export const updatePlayer = (playerId: string, updates: Partial<Player>): void => {
  const playerIndex = mockPlayers.findIndex(player => player.id === playerId);
  if (playerIndex !== -1) {
    mockPlayers[playerIndex] = { ...mockPlayers[playerIndex], ...updates };
  }
};

// Function to add a new player
export const addPlayer = (playerData: Omit<Player, 'id' | 'createdAt'>): Player => {
  // Generate a unique ID using timestamp + random number to avoid collisions
  const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const newPlayer: Player = {
    id: uniqueId,
    ...playerData,
    createdAt: new Date().toISOString()
  };

  mockPlayers.push(newPlayer);

  // Update dashboard summary
  mockDashboardSummary.totalPlayers = mockPlayers.length;

  return newPlayer;
};