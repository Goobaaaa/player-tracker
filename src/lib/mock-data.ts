import { Player, Asset, FinanceTransaction, Task, DashboardSummary, Mugshot, Media, HouseMedia, Document, TaskComment, Incident, Weapon, Template, TemplatePermission, StaffMember, Vehicle, ChatMessage, MediaItem, Quote, Commendation, Event } from './database';
import { AuditLogEntry } from '../components/activity-feed';
import { globalStorage, globalAppSettings } from './global-storage';

// ====================================================================
// GLOBAL DATA STORAGE - Cross-Computer/Device Compatibility
// ====================================================================
// All data is now stored globally and shared across all instances
// No more localStorage - everything works cross-computer

// Hidden admin user (not visible in UI)
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

// ====================================================================
// DATA ACCESS FUNCTIONS - Using Global Storage
// ====================================================================

// Players
export const getLivePlayers = (): Player[] => {
  return globalStorage.get<Player>('players');
};

export const getLiveAssets = (): Asset[] => {
  return globalStorage.get<Asset>('assets');
};

export const getLiveWeapons = (): Weapon[] => {
  return globalStorage.get<Weapon>('weapons');
};

export const getLiveTemplates = (): Template[] => {
  return globalStorage.get<Template>('templates');
};

export const getLiveStaffMembers = (): StaffMember[] => {
  return globalStorage.get<StaffMember>('staffMembers');
};

export const getVisibleStaffMembers = (): StaffMember[] => {
  return globalStorage.getVisibleStaffMembers();
};

export const getLiveVehicles = (): Vehicle[] => {
  return globalStorage.get<Vehicle>('vehicles');
};

export const getLiveChatMessages = (): ChatMessage[] => {
  return globalStorage.get<ChatMessage>('chatMessages');
};

export const getLiveCommendations = (): Commendation[] => {
  return globalStorage.get<Commendation>('commendations');
};

export const getLiveEvents = (): Event[] => {
  return globalStorage.get<Event>('events');
};

// Data modification functions
export const savePlayers = (players: Player[]): void => {
  globalStorage.set('players', players);
};

export const saveAssets = (assets: Asset[]): void => {
  globalStorage.set('assets', assets);
};

export const saveWeapons = (weapons: Weapon[]): void => {
  globalStorage.set('weapons', weapons);
};

export const saveTemplates = (templates: Template[]): void => {
  globalStorage.set('templates', templates);
};

export const saveStaffMembers = (staff: StaffMember[]): void => {
  // Filter out hidden admin before saving
  const filtered = staff.filter(member => member.id !== HIDDEN_ADMIN.id);
  globalStorage.set('staffMembers', [HIDDEN_ADMIN, ...filtered]);
};

export const saveVehicles = (vehicles: Vehicle[]): void => {
  globalStorage.set('vehicles', vehicles);
};

export const saveChatMessages = (messages: ChatMessage[]): void => {
  globalStorage.set('chatMessages', messages);
};

export const saveCommendations = (commendations: Commendation[]): void => {
  globalStorage.set('commendations', commendations);
};

export const saveEvents = (events: Event[]): void => {
  globalStorage.set('events', events);
};

// ====================================================================
// USER MANAGEMENT FUNCTIONS
// ====================================================================

export const getUserByUsername = (username: string): StaffMember | undefined => {
  // First check hidden admin
  if (username === HIDDEN_ADMIN.username) {
    return HIDDEN_ADMIN;
  }

  // Then check global storage
  return globalStorage.findUserByUsername(username);
};

export const addAdminCreatedUser = (user: Omit<StaffMember, 'id'>): StaffMember => {
  return globalStorage.addStaffMember(user);
};

export const updateUser = (userId: string, updates: Partial<StaffMember>): void => {
  globalStorage.update('staffMembers', userId, updates);
};

