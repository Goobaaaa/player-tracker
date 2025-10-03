import { Player, Asset, FinanceTransaction, Task, DashboardSummary, Mugshot, Media, HouseMedia, Document, TaskComment, Incident, Weapon, Template, TemplatePermission, StaffMember, Vehicle, ChatMessage, MediaItem, Quote, Commendation, Event } from './database';
import { AuditLogEntry } from '../components/activity-feed';

// ====================================================================
// LIVE DATA STORAGE - Factory Reset
// ====================================================================
// All data arrays are now empty and ready for user population
// This represents a clean, production-ready environment

// Core data storage - all empty for factory reset
export const mockPlayers: Player[] = [];
export const mockAssets: Asset[] = [];
export const mockWeapons: Weapon[] = [];
export const mockTemplates: Template[] = [];
export const mockTemplatePermissions: TemplatePermission[] = [];
export const mockStaffMembers: StaffMember[] = [];
export const mockVehicles: Vehicle[] = [];
export const mockChatMessages: ChatMessage[] = [];
export const mockMediaItems: MediaItem[] = [];
export const mockQuotes: Quote[] = [];
export const mockCommendations: Commendation[] = [];
export const mockEvents: Event[] = [];
export const mockTransactions: FinanceTransaction[] = [];
export const mockMugshots: Mugshot[] = [];
export const mockMedia: Media[] = [];
export const mockHouseMedia: HouseMedia[] = [];
export const mockPlayerDocuments: Document[] = [];
export const mockDocuments: Document[] = [];

// ====================================================================
// HIDDEN SUPERUSER ADMIN ACCOUNT
// ====================================================================
// This account is hidden from user management and serves as the system admin
export const HIDDEN_ADMIN = {
  id: 'admin-superuser-hidden',
  name: 'System Administrator',
  username: 'admin',
  password: 'admin',
  role: 'admin' as const,
  tagLine: 'System Administrator',
  description: 'Hidden superuser account for system administration',
  bloodType: 'O+',
  favouriteHobby: 'System Administration',
  portraitUrl: '/media/USMSBadge.png',
  isSuspended: false,
  createdAt: new Date().toISOString(),
  createdBy: 'system'
};

// Mock users for task assignment (excludes hidden admin)
// Empty for factory reset - no pre-existing users
export const mockUsers: Array<{id: string; name: string; username: string}> = [];

// ====================================================================
// PERSISTENT DATA STORAGE FUNCTIONS
// ====================================================================
// Enhanced functions for live data persistence

// LocalStorage keys for persistence
const STORAGE_KEYS = {
  PLAYERS: 'player_tracker_players',
  ASSETS: 'player_tracker_assets',
  WEAPONS: 'player_tracker_weapons',
  TEMPLATES: 'player_tracker_templates',
  TEMPLATE_PERMISSIONS: 'player_tracker_template_permissions',
  STAFF_MEMBERS: 'player_tracker_staff_members',
  VEHICLES: 'player_tracker_vehicles',
  CHAT_MESSAGES: 'player_tracker_chat_messages',
  MEDIA_ITEMS: 'player_tracker_media_items',
  QUOTES: 'player_tracker_quotes',
  COMMENDATIONS: 'player_tracker_commendations',
  EVENTS: 'player_tracker_events',
  TRANSACTIONS: 'player_tracker_transactions',
  MUGSHOTS: 'player_tracker_mugshots',
  MEDIA: 'player_tracker_media',
  HOUSE_MEDIA: 'player_tracker_house_media',
  PLAYER_DOCUMENTS: 'player_tracker_player_documents',
  DOCUMENTS: 'player_tracker_documents'
} as const;

// Initialize data from localStorage or use empty arrays
const initializeFromStorage = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn(`Error loading ${key} from localStorage:`, error);
    return [];
  }
};

