import { Player, Asset, FinanceTransaction, Task, DashboardSummary, Mugshot, Media, HouseMedia, Document, TaskComment, Incident, Weapon, Template, TemplatePermission, StaffMember, Vehicle, ChatMessage, MediaItem, Quote, Commendation, Event } from './database';
import { AuditLogEntry } from '../components/activity-feed';

// Mock players data - made mutable for editing
export const mockPlayers: Player[] = [];

// Mock assets data
export const mockAssets: Asset[] = [];

// Mock weapons data
export const mockWeapons: Weapon[] = [];

// Mock templates data
export const mockTemplates: Template[] = [
  {
    id: 'template-1',
    name: 'Sample Investigation Template',
    logoUrl: '/USMSBadge.png',
    createdBy: '1',
    createdAt: new Date().toISOString(),
    isActive: true,
    description: 'A sample template for investigation tracking'
  }
];

// Mock template permissions data
export const mockTemplatePermissions: TemplatePermission[] = [
  {
    id: 'perm-1',
    templateId: 'template-1',
    userId: '1',
    assignedBy: '1',
    assignedAt: new Date().toISOString()
  },
  {
    id: 'perm-2',
    templateId: 'template-1',
    userId: '2',
    assignedBy: '1',
    assignedAt: new Date().toISOString()
  },
  {
    id: 'perm-3',
    templateId: 'template-1',
    userId: '3',
    assignedBy: '1',
    assignedAt: new Date().toISOString()
  }
];

// Mock staff members data
export const mockStaffMembers: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'John Smith',
    username: 'jsmith',
    password: 'admin123',
    role: 'admin',
    tagLine: 'Always ready, always there',
    description: 'Veteran Marshall with 15 years of service. Specializes in tactical operations and training.',
    bloodType: 'O+',
    favouriteHobby: 'Rock climbing',
    portraitUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    createdAt: new Date().toISOString(),
    createdBy: '1'
  },
  {
    id: 'staff-2',
    name: 'Sarah Johnson',
    username: 'sjohnson',
    password: 'marshall123',
    role: 'marshall',
    tagLine: 'Rising to every challenge',
    description: 'Expert in investigation and forensic analysis. Known for attention to detail.',
    bloodType: 'A-',
    favouriteHobby: 'Photography',
    portraitUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b7e6?w=200&h=200&fit=crop&crop=face',
    createdAt: new Date().toISOString(),
    createdBy: '1'
  },
  {
    id: 'staff-3',
    name: 'Mike Wilson',
    username: 'mwilson',
    password: 'marshall123',
    role: 'marshall',
    tagLine: 'Silent but effective',
    description: 'Specializes in undercover operations and surveillance. Master of stealth tactics.',
    bloodType: 'B+',
    favouriteHobby: 'Chess',
    portraitUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    createdAt: new Date().toISOString(),
    createdBy: '1'
  },
  {
    id: 'staff-4',
    name: 'Emily Davis',
    username: 'edavis',
    password: 'marshall123',
    role: 'marshall',
    tagLine: 'Strike with precision',
    description: 'Expert marksman and tactical medic. Combines medical knowledge with combat skills.',
    bloodType: 'AB+',
    favouriteHobby: 'Martial arts',
    portraitUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    createdAt: new Date().toISOString(),
    createdBy: '1'
  }
];

// Mock vehicles data
export const mockVehicles: Vehicle[] = [
  {
    id: 'vehicle-1',
    name: 'Interceptor Mk IV',
    description: 'High-speed pursuit vehicle',
    imageUrl: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=300&fit=crop',
    details: 'Modified 2024 Dodge Charger with V8 engine, heavy-duty suspension, and advanced communication systems. Top speed: 180 mph. Features: run-flat tires, ballistic glass, prisoner compartment.',
    createdAt: new Date().toISOString(),
    createdBy: '1'
  },
  {
    id: 'vehicle-2',
    name: 'Mobile Command Center',
    description: 'Tactical operations vehicle',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    details: 'Converted 2023 Ford F-550 with full command center. Features: satellite communications, drone deployment system, mobile interrogation room, advanced surveillance equipment.',
    createdAt: new Date().toISOString(),
    createdBy: '1'
  },
  {
    id: 'vehicle-3',
    name: 'Tactical Response Unit',
    description: 'SWAT support vehicle',
    imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop',
    details: 'Armored 2024 Lenco BearCat. Capacity: 10 fully equipped officers. Features: ballistic protection, gas gun deployment, thermal imaging, breach tools.',
    createdAt: new Date().toISOString(),
    createdBy: '1'
  },
  {
    id: 'vehicle-4',
    name: 'Surveillance Van',
    description: 'Covert operations vehicle',
    imageUrl: 'https://images.unsplash.com/photo-1579621194208-cc5b4b3b1f5c?w=400&h=300&fit=crop',
    details: 'Modified 2023 Mercedes Sprinter with advanced surveillance equipment. Features: multiple camera systems, audio surveillance, GPS tracking, undercover lighting.',
    createdAt: new Date().toISOString(),
    createdBy: '1'
  }
];

// Mock chat messages data
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'chat-1',
    authorId: '1',
    authorName: 'Admin User',
    content: 'Welcome to the USMS Chatroom! Please keep conversations professional.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    reactions: { '👍': ['2', '3'] }
  },
  {
    id: 'chat-2',
    authorId: '2',
    authorName: 'John Doe',
    content: 'Great job on the operation yesterday team! Everyone performed excellently.',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    reactions: { '🎉': ['1'], '💪': ['3'] }
  }
];

