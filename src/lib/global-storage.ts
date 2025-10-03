// ====================================================================
// GLOBAL DATA STORAGE - Cross-Computer/Device Compatibility
// ====================================================================
// This replaces localStorage with global arrays that work across all instances

import {
  Player, Asset, Weapon, Template, TemplatePermission, StaffMember, Vehicle,
  ChatMessage, MediaItem, Quote, Commendation, Event, FinanceTransaction,
  Mugshot, Media, HouseMedia, Document, TaskComment, Incident, Task
} from './database';

// Global data storage - accessible across all computers/devices
// These arrays are shared globally and persist in code, not localStorage

// Pre-defined global data (shared across all instances)
const GLOBAL_DATA = {
  // Staff members (includes admin-created users that work cross-computer)
  staffMembers: [
    // Hidden admin
    {
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
    },
    // Pre-defined kthorn user
    {
      id: 'staff-admin-kthorn',
      name: 'K Thorn',
      username: 'kthorn',
      password: 'password',
      role: 'marshall' as const,
      tagLine: 'Staff Member',
      description: 'Admin-created staff member',
      bloodType: 'O+',
      favouriteHobby: 'Law Enforcement',
      portraitUrl: '',
      isSuspended: false,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    }
  ],

  // All other data types (empty for factory reset)
  players: [] as Player[],
  assets: [] as Asset[],
  weapons: [] as Weapon[],
  templates: [] as Template[],
  templatePermissions: [] as TemplatePermission[],
  vehicles: [] as Vehicle[],
  chatMessages: [] as ChatMessage[],
  mediaItems: [] as MediaItem[],
  quotes: [] as Quote[],
  commendations: [] as Commendation[],
  events: [] as Event[],
  transactions: [] as FinanceTransaction[],
  mugshots: [] as Mugshot[],
  media: [] as Media[],
  houseMedia: [] as HouseMedia[],
  playerDocuments: [] as Document[],
  documents: [] as Document[],
  incidents: [] as Incident[],
  tasks: [] as Task[],
  taskComments: [] as TaskComment[]
};

// Global storage functions
export const globalStorage = {
  // Get data from global storage
  get<T>(key: keyof typeof GLOBAL_DATA): T[] {
    return GLOBAL_DATA[key] as T[];
  },

  // Set data in global storage
  set<T>(key: keyof typeof GLOBAL_DATA, data: T[]): void {
    (GLOBAL_DATA as any)[key] = data;
  },

  // Add item to global storage
  add<T extends { id: string }>(key: keyof typeof GLOBAL_DATA, item: T): void {
    const currentData = globalStorage.get<T>(key);
    currentData.push(item);
  },

  // Remove item from global storage by id
  remove<T extends { id: string }>(key: keyof typeof GLOBAL_DATA, id: string): void {
    const currentData = globalStorage.get<T>(key);
    const index = currentData.findIndex(item => item.id === id);
    if (index > -1) {
      currentData.splice(index, 1);
    }
  },

  // Find item by id
  findById<T extends { id: string }>(key: keyof typeof GLOBAL_DATA, id: string): T | undefined {
    const currentData = globalStorage.get<T>(key);
    return currentData.find(item => item.id === id);
  },

  // Update item by id
  update<T extends { id: string }>(key: keyof typeof GLOBAL_DATA, id: string, updates: Partial<T>): void {
    const currentData = globalStorage.get<T>(key);
    const index = currentData.findIndex(item => item.id === id);
    if (index > -1) {
      currentData[index] = { ...currentData[index], ...updates };
    }
  },

  // Clear all data from a specific key
  clear(key: keyof typeof GLOBAL_DATA): void {
    globalStorage.set(key, [] as any);
  },

  // Get staff members (excluding hidden admin for UI purposes)
  getVisibleStaffMembers(): StaffMember[] {
    return GLOBAL_DATA.staffMembers.filter(member => member.id !== 'admin-superuser-hidden');
  },

  // Add staff member (admin creation)
  addStaffMember(member: Omit<StaffMember, 'id'>): StaffMember {
    const newMember: StaffMember = {
      ...member,
      id: `staff-global-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    (GLOBAL_DATA.staffMembers as StaffMember[]).push(newMember);
    return newMember;
  },

  // Find user by username
  findUserByUsername(username: string): StaffMember | undefined {
    return GLOBAL_DATA.staffMembers.find(user => user.username === username);
  }
};

// App settings storage (global, not localStorage)
interface GlobalAppSettings {
  appName: string;
  appLogo: string;
  theme: 'dark' | 'light';
  sessionTimeout: number;
  getSetting(key: keyof GlobalAppSettings): any;
  setSetting(key: keyof GlobalAppSettings, value: any): void;
}

export const globalAppSettings: GlobalAppSettings = {
  appName: 'USMS Player Tracker',
  appLogo: '',
  theme: 'dark',
  sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours

  getSetting(key: keyof GlobalAppSettings): any {
    return globalAppSettings[key];
  },

  setSetting(key: keyof GlobalAppSettings, value: any): void {
    (globalAppSettings as any)[key] = value;
  }
};

// Export global data getters for easy access
export const getGlobalPlayers = () => globalStorage.get<Player>('players');
export const getGlobalAssets = () => globalStorage.get<Asset>('assets');
export const getGlobalWeapons = () => globalStorage.get<Weapon>('weapons');
export const getGlobalStaffMembers = () => globalStorage.get<StaffMember>('staffMembers');
export const getGlobalVehicles = () => globalStorage.get<Vehicle>('vehicles');
export const getGlobalIncidents = () => globalStorage.get<Incident>('incidents');
export const getGlobalTasks = () => globalStorage.get<Task>('tasks');
export const getGlobalTemplates = () => globalStorage.get<Template>('templates');
export const getGlobalChatMessages = () => globalStorage.get<ChatMessage>('chatMessages');

console.log('Global storage initialized - data is now shared across all computers and devices');