// Save data to localStorage
const saveToStorage = <T>(key: string, data: T[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// ====================================================================
// LIVE DATA ACCESSORS - With Persistence
// ====================================================================

export const getLivePlayers = (): Player[] => {
  const stored = initializeFromStorage<Player>(STORAGE_KEYS.PLAYERS);
  mockPlayers.length = 0; // Clear current array
  mockPlayers.push(...stored);
  return mockPlayers;
};

export const getLiveAssets = (): Asset[] => {
  const stored = initializeFromStorage<Asset>(STORAGE_KEYS.ASSETS);
  mockAssets.length = 0;
  mockAssets.push(...stored);
  return mockAssets;
};

export const getLiveWeapons = (): Weapon[] => {
  const stored = initializeFromStorage<Weapon>(STORAGE_KEYS.WEAPONS);
  mockWeapons.length = 0;
  mockWeapons.push(...stored);
  return mockWeapons;
};

export const getLiveTemplates = (): Template[] => {
  const stored = initializeFromStorage<Template>(STORAGE_KEYS.TEMPLATES);
  mockTemplates.length = 0;
  mockTemplates.push(...stored);
  return mockTemplates;
};

export const getLiveStaffMembers = (): StaffMember[] => {
  // Always include hidden admin and load from localStorage
  const stored = initializeFromStorage<StaffMember>(STORAGE_KEYS.STAFF_MEMBERS);
  mockStaffMembers.length = 0;
  mockStaffMembers.push(HIDDEN_ADMIN, ...stored);
  return mockStaffMembers;
};

export const getVisibleStaffMembers = (): StaffMember[] => {
  // Return only non-hidden staff members
  const stored = initializeFromStorage<StaffMember>(STORAGE_KEYS.STAFF_MEMBERS);
  return stored; // Excludes hidden admin
};

export const getLiveVehicles = (): Vehicle[] => {
  const stored = initializeFromStorage<Vehicle>(STORAGE_KEYS.VEHICLES);
  mockVehicles.length = 0;
  mockVehicles.push(...stored);
  return mockVehicles;
};

export const getLiveChatMessages = (): ChatMessage[] => {
  const stored = initializeFromStorage<ChatMessage>(STORAGE_KEYS.CHAT_MESSAGES);
  mockChatMessages.length = 0;
  mockChatMessages.push(...stored);
  return mockChatMessages;
};

export const getLiveCommendations = (): Commendation[] => {
  const stored = initializeFromStorage<Commendation>(STORAGE_KEYS.COMMENDATIONS);
  mockCommendations.length = 0;
  mockCommendations.push(...stored);
  return mockCommendations;
};

export const getLiveEvents = (): Event[] => {
  const stored = initializeFromStorage<Event>(STORAGE_KEYS.EVENTS);
  mockEvents.length = 0;
  mockEvents.push(...stored);
  return mockEvents;
};

// ====================================================================
// PERSISTENT DATA MODIFICATION FUNCTIONS
// ====================================================================

export const savePlayers = (players: Player[]): void => {
  saveToStorage(STORAGE_KEYS.PLAYERS, players);
};

export const saveAssets = (assets: Asset[]): void => {
  saveToStorage(STORAGE_KEYS.ASSETS, assets);
};

export const saveWeapons = (weapons: Weapon[]): void => {
  saveToStorage(STORAGE_KEYS.WEAPONS, weapons);
};

export const saveTemplates = (templates: Template[]): void => {
  saveToStorage(STORAGE_KEYS.TEMPLATES, templates);
};

export const saveStaffMembers = (staff: StaffMember[]): void => {
  // Filter out hidden admin before saving
  const filtered = staff.filter(member => member.id !== HIDDEN_ADMIN.id);
  saveToStorage(STORAGE_KEYS.STAFF_MEMBERS, filtered);
};

export const saveVehicles = (vehicles: Vehicle[]): void => {
  saveToStorage(STORAGE_KEYS.VEHICLES, vehicles);
};

export const saveChatMessages = (messages: ChatMessage[]): void => {
  saveToStorage(STORAGE_KEYS.CHAT_MESSAGES, messages);
};

export const saveCommendations = (commendations: Commendation[]): void => {
  saveToStorage(STORAGE_KEYS.COMMENDATIONS, commendations);
};

export const saveEvents = (events: Event[]): void => {
  saveToStorage(STORAGE_KEYS.EVENTS, events);
};

// ====================================================================
// AUTHENTICATION WITH HIDDEN ADMIN
// ====================================================================

export const authenticateUser = (username: string, password: string) => {
  // Check hidden admin first
  if (username === HIDDEN_ADMIN.username && password === HIDDEN_ADMIN.password) {
    return {
      user: HIDDEN_ADMIN,
      session: 'admin-session-' + Date.now(),
      isAdminHidden: true
    };
  }

  // Check regular staff members
  const user = mockStaffMembers.find(member =>
    member.username === username && member.password === password
  );

  if (user) {
    return {
      user,
      session: 'session-' + Date.now(),
      isAdminHidden: false
    };
  }

  return null;
};

// ====================================================================
// USER MANAGEMENT (HIDDEN ADMIN FILTERING)
// ====================================================================

export const isHiddenAdmin = (user: StaffMember): boolean => {
  return user.id === HIDDEN_ADMIN.id;
};

// ====================================================================
// TEMPLATE SYSTEM
// ====================================================================

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

  const templates = getLiveTemplates();
  templates.push(newTemplate);
  saveTemplates(templates);

  return newTemplate;
};

export const updateTemplate = (templateId: string, updates: Partial<Template>): boolean => {
  const templates = getLiveTemplates();
  const templateIndex = templates.findIndex(t => t.id === templateId);

  if (templateIndex > -1) {
    templates[templateIndex] = { ...templates[templateIndex], ...updates };
    saveTemplates(templates);
    return true;
  }

  return false;
};

export const deleteTemplate = (templateId: string): boolean => {
  const templates = getLiveTemplates();
  const filteredTemplates = templates.filter(t => t.id !== templateId);

  if (filteredTemplates.length < templates.length) {
    saveTemplates(filteredTemplates);

    // Also delete related permissions
    const permissions = mockTemplatePermissions.filter(p => p.templateId !== templateId);
    mockTemplatePermissions.length = 0;
    mockTemplatePermissions.push(...permissions);
    saveToStorage(STORAGE_KEYS.TEMPLATE_PERMISSIONS, permissions);

    return true;
  }

  return false;
};

export const assignTemplatePermission = (templateId: string, userId: string, assignedBy: string): TemplatePermission => {
  const newPermission: TemplatePermission = {
    id: `perm-${Date.now()}`,
    templateId,
    userId,
    assignedBy,
    assignedAt: new Date().toISOString()
  };

  const permissions = initializeFromStorage<TemplatePermission>(STORAGE_KEYS.TEMPLATE_PERMISSIONS);
  permissions.push(newPermission);
  saveToStorage(STORAGE_KEYS.TEMPLATE_PERMISSIONS, permissions);
  mockTemplatePermissions.length = 0;
  mockTemplatePermissions.push(...permissions);

  return newPermission;
};

// ====================================================================
// DATA RESET FUNCTION
// ====================================================================

export const resetAllData = (): void => {
  if (typeof window === 'undefined') return;

  // Clear all localStorage data
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });

  // Reset all in-memory arrays
  mockPlayers.length = 0;
  mockAssets.length = 0;
  mockWeapons.length = 0;
  mockTemplates.length = 0;
  mockTemplatePermissions.length = 0;
  mockVehicles.length = 0;
  mockChatMessages.length = 0;
  mockMediaItems.length = 0;
  mockQuotes.length = 0;
  mockCommendations.length = 0;
  mockEvents.length = 0;
  mockTransactions.length = 0;
  mockMugshots.length = 0;
  mockMedia.length = 0;
  mockHouseMedia.length = 0;
  mockPlayerDocuments.length = 0;
  mockDocuments.length = 0;

  // Reset staff members but keep hidden admin
  mockStaffMembers.length = 0;
  mockStaffMembers.push(HIDDEN_ADMIN);
};