// Mock media items data
export const mockMediaItems: MediaItem[] = [
  {
    id: 'media-1',
    url: 'https://images.unsplash.com/photo-1551854346-d4bab8948649?w=400&h=300&fit=crop',
    description: 'Team training exercise at the range',
    uploaderId: '1',
    uploaderName: 'Admin User',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'media-2',
    url: 'https://images.unsplash.com/photo-1519389950473-82ba3a57a8a0?w=400&h=300&fit=crop',
    description: 'New tactical gear deployment',
    uploaderId: '2',
    uploaderName: 'John Doe',
    createdAt: new Date(Date.now() - 43200000).toISOString()
  }
];

// Mock quotes data
export const mockQuotes: Quote[] = [
  {
    id: 'quote-1',
    quoteText: 'The only easy day was yesterday.',
    whoSaidIt: 'Navy SEAL saying',
    whenSaid: 'During training',
    whySaid: 'To emphasize the importance of continuous improvement',
    submittedBy: '1',
    submittedByName: 'Admin User',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'quote-2',
    quoteText: 'Courage is not the absence of fear, but the triumph over it.',
    whoSaidIt: 'Nelson Mandela',
    whenSaid: 'Inaugural speech',
    whySaid: 'To inspire courage in the face of adversity',
    submittedBy: '2',
    submittedByName: 'John Doe',
    createdAt: new Date(Date.now() - 259200000).toISOString()
  }
];

// Mock commendations data
export const mockCommendations: Commendation[] = [
  {
    id: 'commend-1',
    recipientName: 'Sarah Johnson',
    shortReason: 'Exceptional bravery during hostage rescue',
    fullExplanation: 'Officer Johnson demonstrated exceptional courage and tactical skill during the hostage rescue operation on Main Street. Despite immediate danger, she maintained composure and successfully negotiated the peaceful release of all hostages while apprehending the suspect without injury.',
    issuedBy: '1',
    issuedByName: 'Admin User',
    imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
    issuedAt: new Date(Date.now() - 604800000).toISOString()
  },
  {
    id: 'commend-2',
    recipientName: 'Mike Wilson',
    shortReason: 'Outstanding investigative work',
    fullExplanation: 'Detective Wilson\'s meticulous investigation led to the breakthrough in the smuggling case that had stumped the department for months. His attention to detail and innovative thinking uncovered crucial evidence that led to multiple arrests.',
    issuedBy: '1',
    issuedByName: 'Admin User',
    imageUrl: 'https://images.unsplash.com/photo-1554908988-4e52b76294bd?w=100&h=100&fit=crop',
    issuedAt: new Date(Date.now() - 1209600000).toISOString()
  }
];

// Mock events data
export const mockEvents: Event[] = [
  {
    id: 'event-1',
    title: 'Quarterly Training Exercise',
    description: 'Mandatory tactical training and team building exercises',
    dateTime: new Date(Date.now() + 604800000).toISOString(),
    createdBy: '1',
    createdByName: 'Admin User',
    createdAt: new Date().toISOString()
  },
  {
    id: 'event-2',
    title: 'Department Awards Ceremony',
    description: 'Annual recognition of outstanding service and achievements',
    dateTime: new Date(Date.now() + 1209600000).toISOString(),
    createdBy: '1',
    createdByName: 'Admin User',
    createdAt: new Date().toISOString()
  }
];

// Function to add an asset to a player
export const addAsset = (
  playerId: string,
  vehicleName: string,
  vehicleReg: string,
  vehicleValue: number,
  vehicleColour: string,
  vehicleLocation: string,
  notes?: string
): Asset => {
  const newAsset: Asset = {
    id: Date.now().toString(),
    playerId,
    vehicleName,
    vehicleReg,
    vehicleVin: `VIN-${Date.now()}`, // Generate a VIN
    vehicleColour,
    vehicleValue,
    vehicleLocation,
    acquiredAt: new Date().toISOString(),
    notes,
    vehicleImages: []
  };

  mockAssets.push(newAsset);

  // Update dashboard summary
  updateDashboardSummary();

  // Add audit log entry
  const player = mockPlayers.find(p => p.id === playerId);
  const playerName = player ? player.name : "Unknown Suspect";
  const currentUser = getCurrentUser();
  addAuditLogEntry(
    'add',
    'asset',
    vehicleName,
    newAsset.id,
    `Added asset "${vehicleName}" (${vehicleReg}) to suspect "${playerName}" - Value: $${vehicleValue.toLocaleString()}`,
    currentUser.id,
    currentUser.username
  );

  return newAsset;
};

// Function to add vehicle images to an asset
export const addVehicleImage = (assetId: string, imageUrl: string): boolean => {
  const assetIndex = mockAssets.findIndex(asset => asset.id === assetId);
  if (assetIndex !== -1) {
    const asset = mockAssets[assetIndex];

    // Initialize vehicleImages array if it doesn't exist
    if (!asset.vehicleImages) {
      asset.vehicleImages = [];
    }

    // Add the new image
    asset.vehicleImages.push(imageUrl);

    // Update dashboard summary
    updateDashboardSummary();

    // Add audit log entry
    const player = mockPlayers.find(p => p.id === asset.playerId);
    const playerName = player ? player.name : "Unknown Suspect";
    const currentUser = getCurrentUser();
    addAuditLogEntry(
      'add',
      'asset',
      asset.vehicleName,
      asset.id,
      `Added image to vehicle "${asset.vehicleName}" (${asset.vehicleReg}) for suspect "${playerName}"`,
      currentUser.id,
      currentUser.username
    );

    return true;
  }
  return false;
};

