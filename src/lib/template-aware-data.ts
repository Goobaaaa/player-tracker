import { Player, Asset, Task, DashboardSummary, Document, Incident, Weapon, Template, TemplatePermission, StaffMember, Vehicle } from './database';
import { AuditLogEntry } from '../components/activity-feed';
import { templateDataManager } from './template-data';
import { getLiveTemplates, getLiveStaffMembers, saveTemplates, saveStaffMembers, mockTemplatePermissions } from './mock-data';

// Template-aware data access functions
export function getTemplatePlayers(templateId: string): Player[] {
  return templateDataManager.getPlayers(templateId);
}

export function getTemplateAssets(templateId: string): Asset[] {
  return templateDataManager.getAssets(templateId);
}

export function getTemplateTasks(templateId: string): Task[] {
  return templateDataManager.getTasks(templateId);
}

export function getTemplateIncidents(templateId: string): Incident[] {
  return templateDataManager.getIncidents(templateId);
}

export function getTemplateDocuments(templateId: string): Document[] {
  return templateDataManager.getDocuments(templateId);
}

export function getTemplateWeapons(templateId: string): Weapon[] {
  return templateDataManager.getWeapons(templateId);
}

export function getTemplateVehicles(templateId: string): Vehicle[] {
  return templateDataManager.getVehicles(templateId);
}

// Template-aware data creation functions
export function createTemplatePlayer(templateId: string, playerData: Omit<Player, 'id' | 'createdAt'>): Player | null {
  const player: Player = {
    ...playerData,
    id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };

  const success = templateDataManager.addPlayer(templateId, player);
  return success ? player : null;
}

export function createTemplateAsset(templateId: string, assetData: Omit<Asset, 'id' | 'acquiredAt'>): Asset | null {
  const asset: Asset = {
    ...assetData,
    id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    acquiredAt: new Date().toISOString()
  };

  const success = templateDataManager.addAsset(templateId, asset);
  return success ? asset : null;
}

export function createTemplateTask(templateId: string, taskData: Omit<Task, 'id' | 'createdAt' | 'comments'>): Task | null {
  const task: Task = {
    ...taskData,
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    comments: []
  };

  const success = templateDataManager.addTask(templateId, task);
  return success ? task : null;
}

export function createTemplateIncident(templateId: string, incidentData: Omit<Incident, 'id' | 'createdAt'>): Incident | null {
  const incident: Incident = {
    ...incidentData,
    id: `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };

  const success = templateDataManager.addIncident(templateId, incident);
  return success ? incident : null;
}

export function createTemplateDocument(templateId: string, documentData: Omit<Document, 'id' | 'createdAt'>): Document | null {
  const document: Document = {
    ...documentData,
    id: `document-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };

  const success = templateDataManager.addDocument(templateId, document);
  return success ? document : null;
}

export function createTemplateWeapon(templateId: string, weaponData: Omit<Weapon, 'id' | 'createdAt'>): Weapon | null {
  const weapon: Weapon = {
    ...weaponData,
    id: `weapon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };

  const success = templateDataManager.addWeapon(templateId, weapon);
  return success ? weapon : null;
}

export function createTemplateVehicle(templateId: string, vehicleData: Omit<Vehicle, 'id' | 'createdAt'>): Vehicle | null {
  const vehicle: Vehicle = {
    ...vehicleData,
    id: `vehicle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };

  const success = templateDataManager.addVehicle(templateId, vehicle);
  return success ? vehicle : null;
}

// Template creation and management
export function createNewTemplate(templateData: Omit<Template, 'id' | 'createdAt'>): Template {
  const template: Template = {
    ...templateData,
    id: `template-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  // Add to templates list (this would normally go to a database)
  const templates = getLiveTemplates();
  templates.push(template);
  saveTemplates(templates);

  // Create isolated data container for this template
  templateDataManager.createTemplate(template.id);

  return template;
}

export function getTemplateById(templateId: string): Template | null {
  const templates = getLiveTemplates();
  return templates.find(t => t.id === templateId) || null;
}

export function getTemplatesForUser(userId: string): Template[] {
  const userPermissions = mockTemplatePermissions.filter(p => p.userId === userId);
  const userTemplateIds = userPermissions.map(p => p.templateId);
  const templates = getLiveTemplates();
  return templates.filter(t => userTemplateIds.includes(t.id));
}

export function hasTemplateAccess(templateId: string, userId: string): boolean {
  return mockTemplatePermissions.some(p => p.templateId === templateId && p.userId === userId);
}

// Template-specific audit log
export function getTemplateAuditLog(templateId: string): AuditLogEntry[] {
  const data = templateDataManager.getTemplateData(templateId);
  if (!data) return [];

  // For now, return empty audit log for templates
  // In a real implementation, you would have template-specific audit events
  return [];
}

// Template dashboard summary
export function getTemplateDashboardSummary(templateId: string): DashboardSummary {
  const players = getTemplatePlayers(templateId);
  const assets = getTemplateAssets(templateId);
  const tasks = getTemplateTasks(templateId);

  const totalAssetsValue = assets.reduce((sum, asset) => sum + asset.vehicleValue, 0);

  return {
    totalPlayers: players.length,
    totalAssetsValue,
    totalCashBalance: 0, // This would be calculated from finance transactions
    recentTasks: tasks.slice(0, 5), // Get 5 most recent tasks
    recentActivity: [] // Empty for new templates
  };
}

// Template initialization (for creating a completely new, blank template)
export function initializeBlankTemplate(templateId: string): boolean {
  try {
    // Create the template data container if it doesn't exist
    if (!templateDataManager.getTemplateData(templateId)) {
      templateDataManager.createTemplate(templateId);
    }

    // Clear any existing data to ensure it's completely blank
    templateDataManager.clearTemplateData(templateId);

    return true;
  } catch (error) {
    console.error('Failed to initialize blank template:', error);
    return false;
  }
}

// Check if a template is empty (no data)
export function isTemplateEmpty(templateId: string): boolean {
  const data = templateDataManager.getTemplateData(templateId);
  if (!data) return true;

  return (
    data.players.length === 0 &&
    data.assets.length === 0 &&
    data.weapons.length === 0 &&
    data.vehicles.length === 0 &&
    data.tasks.length === 0 &&
    data.incidents.length === 0 &&
    data.documents.length === 0
  );
}

// Global data access functions (for non-template-specific pages)
export function getAllTemplates(): Template[] {
  return getLiveTemplates();
}

export function getAllStaffMembers(): StaffMember[] {
  return getLiveStaffMembers();
}

export function getAllTemplatePermissions(): TemplatePermission[] {
  return mockTemplatePermissions;
}

// Export and import functions for template data backup/restore
export function exportTemplateData(templateId: string): string | null {
  return templateDataManager.exportTemplateData(templateId);
}

export function importTemplateData(templateId: string, jsonData: string): boolean {
  return templateDataManager.importTemplateData(templateId, jsonData);
}