// ====================================================================
// LEGACY FUNCTIONS (Maintained for compatibility)
// ====================================================================

// Dashboard summary
export const mockDashboardSummary: DashboardSummary = {
  totalPlayers: mockPlayers.length,
  totalAssetsValue: mockAssets.reduce((sum, asset) => sum + asset.vehicleValue, 0),
  totalCashBalance: 0,
  recentTasks: [],
  recentActivity: []
};

// Update dashboard summary
export const updateDashboardSummary = (): void => {
  mockDashboardSummary.totalPlayers = mockPlayers.length;
  mockDashboardSummary.totalAssetsValue = mockAssets.reduce((sum, asset) => sum + asset.vehicleValue, 0);
  mockDashboardSummary.totalCashBalance = 0;
  mockDashboardSummary.recentTasks = [];
  mockDashboardSummary.recentActivity = [];
};

// Task management
export const getAllTasks = (): Task[] => [];
export const updateTaskOverdueStatus = (): void => {};

// Player functions
export const getPlayerAssets = (playerId: string): Asset[] => {
  return mockAssets.filter(asset => asset.playerId === playerId);
};

export const calculatePlayerAssetsValue = (playerId: string): number => {
  return getPlayerAssets(playerId).reduce((sum, asset) => sum + asset.vehicleValue, 0);
};