// Function to remove a vehicle image from an asset
export const removeVehicleImage = (assetId: string, imageIndex: number): boolean => {
  const assetIndex = mockAssets.findIndex(asset => asset.id === assetId);
  if (assetIndex !== -1 && mockAssets[assetIndex].vehicleImages) {
    const asset = mockAssets[assetIndex];
    const vehicleImages = asset.vehicleImages!;

    if (imageIndex >= 0 && imageIndex < vehicleImages.length) {
      // Remove the image
      vehicleImages.splice(imageIndex, 1);

      // Save to storage
      saveToStorage(STORAGE_KEYS.assets, mockAssets);

      // Update dashboard summary
      updateDashboardSummary();

      // Add audit log entry
      const player = mockPlayers.find(p => p.id === asset.playerId);
      const playerName = player ? player.name : "Unknown Suspect";
      const currentUser = getCurrentUser();
      addAuditLogEntry(
        'delete',
        'asset',
        asset.vehicleName,
        asset.id,
        `Removed image from vehicle "${asset.vehicleName}" (${asset.vehicleReg}) for suspect "${playerName}"`,
        currentUser.id,
        currentUser.username
      );

      return true;
    }
  }
  return false;
};

// Mock transactions data
export const mockTransactions: FinanceTransaction[] = [];

// Function to add a transaction to a player
export const addTransaction = (
  playerId: string,
  description: string,
  amount: number,
  type: 'credit' | 'debit'
): FinanceTransaction => {
  const newTransaction: FinanceTransaction = {
    id: Date.now().toString(),
    playerId,
    description,
    amount,
    type,
    createdAt: new Date().toISOString()
  };

  mockTransactions.push(newTransaction);

  // Update dashboard summary
  updateDashboardSummary();

  // Add audit log entry
  const player = mockPlayers.find(p => p.id === playerId);
  const playerName = player ? player.name : "Unknown Suspect";
  const currentUser = getCurrentUser();
  addAuditLogEntry(
    'add',
    'asset',
    `Transaction: ${description}`,
    newTransaction.id,
    `Added ${type} transaction of $${amount.toLocaleString()} to suspect "${playerName}" - ${description}`,
    currentUser.id,
    currentUser.username
  );

  return newTransaction;
};

// Function to add a weapon to a player
export const addWeapon = (
  playerId: string,
  gunName: string,
  serialNumber: string,
  ballisticsReference: string,
  status: 'seized' | 'not_seized',
  notes?: string
): Weapon => {
  const newWeapon: Weapon = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    playerId,
    gunName,
    serialNumber,
    ballisticsReference,
    status,
    notes,
    createdAt: new Date().toISOString()
  };

  mockWeapons.push(newWeapon);

  // Add audit log entry
  const player = mockPlayers.find(p => p.id === playerId);
  const playerName = player ? player.name : "Unknown Suspect";
  const currentUser = getCurrentUser();
  addAuditLogEntry(
    'add',
    'asset',
    `Weapon: ${gunName}`,
    newWeapon.id,
    `Added weapon "${gunName}" (${serialNumber}) to suspect "${playerName}" - Status: ${status.replace('_', ' ')}`,
    currentUser.id,
    currentUser.username
  );

  return newWeapon;
};

// Helper functions to get weapons by player ID
export const getPlayerWeapons = (playerId: string): Weapon[] => {
  return mockWeapons.filter(weapon => weapon.playerId === playerId);
};

// LocalStorage helpers
const STORAGE_KEYS = {
  players: 'playerTracker_players',
  tasks: 'playerTracker_tasks',
  taskComments: 'playerTracker_taskComments',
  auditLog: 'playerTracker_auditLog',
  incidents: 'playerTracker_incidents',
  assets: 'playerTracker_assets'
};

const saveToStorage = (key: string, data: unknown) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
    }
  }
};

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error(`Error loading from localStorage:`, error);
      return defaultValue;
    }
  }
  return defaultValue;
};

// Mock tasks data - load from localStorage or default to empty array
export const mockTasks: Task[] = loadFromStorage(STORAGE_KEYS.tasks, []);

// Mock mugshots data - empty array for clean start
export const mockMugshots: Mugshot[] = [];

// Mock media data - empty array for clean start
export const mockMedia: Media[] = [];

// Mock house media data - empty array for clean start
export const mockHouseMedia: HouseMedia[] = [];

// Mock player documents data - empty array for clean start
export const mockPlayerDocuments: Document[] = [];

// Mock task comments data - load from localStorage or default to empty array
export const mockTaskComments: TaskComment[] = loadFromStorage(STORAGE_KEYS.taskComments, []);

// Mock incidents data - load from localStorage or default to empty array
export const mockIncidents: Incident[] = loadFromStorage(STORAGE_KEYS.incidents, []);

// Dynamic audit log - load from localStorage or default to initial entries
export const mockAuditLog: AuditLogEntry[] = loadFromStorage(STORAGE_KEYS.auditLog, [
  // Initial entries
  {
    id: "1",
    userId: "1",
    username: "Officer Smith",
    action: "create",
    entityType: "suspect",
    entityName: "John Doe",
    entityId: "1",
    details: "Created new suspect profile",
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "2",
    userId: "2",
    username: "Officer Johnson",
    action: "update",
    entityType: "suspect",
    entityName: "Jane Smith",
    entityId: "2",
    details: "Updated suspect contact information",
    timestamp: new Date(Date.now() - 7200000).toISOString()
  }
]);