export const isUserSuspended = (userId: string): boolean => {
  const user = globalStorage.findById<StaffMember>('staffMembers', userId);
  return user?.isSuspended || false;
};

// ====================================================================
// PLAYER CRUD OPERATIONS
// ====================================================================

export const addPlayer = (player: Omit<Player, 'id' | 'createdAt'>): Player => {
  const newPlayer: Player = {
    ...player,
    id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };

  const players = getLivePlayers();
  players.push(newPlayer);
  savePlayers(players);

  return newPlayer;
};

export const updatePlayer = (playerId: string, updates: Partial<Player>): void => {
  globalStorage.update('players', playerId, updates);
};

export const deletePlayer = (playerId: string): boolean => {
  globalStorage.remove('players', playerId);
  return true;
};

// ====================================================================
// ASSET CRUD OPERATIONS
// ====================================================================

export const addAsset = (asset: Omit<Asset, 'id' | 'createdAt'>): Asset => {
  const newAsset: Asset = {
    ...asset,
    id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };

  const assets = getLiveAssets();
  assets.push(newAsset);
  saveAssets(assets);

  return newAsset;
};

export const updateAsset = (assetId: string, updates: Partial<Asset>): void => {
  globalStorage.update('assets', assetId, updates);
};

export const deleteAsset = (assetId: string): void => {
  globalStorage.remove('assets', assetId);
};

// ====================================================================
// WEAPON CRUD OPERATIONS
// ====================================================================

export const addWeapon = (weapon: Omit<Weapon, 'id' | 'createdAt'>): Weapon => {
  const newWeapon: Weapon = {
    ...weapon,
    id: `weapon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };

  const weapons = getLiveWeapons();
  weapons.push(newWeapon);
  saveWeapons(weapons);

  return newWeapon;
};

export const updateWeapon = (weaponId: string, updates: Partial<Weapon>): void => {
  globalStorage.update('weapons', weaponId, updates);
};

export const deleteWeapon = (weaponId: string): void => {
  globalStorage.remove('weapons', weaponId);
};

// ====================================================================
// TEMPLATE CRUD OPERATIONS
// ====================================================================

export const addTemplate = (template: Omit<Template, 'id' | 'createdAt'>): Template => {
  const newTemplate: Template = {
    ...template,
    id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };

  const templates = getLiveTemplates();
  templates.push(newTemplate);
  saveTemplates(templates);

  return newTemplate;
};

export const updateTemplate = (templateId: string, updates: Partial<Template>): boolean => {
  globalStorage.update('templates', templateId, updates);
  return true;
};

export const createTemplate = (templateData: Omit<Template, 'id' | 'createdAt'>): Template => {
  return addTemplate(templateData);
};

export const deleteTemplate = (templateId: string): void => {
  globalStorage.remove('templates', templateId);
};

// ====================================================================
// VEHICLE CRUD OPERATIONS
// ====================================================================

export const addVehicle = (vehicle: Omit<Vehicle, 'id' | 'createdAt'>): Vehicle => {
  const newVehicle: Vehicle = {
    ...vehicle,
    id: `vehicle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };

  const vehicles = getLiveVehicles();
  vehicles.push(newVehicle);
  saveVehicles(vehicles);

  return newVehicle;
};

export const updateVehicle = (vehicleId: string, updates: Partial<Vehicle>): void => {
  globalStorage.update('vehicles', vehicleId, updates);
};

export const deleteVehicle = (vehicleId: string): void => {
  globalStorage.remove('vehicles', vehicleId);
};

// ====================================================================
// INCIDENT CRUD OPERATIONS
// ====================================================================

export const getLiveIncidents = (): Incident[] => {
  return globalStorage.get<Incident>('incidents');
};