export const getPlayerProfilePicture = (playerId: string): string | null => {
  const player = mockPlayers.find(p => p.id === playerId);
  return player?.avatarUrl || null;
};

export const getPlayerMugshots = (playerId: string): Mugshot[] => {
  return mockMugshots.filter(mugshot => mugshot.playerId === playerId);
};

export const getPlayerMedia = (playerId: string): Media[] => {
  return mockMedia.filter(media => media.playerId === playerId);
};

export const getPlayerHouseMedia = (playerId: string): HouseMedia[] => {
  return mockHouseMedia.filter(media => media.playerId === playerId);
};

export const getPlayerDocuments = (playerId: string): Document[] => {
  return mockPlayerDocuments.filter(doc => doc.playerId === playerId);
};

export const getPlayerWeapons = (playerId: string): Weapon[] => {
  return mockWeapons.filter(weapon => weapon.playerId === playerId);
};

// Staff management functions
export const updateUser = (userId: string, updates: Partial<StaffMember>): boolean => {
  const userIndex = mockStaffMembers.findIndex(user => user.id === userId);
  if (userIndex > -1) {
    mockStaffMembers[userIndex] = { ...mockStaffMembers[userIndex], ...updates };
    saveStaffMembers(mockStaffMembers);
    return true;
  }
  return false;
};

export const suspendUser = (userId: string, suspendedBy: string): boolean => {
  return updateUser(userId, {
    isSuspended: true,
    suspendedAt: new Date().toISOString(),
    suspendedBy
  });
};

export const unsuspendUser = (userId: string): boolean => {
  return updateUser(userId, {
    isSuspended: false,
    suspendedAt: undefined,
    suspendedBy: undefined
  });
};

export const isUserSuspended = (userId: string): boolean => {
  const user = mockStaffMembers.find(u => u.id === userId);
  return user?.isSuspended || false;
};

// Pre-defined admin-created users for cross-computer authentication
const ADMIN_CREATED_USERS: StaffMember[] = [
  {
    id: 'staff-admin-kthorn',
    name: 'K Thorn',
    username: 'kthorn',
    password: 'password',
    role: 'marshall',
    tagLine: 'Staff Member',
    description: 'Admin-created staff member',
    bloodType: 'O+',
    favouriteHobby: 'Law Enforcement',
    portraitUrl: '',
    isSuspended: false,
    createdAt: new Date().toISOString(),
    createdBy: 'admin'
  }
  // Additional users can be added here for cross-computer access
  // Format: { id, name, username, password, role, tagLine, description, bloodType, favouriteHobby, portraitUrl, isSuspended, createdAt, createdBy }
];

export const getUserByUsername = (username: string): StaffMember | undefined => {
  // First check hidden admin
  if (username === HIDDEN_ADMIN.username) {
    return HIDDEN_ADMIN;
  }

  // Check pre-defined admin-created users (cross-compatible)
  const predefinedUser = ADMIN_CREATED_USERS.find(user => user.username === username);
  if (predefinedUser) {
    return predefinedUser;
  }

  // Check in-memory mockStaffMembers
  let user = mockStaffMembers.find(user => user.username === username);
  if (user) {
    return user;
  }

  // Check localStorage users (computer-specific)
  if (typeof window !== 'undefined') {
    try {
      const storedUsers = initializeFromStorage<StaffMember>(STORAGE_KEYS.STAFF_MEMBERS);
      user = storedUsers.find(u => u.username === username);
      if (user) {
        return user;
      }
    } catch (error) {
      console.warn('Error checking stored users for username:', username, error);
    }
  }

  return undefined;
};