// Audit log management functions
export const addAuditLogEntry = (
  action: 'create' | 'update' | 'delete' | 'add' | 'comment',
  entityType: 'suspect' | 'task' | 'document' | 'asset' | 'media' | 'comment' | 'incident' | 'template' | 'permission',
  entityName: string,
  entityId: string,
  details: string,
  userId: string = "1", // Default to current user
  username: string = "Current User"
): void => {
  const newEntry: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    username,
    action,
    entityType,
    entityName,
    entityId,
    details,
    timestamp: new Date().toISOString()
  };

  mockAuditLog.unshift(newEntry); // Add to beginning of array
  saveToStorage(STORAGE_KEYS.auditLog, mockAuditLog); // Save to localStorage
};

// Function to get current audit log (loads fresh from localStorage)
export const getCurrentAuditLog = (): AuditLogEntry[] => {
  return loadFromStorage(STORAGE_KEYS.auditLog, mockAuditLog);
};

// Get current user info (mock implementation)
export const getCurrentUser = () => {
  return {
    id: "1",
    username: "Current User"
  };
};

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

export const updateDashboardSummary = (): void => {
  // Update total players count
  mockDashboardSummary.totalPlayers = mockPlayers.length;

  // Calculate total assets value across all players
  let totalAssetsValue = 0;
  let totalCashBalance = 0;

  mockPlayers.forEach(player => {
    totalAssetsValue += calculatePlayerAssetsValue(player.id);
    totalCashBalance += calculatePlayerBalance(player.id);
  });

  mockDashboardSummary.totalAssetsValue = totalAssetsValue;
  mockDashboardSummary.totalCashBalance = totalCashBalance;

  // Update recent tasks (last 5 tasks)
  mockDashboardSummary.recentTasks = getAllTasks()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
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

export const addMugshot = (playerId: string, url: string, displayName?: string): Mugshot | null => {
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
    displayName,
    url,
    isProfilePicture: mockMugshots.length === 0, // Set as profile if first mugshot
    createdAt: new Date().toISOString()
  };

  mockMugshots.push(newMugshot);

  // Add audit log entry
  const player = mockPlayers.find(p => p.id === playerId);
  const playerName = player ? player.name : "Unknown Suspect";
  const currentUser = getCurrentUser();
  addAuditLogEntry(
    'add',
    'media',
    displayName || `Mugshot for ${playerName}`,
    id,
    `Added mugshot to suspect "${playerName}"`,
    currentUser.id,
    currentUser.username
  );

  return newMugshot;
};

// Helper functions to get media by player ID
export const getPlayerMedia = (playerId: string): Media[] => {
  return mockMedia.filter(media => media.playerId === playerId);
};

export const addMedia = (playerId: string, url: string, displayName?: string): Media | null => {
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
    displayName,
    url,
    createdAt: new Date().toISOString()
  };

  mockMedia.push(newMedia);

  // Add audit log entry
  const player = mockPlayers.find(p => p.id === playerId);
  const playerName = player ? player.name : "Unknown Suspect";
  const currentUser = getCurrentUser();
  addAuditLogEntry(
    'add',
    'media',
    displayName || `Media for ${playerName}`,
    id,
    `Added media to suspect "${playerName}"`,
    currentUser.id,
    currentUser.username
  );

  return newMedia;
};

// Helper functions to get house media by player ID
export const getPlayerHouseMedia = (playerId: string): HouseMedia[] => {
  return mockHouseMedia.filter(media => media.playerId === playerId);
};

export const addHouseMedia = (playerId: string, url: string, displayName?: string): HouseMedia | null => {
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
  const filename = url.split('/').pop() || 'house.jpg';

  // Generate unique ID
  const id = Date.now().toString();

  // Create new house media
  const newHouseMedia: HouseMedia = {
    id,
    playerId,
    filename,
    displayName,
    url,
    createdAt: new Date().toISOString()
  };

  mockHouseMedia.push(newHouseMedia);

  // Add audit log entry
  const player = mockPlayers.find(p => p.id === playerId);
  const playerName = player ? player.name : "Unknown Suspect";
  const currentUser = getCurrentUser();
  addAuditLogEntry(
    'add',
    'media',
    displayName || `House Media for ${playerName}`,
    id,
    `Added house media to suspect "${playerName}"`,
    currentUser.id,
    currentUser.username
  );

  return newHouseMedia;
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
  updateDashboardSummary();

  // Add audit log entry
  const currentUser = getCurrentUser();
  addAuditLogEntry(
    'create',
    'suspect',
    newPlayer.name,
    newPlayer.id,
    `Created new suspect profile: ${newPlayer.name} (${newPlayer.alias})`,
    currentUser.id,
    currentUser.username
  );

  return newPlayer;
};

// Helper functions to manage player documents
export const getPlayerDocuments = (playerId: string): Document[] => {
  return mockPlayerDocuments.filter(doc => doc.playerId === playerId);
};

export const addPlayerDocument = (playerId: string, url: string, filename: string, isGoogleDoc: boolean, description?: string, originalFilename?: string): Document | null => {
  // Generate unique ID
  const id = Date.now().toString();

  // Create new document
  const newDocument: Document = {
    id,
    ownerUserId: 'system', // In a real app, this would be the current user
    playerId,
    filename,
    url,
    isGoogleDoc,
    createdAt: new Date().toISOString(),
    description,
    originalFilename
  };

  mockPlayerDocuments.push(newDocument);

  // Add audit log entry
  const player = mockPlayers.find(p => p.id === playerId);
  const playerName = player ? player.name : "Unknown Suspect";
  const currentUser = getCurrentUser();
  addAuditLogEntry(
    'add',
    'document',
    filename,
    id,
    `Added document "${filename}" to suspect "${playerName}"`,
    currentUser.id,
    currentUser.username
  );

  return newDocument;
};