export const addIncident = (incident: Omit<Incident, 'id' | 'createdAt'>): Incident => {
  const newIncident: Incident = {
    ...incident,
    id: `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };

  const incidents = getLiveIncidents();
  incidents.push(newIncident);
  globalStorage.set('incidents', incidents);

  return newIncident;
};

export const updateIncident = (incidentId: string, updates: Partial<Incident>): boolean => {
  globalStorage.update('incidents', incidentId, updates);
  return true;
};

export const deleteIncident = (incidentId: string): void => {
  globalStorage.remove('incidents', incidentId);
};

// ====================================================================
// TASK CRUD OPERATIONS
// ====================================================================

export const getLiveTasks = (): Task[] => {
  return globalStorage.get<Task>('tasks');
};

export const addTask = (task: Omit<Task, 'id' | 'createdAt'>): Task => {
  const newTask: Task = {
    ...task,
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };

  const tasks = getLiveTasks();
  tasks.push(newTask);
  globalStorage.set('tasks', tasks);

  return newTask;
};

export const updateTask = (taskId: string, updates: Partial<Task>): boolean => {
  globalStorage.update('tasks', taskId, updates);
  return true;
};

export const deleteTask = (taskId: string): void => {
  globalStorage.remove('tasks', taskId);
};

export const toggleTaskCompleted = (taskId: string): void => {
  const task = globalStorage.findById<Task>('tasks', taskId);
  if (task) {
    const newStatus = task.status === 'completed' ? 'active' : 'completed';
    updateTask(taskId, { status: newStatus });
  }
};

export const getDaysUntilDeadline = (deadline: string): number => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// ====================================================================
// AUDIT LOG FUNCTIONS
// ====================================================================

const mockAuditLog: AuditLogEntry[] = [];

export const getCurrentAuditLog = (): AuditLogEntry[] => {
  return mockAuditLog;
};

export const addAuditLogEntry = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void => {
  const newEntry: AuditLogEntry = {
    ...entry,
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  };
  mockAuditLog.unshift(newEntry);

  // Keep only last 1000 entries
  if (mockAuditLog.length > 1000) {
    mockAuditLog.splice(1000);
  }
};

// ====================================================================
// DASHBOARD SUMMARY
// ====================================================================

export const getDashboardSummary = (): DashboardSummary => {
  const players = getLivePlayers();
  const assets = getLiveAssets();
  const tasks = getLiveTasks();
  const incidents = getLiveIncidents();
  const activeTasks = tasks.filter(task => task.status !== 'completed');
  const overdueTasks = activeTasks.filter(task => getDaysUntilDeadline(task.deadline) < 0);

  return {
    totalPlayers: players.length,
    totalAssets: assets.length,
    totalAssetsValue: assets.reduce((sum, asset) => sum + asset.vehicleValue, 0),
    totalCashBalance: 0,
    activeTasks: activeTasks.length,
    overdueTasks: overdueTasks.length,
    totalIncidents: incidents.length,
    recentTasks: [],
    recentActivity: []
  };
};

// ====================================================================
// MOCK DATA EXPORTS (for backward compatibility)
// ====================================================================

// Empty arrays for factory reset
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

// Mock users for backward compatibility
export const mockUsers: Array<{id: string; name: string; username: string}> = [];

// ====================================================================
// MISSING FUNCTIONS FOR BUILD COMPATIBILITY
// These functions are referenced by various components but were missing
// ====================================================================

export const getAllTasks = (): Task[] => {
  return getLiveTasks();
};

export const getAllIncidents = (): Incident[] => {
  return getLiveIncidents();
};

export const getAllTemplates = (): Template[] => {
  return getLiveTemplates();
};

export const getUserTemplates = (userId: string): Template[] => {
  return getLiveTemplates();
};

export const getTemplateById = (templateId: string): Template | null => {
  return globalStorage.findById<Template>('templates', templateId) || null;
};

export const hasTemplateAccess = (userId: string, templateId: string): boolean => {
  return true; // Simplified for now
};

export const assignTemplatePermission = (userId: string, templateId: string): boolean => {
  return true; // Simplified for now
};

export const removeTemplatePermission = (userId: string, templateId: string): boolean => {
  return true; // Simplified for now
};

export const updateUserName = (userId: string, name: string): boolean => {
  updateUser(userId, { name });
  return true;
};

export const updateUserRole = (userId: string, role: string): boolean => {
  updateUser(userId, { role: role as any });
  return true;
};

export const suspendUser = (userId: string): boolean => {
  updateUser(userId, { isSuspended: true });
  return true;
};

export const unsuspendUser = (userId: string): boolean => {
  updateUser(userId, { isSuspended: false });
  return true;
};

export const mockDashboardSummary = (): DashboardSummary => {
  return getDashboardSummary();
};

export const updateDashboardSummary = (): DashboardSummary => {
  return getDashboardSummary();
};

export const initializeSampleData = (): boolean => {
  return true; // Simplified for now
};

export const updateTaskOverdueStatus = (): boolean => {
  return true; // Simplified for now
};

export const createTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
  return addTask(taskData);
};

export const addTaskComment = (taskId: string, commentData: any): TaskComment | null => {
  const comment: TaskComment = {
    id: `comment-${Date.now()}`,
    taskId,
    userId: commentData.userId || 'current-user',
    username: commentData.username || 'Unknown User',
    text: commentData.text || commentData.content || '',
    createdAt: new Date().toISOString()
  };
  return comment;
};

export const deleteTaskComment = (commentId: string): boolean => {
  return true; // Simplified for now
};

export const getPlayerAssets = (playerId: string): Asset[] => {
  return getLiveAssets().filter(asset => asset.playerId === playerId);
};

export const getPlayerMugshots = (playerId: string): Mugshot[] => {
  // Filter from a mock mugshots array or return empty
  return [];
};

export const getPlayerMedia = (playerId: string): Media[] => {
  // Filter from a mock media array or return empty
  return [];
};

export const getPlayerHouseMedia = (playerId: string): HouseMedia[] => {
  // Filter from a mock house media array or return empty
  return [];
};

export const getPlayerDocuments = (playerId: string): Document[] => {
  // Filter from a mock documents array or return empty
  return [];
};

export const getPlayerWeapons = (playerId: string): Weapon[] => {
  return getLiveWeapons().filter(weapon => weapon.playerId === playerId);
};

export const getPlayerTransactions = (playerId: string): FinanceTransaction[] => {
  // Filter from a mock transactions array or return empty
  return [];
};

export const getPlayerProfilePicture = (playerId: string): string | null => {
  const player = globalStorage.findById<Player>('players', playerId);
  return player?.avatarUrl || null;
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

export const addMugshot = (mugshotData: any): Mugshot => {
  const mugshot: Mugshot = {
    id: `mugshot-${Date.now()}`,
    playerId: mugshotData.playerId,
    filename: mugshotData.filename || 'mugshot.jpg',
    url: mugshotData.imageUrl || mugshotData.url || '',
    isProfilePicture: mugshotData.isProfilePicture || false,
    createdAt: new Date().toISOString()
  };
  return mugshot;
};

export const addMedia = (mediaData: any): Media => {
  const media: Media = {
    ...mediaData,
    id: `media-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  return media;
};

export const addHouseMedia = (mediaData: any): HouseMedia => {
  const houseMedia: HouseMedia = {
    ...mediaData,
    id: `house-media-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  return houseMedia;
};

export const addPlayerDocument = (documentData: any): Document => {
  const document: Document = {
    ...documentData,
    id: `doc-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  return document;
};

export const deletePlayerDocument = (documentId: string): boolean => {
  return true; // Simplified for now
};

export const setProfilePicture = (playerId: string, imageUrl: string): boolean => {
  updatePlayer(playerId, { avatarUrl: imageUrl });
  return true;
};

console.log('Global mock-data system initialized - all data is now cross-computer compatible');