// Function to add admin-created users for cross-computer access
export const addAdminCreatedUser = (user: Omit<StaffMember, 'id'>): StaffMember => {
  const newUser: StaffMember = {
    ...user,
    id: `staff-admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };

  // Add to ADMIN_CREATED_USERS array for cross-computer access
  ADMIN_CREATED_USERS.push(newUser);

  // Also save to localStorage for persistence
  if (typeof window !== 'undefined') {
    try {
      const existingUsers = initializeFromStorage<StaffMember>(STORAGE_KEYS.STAFF_MEMBERS);
      existingUsers.push(newUser);
      saveToStorage(STORAGE_KEYS.STAFF_MEMBERS, existingUsers);
    } catch (error) {
      console.error('Error saving admin-created user to localStorage:', error);
    }
  }

  return newUser;
};

// Player CRUD operations
export const addPlayer = (player: Omit<Player, 'id' | 'createdAt'>): Player => {
  const newPlayer: Player = {
    ...player,
    id: `player-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  const players = getLivePlayers();
  players.push(newPlayer);
  savePlayers(players);

  return newPlayer;
};

export const updatePlayer = (playerId: string, updates: Partial<Player>): boolean => {
  const players = getLivePlayers();
  const playerIndex = players.findIndex(player => player.id === playerId);

  if (playerIndex > -1) {
    players[playerIndex] = {
      ...players[playerIndex],
      ...updates
    };
    savePlayers(players);
    return true;
  }

  return false;
};

export const deletePlayer = (playerId: string): boolean => {
  const players = getLivePlayers();
  const filteredPlayers = players.filter(player => player.id !== playerId);

  if (filteredPlayers.length < players.length) {
    savePlayers(filteredPlayers);
    return true;
  }

  return false;
};

export const addMugshot = (mugshot: Omit<Mugshot, 'id' | 'createdAt'>): Mugshot => {
  const newMugshot: Mugshot = {
    ...mugshot,
    id: `mugshot-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  mockMugshots.push(newMugshot);
  saveToStorage(STORAGE_KEYS.MUGSHOTS, mockMugshots);

  return newMugshot;
};

export const addMedia = (media: Omit<Media, 'id' | 'createdAt'>): Media => {
  const newMedia: Media = {
    ...media,
    id: `media-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  mockMedia.push(newMedia);
  saveToStorage(STORAGE_KEYS.MEDIA, mockMedia);

  return newMedia;
};

export const addHouseMedia = (media: Omit<HouseMedia, 'id' | 'createdAt'>): HouseMedia => {
  const newMedia: HouseMedia = {
    ...media,
    id: `house-media-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  mockHouseMedia.push(newMedia);
  saveToStorage(STORAGE_KEYS.HOUSE_MEDIA, mockHouseMedia);

  return newMedia;
};

export const addPlayerDocument = (document: Omit<Document, 'id' | 'createdAt'>): Document => {
  const newDocument: Document = {
    ...document,
    id: `doc-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  mockPlayerDocuments.push(newDocument);
  saveToStorage(STORAGE_KEYS.PLAYER_DOCUMENTS, mockPlayerDocuments);

  return newDocument;
};

export const deletePlayerDocument = (documentId: string): boolean => {
  const index = mockPlayerDocuments.findIndex(doc => doc.id === documentId);
  if (index > -1) {
    mockPlayerDocuments.splice(index, 1);
    saveToStorage(STORAGE_KEYS.PLAYER_DOCUMENTS, mockPlayerDocuments);
    return true;
  }
  return false;
};

// Vehicle image functions - removed as Vehicle interface doesn't support additionalImages
// export const addVehicleImage = (vehicleId: string, imageUrl: string): void => {
//   const vehicle = mockVehicles.find(v => v.id === vehicleId);
//   if (vehicle) {
//     if (!vehicle.additionalImages) {
//       vehicle.additionalImages = [];
//     }
//     vehicle.additionalImages.push(imageUrl);
//     saveVehicles(mockVehicles);
//   }
// };

// export const removeVehicleImage = (vehicleId: string, imageUrl: string): void => {
//   const vehicle = mockVehicles.find(v => v.id === vehicleId);
//   if (vehicle && vehicle.additionalImages) {
//     vehicle.additionalImages = vehicle.additionalImages.filter(url => url !== imageUrl);
//     saveVehicles(mockVehicles);
//   }
// };

export const setProfilePicture = (playerId: string, mugshotId: string): void => {
  const player = mockPlayers.find(p => p.id === playerId);
  if (player) {
    const mugshot = mockMugshots.find(m => m.id === mugshotId);
    if (mugshot) {
      player.avatarUrl = mugshot.url;
      savePlayers(mockPlayers);
    }
  }
};

// Task management
export const getDaysUntilDeadline = (deadline: string): number => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const toggleTaskCompleted = (taskId: string): void => {
  // Task functionality not implemented in factory reset
};

// Audit log
export const getCurrentAuditLog = (): AuditLogEntry[] => {
  return []; // Clean audit log for factory reset
};

// Sample data initialization (empty for factory reset)
export const initializeSampleData = (): void => {
  // All data initialization removed for factory reset
  // Data will be populated by users through the interface
};

// Vehicle functions
export const addVehicle = (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'createdBy'>): Vehicle => {
  const newVehicle: Vehicle = {
    ...vehicle,
    id: `vehicle-${Date.now()}`,
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  };

  const vehicles = getLiveVehicles();
  vehicles.push(newVehicle);
  saveVehicles(vehicles);

  return newVehicle;
};

export const updateVehicle = (vehicleId: string, updates: Partial<Vehicle>): boolean => {
  const vehicles = getLiveVehicles();
  const vehicleIndex = vehicles.findIndex(vehicle => vehicle.id === vehicleId);

  if (vehicleIndex > -1) {
    vehicles[vehicleIndex] = { ...vehicles[vehicleIndex], ...updates };
    saveVehicles(vehicles);
    return true;
  }

  return false;
};

export const deleteVehicle = (vehicleId: string): boolean => {
  const vehicles = getLiveVehicles();
  const filteredVehicles = vehicles.filter(vehicle => vehicle.id !== vehicleId);

  if (filteredVehicles.length < vehicles.length) {
    saveVehicles(filteredVehicles);
    return true;
  }

  return false;
};

// ====================================================================
// MISSING LEGACY FUNCTIONS - Added for compatibility
// ====================================================================

// Template access function
export const hasTemplateAccess = (templateId: string, userId: string): boolean => {
  const permissions = initializeFromStorage<TemplatePermission>(STORAGE_KEYS.TEMPLATE_PERMISSIONS);
  return permissions.some(p => p.templateId === templateId && p.userId === userId);
};

// Template by ID function
export const getTemplateById = (templateId: string): Template | null => {
  const templates = getLiveTemplates();
  return templates.find(t => t.id === templateId) || null;
};

// Get all templates
export const getAllTemplates = (): Template[] => {
  return getLiveTemplates();
};

// Get user templates
export const getUserTemplates = (userId: string): Template[] => {
  const templates = getLiveTemplates();
  const userTemplateIds = mockTemplatePermissions
    .filter(p => p.userId === userId)
    .map(p => p.templateId);

  return templates.filter(t => userTemplateIds.includes(t.id));
};

// Incident management
export const mockIncidents: Incident[] = [];

export const getAllIncidents = (): Incident[] => {
  const stored = initializeFromStorage<Incident>('player_tracker_incidents');
  mockIncidents.length = 0;
  mockIncidents.push(...stored);
  return mockIncidents;
};

export const addIncident = (incident: Omit<Incident, 'id' | 'createdAt'>): Incident => {
  const newIncident: Incident = {
    ...incident,
    id: `incident-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  const incidents = getAllIncidents();
  incidents.push(newIncident);
  saveToStorage('player_tracker_incidents', incidents);

  return newIncident;
};

export const updateIncident = (incidentId: string, updates: Partial<Incident>): boolean => {
  const incidents = getAllIncidents();
  const incidentIndex = incidents.findIndex(incident => incident.id === incidentId);

  if (incidentIndex > -1) {
    incidents[incidentIndex] = {
      ...incidents[incidentIndex],
      ...updates
    };
    saveToStorage('player_tracker_incidents', incidents);
    return true;
  }

  return false;
};

export const deleteIncident = (incidentId: string): boolean => {
  const incidents = getAllIncidents();
  const filteredIncidents = incidents.filter(incident => incident.id !== incidentId);

  if (filteredIncidents.length < incidents.length) {
    saveToStorage('player_tracker_incidents', filteredIncidents);
    return true;
  }

  return false;
};

// Player transactions
export const getPlayerTransactions = (playerId: string): FinanceTransaction[] => {
  return mockTransactions.filter(transaction => transaction.playerId === playerId);
};

export const calculatePlayerBalance = (playerId: string): number => {
  const transactions = getPlayerTransactions(playerId);
  return transactions.reduce((balance, transaction) => {
    if (transaction.type === 'credit') {
      return balance + transaction.amount;
    } else {
      return balance - transaction.amount;
    }
  }, 0);
};

// Task management
export const mockTasks: Task[] = [];

export const createTask = (task: Omit<Task, 'id' | 'createdAt'>): Task => {
  const newTask: Task = {
    ...task,
    id: `task-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  const tasks = getAllTasks();
  tasks.push(newTask);
  saveToStorage('player_tracker_tasks', tasks);

  return newTask;
};

export const updateTask = (taskId: string, updates: Partial<Task>): boolean => {
  const tasks = getAllTasks();
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex > -1) {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates
    };
    saveToStorage('player_tracker_tasks', tasks);
    return true;
  }

  return false;
};

export const deleteTask = (taskId: string): boolean => {
  const tasks = getAllTasks();
  const filteredTasks = tasks.filter(task => task.id !== taskId);

  if (filteredTasks.length < tasks.length) {
    saveToStorage('player_tracker_tasks', filteredTasks);
    return true;
  }

  return false;
};

export const addTaskComment = (taskId: string, comment: Omit<TaskComment, 'id' | 'createdAt'>): TaskComment => {
  const newComment: TaskComment = {
    ...comment,
    id: `comment-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  const tasks = getAllTasks();
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex > -1) {
    if (!tasks[taskIndex].comments) {
      tasks[taskIndex].comments = [];
    }
    tasks[taskIndex].comments!.push(newComment);
    saveToStorage('player_tracker_tasks', tasks);
  }

  return newComment;
};

export const deleteTaskComment = (taskId: string, commentId: string): boolean => {
  const tasks = getAllTasks();
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex > -1 && tasks[taskIndex].comments) {
    const originalLength = tasks[taskIndex].comments!.length;
    tasks[taskIndex].comments = tasks[taskIndex].comments!.filter(
      comment => comment.id !== commentId
    );

    if (tasks[taskIndex].comments!.length < originalLength) {
      saveToStorage('player_tracker_tasks', tasks);
      return true;
    }
  }

  return false;
};

// Template permission removal
export const removeTemplatePermission = (templateId: string, userId: string): boolean => {
  const permissions = initializeFromStorage<TemplatePermission>(STORAGE_KEYS.TEMPLATE_PERMISSIONS);
  const filteredPermissions = permissions.filter(p => !(p.templateId === templateId && p.userId === userId));

  if (filteredPermissions.length < permissions.length) {
    saveToStorage(STORAGE_KEYS.TEMPLATE_PERMISSIONS, filteredPermissions);
    mockTemplatePermissions.length = 0;
    mockTemplatePermissions.push(...filteredPermissions);
    return true;
  }

  return false;
};

// User management functions
export const updateUserRole = (userId: string, role: 'admin' | 'marshall'): boolean => {
  return updateUser(userId, { role });
};

export const updateUserName = (userId: string, name: string): boolean => {
  return updateUser(userId, { name });
};

// Initialize live data on load
if (typeof window !== 'undefined') {
  getLivePlayers();
  getLiveAssets();
  getLiveWeapons();
  getLiveTemplates();
  getLiveStaffMembers();
  getLiveVehicles();
  getLiveChatMessages();
  getLiveCommendations();
  getLiveEvents();
  getAllTasks();
  getAllIncidents();
}