export const deletePlayerDocument = (documentId: string): boolean => {
  const docIndex = mockPlayerDocuments.findIndex(doc => doc.id === documentId);
  if (docIndex !== -1) {
    mockPlayerDocuments.splice(docIndex, 1);
    return true;
  }
  return false;
};

// Function to delete a player
export const deletePlayer = (playerId: string): boolean => {
  const playerIndex = mockPlayers.findIndex(player => player.id === playerId);
  if (playerIndex !== -1) {
    // Remove the player
    mockPlayers.splice(playerIndex, 1);

    // Remove related assets
    const assetsToRemove = mockAssets.filter(asset => asset.playerId === playerId);
    assetsToRemove.forEach(asset => {
      const assetIndex = mockAssets.indexOf(asset);
      if (assetIndex !== -1) mockAssets.splice(assetIndex, 1);
    });

    // Update dashboard summary after asset removal
    updateDashboardSummary();

    // Remove related transactions
    const transactionsToRemove = mockTransactions.filter(transaction => transaction.playerId === playerId);
    transactionsToRemove.forEach(transaction => {
      const transactionIndex = mockTransactions.indexOf(transaction);
      if (transactionIndex !== -1) mockTransactions.splice(transactionIndex, 1);
    });

    // Remove related documents
    const documentsToRemove = mockPlayerDocuments.filter(doc => doc.playerId === playerId);
    documentsToRemove.forEach(doc => {
      const docIndex = mockPlayerDocuments.indexOf(doc);
      if (docIndex !== -1) mockPlayerDocuments.splice(docIndex, 1);
    });

    // Remove related mugshots
    const mugshotsToRemove = mockMugshots.filter(mugshot => mugshot.playerId === playerId);
    mugshotsToRemove.forEach(mugshot => {
      const mugshotIndex = mockMugshots.indexOf(mugshot);
      if (mugshotIndex !== -1) mockMugshots.splice(mugshotIndex, 1);
    });

    // Remove related media
    const mediaToRemove = mockMedia.filter(media => media.playerId === playerId);
    mediaToRemove.forEach(media => {
      const mediaIndex = mockMedia.indexOf(media);
      if (mediaIndex !== -1) mockMedia.splice(mediaIndex, 1);
    });

    // Remove related house media
    const houseMediaToRemove = mockHouseMedia.filter(houseMedia => houseMedia.playerId === playerId);
    houseMediaToRemove.forEach(houseMedia => {
      const houseMediaIndex = mockHouseMedia.indexOf(houseMedia);
      if (houseMediaIndex !== -1) mockHouseMedia.splice(houseMediaIndex, 1);
    });

    // Update dashboard summary
    updateDashboardSummary();

    return true;
  }
  return false;
};

// Task management functions
export const getAllTasks = (): Task[] => {
  // Always load fresh from localStorage to ensure consistency across tabs
  const stored = loadFromStorage(STORAGE_KEYS.tasks, []);
  mockTasks.length = 0; // Clear array
  mockTasks.push(...stored); // Copy stored data
  return [...mockTasks];
};

export const createTask = (
  name: string,
  description: string,
  priority: 'high' | 'medium' | 'low',
  risk: 'dangerous' | 'high' | 'medium' | 'low',
  assignedUsers: string[],
  deadline: string,
  createdBy: string,
  mediaUrls?: string[]
): Task => {
  const newTask: Task = {
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    priority,
    risk,
    assignedUsers,
    deadline,
    createdBy,
    createdAt: new Date().toISOString(),
    status: 'active',
    comments: [],
    mediaUrls
  };

  mockTasks.push(newTask);
  saveToStorage(STORAGE_KEYS.tasks, mockTasks); // Save to localStorage

  // Add audit log entry
  const currentUser = getCurrentUser();
  const assignedUserNames = assignedUsers.map(id => mockUsers.find(u => u.id === id)?.name || id).join(', ');
  addAuditLogEntry(
    'create',
    'task',
    name,
    newTask.id,
    `Created new task: ${name} (${priority} priority, ${risk} risk) assigned to: ${assignedUserNames}`,
    currentUser.id,
    currentUser.username
  );

  return newTask;
};

export const updateTask = (taskId: string, updates: Partial<Task>): boolean => {
  const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    const task = mockTasks[taskIndex];
    const oldTask = { ...task };

    // Update the task with new values
    const updatedTask = { ...task, ...updates };
    mockTasks[taskIndex] = updatedTask;

    // Reorder the tasks
    if (updates.status) {
      mockTasks.splice(taskIndex, 1);
      if (updates.status === 'completed') {
        mockTasks.push(updatedTask);
      } else {
        mockTasks.unshift(updatedTask);
      }
    }

    saveToStorage(STORAGE_KEYS.tasks, mockTasks); // Save to localStorage

    // Add audit log entry for significant changes
    const currentUser = getCurrentUser();
    const changes = [];

    if (updates.name && updates.name !== oldTask.name) {
      changes.push(`name from "${oldTask.name}" to "${updates.name}"`);
    }
    if (updates.priority && updates.priority !== oldTask.priority) {
      changes.push(`priority from ${oldTask.priority} to ${updates.priority}`);
    }
    if (updates.risk && updates.risk !== oldTask.risk) {
      changes.push(`risk from ${oldTask.risk} to ${updates.risk}`);
    }
    if (updates.status && updates.status !== oldTask.status) {
      changes.push(`status from ${oldTask.status} to ${updates.status}`);
    }
    if (updates.deadline && updates.deadline !== oldTask.deadline) {
      changes.push(`deadline from ${new Date(oldTask.deadline).toLocaleDateString()} to ${new Date(updates.deadline).toLocaleDateString()}`);
    }

    if (changes.length > 0) {
      const taskName = updates.name || oldTask.name;
      addAuditLogEntry(
        'update',
        'task',
        taskName,
        taskId,
        `Updated task: ${changes.join(', ')}`,
        currentUser.id,
        currentUser.username
      );
    }

    return true;
  }
  return false;
};

