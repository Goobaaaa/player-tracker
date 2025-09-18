import { Player, Asset, FinanceTransaction, Task, DashboardSummary, Mugshot, Media, HouseMedia, Document, TaskComment, Incident, Weapon } from './database';
import { AuditLogEntry } from '../components/activity-feed';

// Mock players data - made mutable for editing
export const mockPlayers: Player[] = [];

// Mock assets data
export const mockAssets: Asset[] = [];

// Mock weapons data
export const mockWeapons: Weapon[] = [];

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
    notes
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
  tasks: 'playerTracker_tasks',
  taskComments: 'playerTracker_taskComments',
  auditLog: 'playerTracker_auditLog',
  incidents: 'playerTracker_incidents'
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
  entityType: 'suspect' | 'task' | 'document' | 'asset' | 'media' | 'comment' | 'incident',
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
  createdBy: string
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
    comments: []
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

export const updateTaskStatus = (taskId: string, status: 'active' | 'completed' | 'overdue'): boolean => {
  const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    const task = mockTasks[taskIndex];
    const oldStatus = task.status;
    mockTasks[taskIndex].status = status;
    saveToStorage(STORAGE_KEYS.tasks, mockTasks); // Save to localStorage

    // Add audit log entry
    const currentUser = getCurrentUser();
    addAuditLogEntry(
      'update',
      'task',
      task.name,
      task.id,
      `Updated task status from ${oldStatus} to ${status}`,
      currentUser.id,
      currentUser.username
    );

    return true;
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
  { id: '1', name: 'Admin User', username: 'admin' },
  { id: '2', name: 'John Doe', username: 'johndoe' },
  { id: '3', name: 'Jane Smith', username: 'janesmith' },
  { id: '4', name: 'Mike Johnson', username: 'mikej' },
  { id: '5', name: 'Sarah Wilson', username: 'swilson' }
];