export const updateTaskStatus = (taskId: string, status: 'active' | 'completed' | 'overdue'): boolean => {
  return updateTask(taskId, { status });
};

export const toggleTaskCompleted = (taskId: string): boolean => {
  const task = mockTasks.find(task => task.id === taskId);
  if (task) {
    const newStatus = task.status === 'completed' ? 'active' : 'completed';
    return updateTaskStatus(taskId, newStatus);
  }
  return false;
};

export const deleteTask = (taskId: string): boolean => {
  const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    const task = mockTasks[taskIndex];

    // Remove task comments
    const commentsToRemove = mockTaskComments.filter(comment => comment.taskId === taskId);
    commentsToRemove.forEach(comment => {
      const commentIndex = mockTaskComments.indexOf(comment);
      if (commentIndex !== -1) mockTaskComments.splice(commentIndex, 1);
    });

    mockTasks.splice(taskIndex, 1);
    saveToStorage(STORAGE_KEYS.tasks, mockTasks); // Save to localStorage

    // Add audit log entry
    const currentUser = getCurrentUser();
    addAuditLogEntry(
      'delete',
      'task',
      task.name,
      task.id,
      `Deleted task: ${task.name}`,
      currentUser.id,
      currentUser.username
    );

    return true;
  }
  return false;
};

export const addTaskComment = (
  taskId: string,
  userId: string,
  username: string,
  text: string,
  mediaUrls?: string[],
  documentIds?: string[]
): TaskComment => {
  const newComment: TaskComment = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    taskId,
    userId,
    username,
    text,
    mediaUrls,
    documentIds,
    createdAt: new Date().toISOString()
  };

  // Add comment to task
  const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  let taskName = "Unknown Task";
  if (taskIndex !== -1) {
    mockTasks[taskIndex].comments.push(newComment);
    saveToStorage(STORAGE_KEYS.tasks, mockTasks); // Save to localStorage
    taskName = mockTasks[taskIndex].name;
  }

  // Also add to global comments array for backup/restore
  mockTaskComments.push(newComment);
  saveToStorage(STORAGE_KEYS.taskComments, mockTaskComments); // Save to localStorage

  // Add audit log entry
  const currentUser = getCurrentUser();
  const mediaCount = mediaUrls?.length || 0;
  const mediaText = mediaCount > 0 ? ` with ${mediaCount} attached file(s)` : '';
  addAuditLogEntry(
    'comment',
    'task',
    taskName,
    taskId,
    `Added comment to task "${taskName}"${mediaText}`,
    currentUser.id,
    currentUser.username
  );

  return newComment;
};

export const getTaskComments = (taskId: string): TaskComment[] => {
  return mockTaskComments.filter(comment => comment.taskId === taskId);
};

export const deleteTaskComment = (taskId: string, commentId: string): boolean => {
  // Remove from global comments array
  const commentIndex = mockTaskComments.findIndex(comment => comment.id === commentId);
  if (commentIndex === -1) return false;

  mockTaskComments.splice(commentIndex, 1);
  saveToStorage(STORAGE_KEYS.taskComments, mockTaskComments);

  // Remove from task's comments array
  const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    const task = mockTasks[taskIndex];
    task.comments = task.comments.filter(comment => comment.id !== commentId);
    saveToStorage(STORAGE_KEYS.tasks, mockTasks);

    // Add audit log entry
    const currentUser = getCurrentUser();
    addAuditLogEntry(
      'delete',
      'comment',
      'task comment',
      commentId,
      `Deleted comment from task "${task.name}"`,
      currentUser.id,
      currentUser.username
    );

    return true;
  }

  return false;
};

// Task utility functions
export const isTaskOverdue = (deadline: string): boolean => {
  return new Date(deadline) < new Date();
};

export const getDaysUntilDeadline = (deadline: string): number => {
  const deadlineDate = new Date(deadline);
  const currentDate = new Date();
  const diffTime = deadlineDate.getTime() - currentDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const updateTaskOverdueStatus = (): void => {
  let hasChanges = false;
  mockTasks.forEach(task => {
    if (task.status === 'active' && isTaskOverdue(task.deadline)) {
      task.status = 'overdue';
      hasChanges = true;
    }
  });
  if (hasChanges) {
    saveToStorage(STORAGE_KEYS.tasks, mockTasks); // Save to localStorage
  }
};

// Filter functions
export const filterTasksByRisk = (tasks: Task[], risk: string): Task[] => {
  return tasks.filter(task => task.risk === risk);
};

export const filterTasksByDueDate = (tasks: Task[], days: number): Task[] => {
  return tasks.filter(task => getDaysUntilDeadline(task.deadline) <= days);
};

export const filterTasksByTitle = (tasks: Task[], searchTerm: string): Task[] => {
  return tasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Mock documents data
export const mockDocuments: Document[] = [
  {
    id: '1',
    ownerUserId: '1',
    filename: 'Sample Report.pdf',
    url: '/documents/sample-report.pdf',
    isGoogleDoc: false,
    createdAt: '2024-01-15T10:00:00Z',
    description: 'Sample incident report document',
    originalFilename: 'Sample Report.pdf'
  }
];

// Incident management functions
export const addIncident = (
  title: string,
  incidentDateTime: string,
  suspects: string[],
  officers: string[],
  otherIndividuals: string[],
  description: string,
  mediaUrls: string[] = []
): Incident => {
  const currentUser = getCurrentUser();
  const newIncident: Incident = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    incidentDateTime,
    suspects,
    officers,
    otherIndividuals,
    description,
    mediaUrls,
    createdBy: currentUser.id,
    createdAt: new Date().toISOString(),
    status: 'open'
  };

  mockIncidents.push(newIncident);
  saveToStorage(STORAGE_KEYS.incidents, mockIncidents);

  // Add audit log entry
  addAuditLogEntry(
    'create',
    'incident',
    title,
    newIncident.id,
    `Created incident "${title}" with ${suspects.length} suspect(s) and ${officers.length} officer(s)`,
    currentUser.id,
    currentUser.username
  );

  return newIncident;
};

export const getAllIncidents = (): Incident[] => {
  return [...mockIncidents];
};

export const getIncidentById = (id: string): Incident | undefined => {
  return mockIncidents.find(incident => incident.id === id);
};

export const updateIncident = (
  id: string,
  updates: Partial<Incident>
): Incident | null => {
  const index = mockIncidents.findIndex(incident => incident.id === id);
  if (index === -1) return null;

  const updatedIncident = { ...mockIncidents[index], ...updates };
  mockIncidents[index] = updatedIncident;
  saveToStorage(STORAGE_KEYS.incidents, mockIncidents);

  // Add audit log entry
  const currentUser = getCurrentUser();
  addAuditLogEntry(
    'update',
    'incident',
    updatedIncident.title,
    updatedIncident.id,
    `Updated incident "${updatedIncident.title}"`,
    currentUser.id,
    currentUser.username
  );

  return updatedIncident;
};

export const deleteIncident = (id: string): boolean => {
  const index = mockIncidents.findIndex(incident => incident.id === id);
  if (index === -1) return false;

  const deletedIncident = mockIncidents[index];
  mockIncidents.splice(index, 1);
  saveToStorage(STORAGE_KEYS.incidents, mockIncidents);

  // Add audit log entry
  const currentUser = getCurrentUser();
  addAuditLogEntry(
    'delete',
    'incident',
    deletedIncident.title,
    deletedIncident.id,
    `Deleted incident "${deletedIncident.title}"`,
    currentUser.id,
    currentUser.username
  );

  return true;
};

// Mock users for task assignment
export const mockUsers = [
  { id: '1', name: 'Admin User', username: 'admin', role: 'admin', email: 'admin@playertracker.com' },
  { id: '2', name: 'John Doe', username: 'johndoe', role: 'marshall', email: 'john.doe@usms.gov' },
  { id: '3', name: 'Jane Smith', username: 'janesmith', role: 'marshall', email: 'jane.smith@usms.gov' },
  { id: '4', name: 'Mike Johnson', username: 'mikej', role: 'marshall', email: 'mike.johnson@usms.gov' },
  { id: '5', name: 'Sarah Wilson', username: 'swilson', role: 'marshall', email: 'sarah.wilson@usms.gov' }
];

// Template-related functions
export const createTemplate = (name: string, logoUrl?: string, description?: string, createdBy = '1'): Template => {
  const newTemplate: Template = {
    id: `template-${Date.now()}`,
    name,
    logoUrl,
    createdBy,
    createdAt: new Date().toISOString(),
    isActive: true,
    description
  };

  mockTemplates.push(newTemplate);

  // Add audit log entry
  const currentUser = getCurrentUser();
  addAuditLogEntry(
    'create',
    'template',
    name,
    newTemplate.id,
    `Created template "${name}"`,
    currentUser.id,
    currentUser.username
  );

  return newTemplate;
};

export const getAllTemplates = (): Template[] => {
  return mockTemplates.filter(template => template.isActive);
};

export const getTemplateById = (id: string): Template | undefined => {
  return mockTemplates.find(template => template.id === id && template.isActive);
};

export const updateTemplate = (id: string, updates: Partial<Template>): boolean => {
  const index = mockTemplates.findIndex(template => template.id === id);
  if (index === -1) return false;

  mockTemplates[index] = { ...mockTemplates[index], ...updates };

  // Add audit log entry
  const currentUser = getCurrentUser();
  const template = mockTemplates[index];
  addAuditLogEntry(
    'update',
    'template',
    template.name,
    template.id,
    `Updated template "${template.name}"`,
    currentUser.id,
    currentUser.username
  );

  return true;
};

export const deleteTemplate = (id: string): boolean => {
  const index = mockTemplates.findIndex(template => template.id === id);
  if (index === -1) return false;

  const deletedTemplate = mockTemplates[index];
  mockTemplates[index].isActive = false;

  // Remove all permissions for this template
  mockTemplatePermissions.filter(perm => perm.templateId !== id);

  // Add audit log entry
  const currentUser = getCurrentUser();
  addAuditLogEntry(
    'delete',
    'template',
    deletedTemplate.name,
    deletedTemplate.id,
    `Deleted template "${deletedTemplate.name}"`,
    currentUser.id,
    currentUser.username
  );

  return true;
};

export const getUserTemplates = (userId: string): Template[] => {
  const userPermissionIds = mockTemplatePermissions
    .filter(perm => perm.userId === userId)
    .map(perm => perm.templateId);

  return mockTemplates.filter(template =>
    template.isActive && userPermissionIds.includes(template.id)
  );
};

export const assignTemplatePermission = (templateId: string, userId: string, assignedBy: string): TemplatePermission | null => {
  // Check if permission already exists
  const existingPermission = mockTemplatePermissions.find(
    perm => perm.templateId === templateId && perm.userId === userId
  );

  if (existingPermission) return null;

  const newPermission: TemplatePermission = {
    id: `perm-${Date.now()}`,
    templateId,
    userId,
    assignedBy,
    assignedAt: new Date().toISOString()
  };

  mockTemplatePermissions.push(newPermission);

  // Add audit log entry
  const currentUser = getCurrentUser();
  const template = getTemplateById(templateId);
  const user = mockUsers.find(u => u.id === userId);

  if (template && user) {
    addAuditLogEntry(
      'create',
      'permission',
      `${template.name} - ${user.name}`,
      newPermission.id,
      `Assigned "${user.name}" access to template "${template.name}"`,
      currentUser.id,
      currentUser.username
    );
  }

  return newPermission;
};

export const removeTemplatePermission = (templateId: string, userId: string): boolean => {
  const index = mockTemplatePermissions.findIndex(
    perm => perm.templateId === templateId && perm.userId === userId
  );

  if (index === -1) return false;

  const removedPermission = mockTemplatePermissions[index];
  mockTemplatePermissions.splice(index, 1);

  // Add audit log entry
  const currentUser = getCurrentUser();
  const template = getTemplateById(templateId);
  const user = mockUsers.find(u => u.id === userId);

  if (template && user) {
    addAuditLogEntry(
      'delete',
      'permission',
      `${template.name} - ${user.name}`,
      removedPermission.id,
      `Removed "${user.name}" access from template "${template.name}"`,
      currentUser.id,
      currentUser.username
    );
  }

  return true;
};

export const hasTemplateAccess = (templateId: string, userId: string): boolean => {
  // Admins have access to all templates
  const user = mockUsers.find(u => u.id === userId);
  if (user && user.role === 'admin') return true;

  return mockTemplatePermissions.some(
    perm => perm.templateId === templateId && perm.userId === userId
  );
};

// Initialize sample data if none exists
export const initializeSampleData = () => {
  // Only initialize if there's no data in localStorage
  const storedPlayers = loadFromStorage(STORAGE_KEYS.players, []);
  

  if (storedPlayers.length === 0) {
    // Create sample players
    const samplePlayers = [
      {
        id: 'player-1',
        name: 'John Smith',
        alias: 'Johnny S',
        notes: 'High-value target with known associates',
        createdAt: new Date().toISOString(),
        status: 'active' as const,
        phoneNumber: '+1-555-0123',
        houseAddress: '123 Main St, City, State 12345'
      },
      {
        id: 'player-2',
        name: 'Jane Doe',
        alias: 'JD',
        notes: 'Suspected money laundering operations',
        createdAt: new Date().toISOString(),
        status: 'active' as const,
        phoneNumber: '+1-555-0456',
        houseAddress: '456 Oak Ave, City, State 67890'
      }
    ];

    // Create sample assets
    const sampleAssets = [
      {
        id: 'asset-1',
        playerId: 'player-1',
        vehicleName: 'Mercedes-Benz S-Class',
        vehicleReg: 'ABC123',
        vehicleVin: 'WDD2228211A123456',
        vehicleColour: 'Black',
        vehicleValue: 95000,
        vehicleLocation: '123 Main St, City, State 12345',
        acquiredAt: '2023-01-15T10:00:00Z',
        notes: 'Luxury sedan, black color',
        createdAt: new Date().toISOString()
      },
      {
        id: 'asset-2',
        playerId: 'player-1',
        vehicleName: 'BMW X5',
        vehicleReg: 'XYZ789',
        vehicleVin: 'WBAJR9C52KB123456',
        vehicleColour: 'Silver',
        vehicleValue: 65000,
        vehicleLocation: '123 Main St, City, State 12345',
        acquiredAt: '2023-03-20T14:30:00Z',
        notes: 'SUV, silver color',
        createdAt: new Date().toISOString()
      },
      {
        id: 'asset-3',
        playerId: 'player-2',
        vehicleName: 'Audi A8',
        vehicleReg: 'DEF456',
        vehicleVin: 'WAUZZ4GF7JN123456',
        vehicleColour: 'White',
        vehicleValue: 85000,
        vehicleLocation: '456 Oak Ave, City, State 67890',
        acquiredAt: '2023-02-10T09:15:00Z',
        notes: 'Luxury sedan, white color',
        createdAt: new Date().toISOString()
      }
    ];

    // Save sample data to localStorage
    saveToStorage(STORAGE_KEYS.players, samplePlayers);
    saveToStorage(STORAGE_KEYS.assets, sampleAssets);

    // Update in-memory arrays
    mockPlayers.length = 0;
    mockPlayers.push(...samplePlayers);
    mockAssets.length = 0;
    mockAssets.push(...sampleAssets);

    // Update dashboard summary
    updateDashboardSummary();
  }
};

// User management functions
export const updateUser = (userId: string, updates: Partial<StaffMember>): boolean => {
  const userIndex = mockStaffMembers.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    mockStaffMembers[userIndex] = { ...mockStaffMembers[userIndex], ...updates };
    return true;
  }
  return false;
};

export const updateUserRole = (userId: string, role: 'admin' | 'marshall'): boolean => {
  return updateUser(userId, { role });
};

export const updateUserName = (userId: string, name: string): boolean => {
  return updateUser(userId, { name });
};