import { Player, Asset, FinanceTransaction, Task, Mugshot, Media, HouseMedia, Document, Incident, Weapon, Vehicle, ChatMessage, MediaItem, Quote, Commendation, Event } from './database';

export interface TemplateData {
  id: string;
  // Core data entities
  players: Player[];
  assets: Asset[];
  weapons: Weapon[];
  vehicles: Vehicle[];
  tasks: Task[];
  incidents: Incident[];
  documents: Document[];

  // Media and evidence
  mugshots: Mugshot[];
  playerMedia: Media[];
  houseMedia: HouseMedia[];

  // Communication and collaboration
  chatMessages: ChatMessage[];
  quotes: Quote[];
  commendations: Commendation[];
  events: Event[];

  // Metadata
  createdAt: string;
  lastModified: string;
  dataVersion: number;
}

export class TemplateDataManager {
  private static instance: TemplateDataManager;
  private templateData: Map<string, TemplateData> = new Map();

  private constructor() {
    this.initializeDefaultTemplates();
  }

  static getInstance(): TemplateDataManager {
    if (!TemplateDataManager.instance) {
      TemplateDataManager.instance = new TemplateDataManager();
    }
    return TemplateDataManager.instance;
  }

  private initializeDefaultTemplates() {
    // Only create the default template if it doesn't exist
    if (!this.templateData.has('template-1')) {
      this.templateData.set('template-1', {
        id: 'template-1',
        players: [],
        assets: [],
        weapons: [],
        vehicles: [],
        tasks: [],
        incidents: [],
        documents: [],
        mugshots: [],
        playerMedia: [],
        houseMedia: [],
        chatMessages: [],
        quotes: [],
        commendations: [],
        events: [],
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        dataVersion: 1
      });
    }
  }

  createTemplate(templateId: string): TemplateData {
    if (this.templateData.has(templateId)) {
      throw new Error(`Template with ID ${templateId} already exists`);
    }

    const newTemplateData: TemplateData = {
      id: templateId,
      players: [],
      assets: [],
      weapons: [],
      vehicles: [],
      tasks: [],
      incidents: [],
      documents: [],
      mugshots: [],
      playerMedia: [],
      houseMedia: [],
      chatMessages: [],
      quotes: [],
      commendations: [],
      events: [],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      dataVersion: 1
    };

    this.templateData.set(templateId, newTemplateData);
    return newTemplateData;
  }

  getTemplateData(templateId: string): TemplateData | null {
    return this.templateData.get(templateId) || null;
  }

  updateTemplateData(templateId: string, updates: Partial<TemplateData>): boolean {
    const existingData = this.templateData.get(templateId);
    if (!existingData) {
      return false;
    }

    const updatedData = {
      ...existingData,
      ...updates,
      lastModified: new Date().toISOString(),
      dataVersion: existingData.dataVersion + 1
    };

    this.templateData.set(templateId, updatedData);
    return true;
  }

  deleteTemplate(templateId: string): boolean {
    return this.templateData.delete(templateId);
  }

  getAllTemplateIds(): string[] {
    return Array.from(this.templateData.keys());
  }

  // Template-specific data access methods
  getPlayers(templateId: string): Player[] {
    const data = this.getTemplateData(templateId);
    return data ? data.players : [];
  }

  addPlayer(templateId: string, player: Player): boolean {
    const data = this.getTemplateData(templateId);
    if (!data) return false;

    data.players.push(player);
    data.lastModified = new Date().toISOString();
    return true;
  }

  getAssets(templateId: string): Asset[] {
    const data = this.getTemplateData(templateId);
    return data ? data.assets : [];
  }

  addAsset(templateId: string, asset: Asset): boolean {
    const data = this.getTemplateData(templateId);
    if (!data) return false;

    data.assets.push(asset);
    data.lastModified = new Date().toISOString();
    return true;
  }

  getTasks(templateId: string): Task[] {
    const data = this.getTemplateData(templateId);
    return data ? data.tasks : [];
  }

  addTask(templateId: string, task: Task): boolean {
    const data = this.getTemplateData(templateId);
    if (!data) return false;

    data.tasks.push(task);
    data.lastModified = new Date().toISOString();
    return true;
  }

  getIncidents(templateId: string): Incident[] {
    const data = this.getTemplateData(templateId);
    return data ? data.incidents : [];
  }

  addIncident(templateId: string, incident: Incident): boolean {
    const data = this.getTemplateData(templateId);
    if (!data) return false;

    data.incidents.push(incident);
    data.lastModified = new Date().toISOString();
    return true;
  }

  getDocuments(templateId: string): Document[] {
    const data = this.getTemplateData(templateId);
    return data ? data.documents : [];
  }

  addDocument(templateId: string, document: Document): boolean {
    const data = this.getTemplateData(templateId);
    if (!data) return false;

    data.documents.push(document);
    data.lastModified = new Date().toISOString();
    return true;
  }

  getWeapons(templateId: string): Weapon[] {
    const data = this.getTemplateData(templateId);
    return data ? data.weapons : [];
  }

  addWeapon(templateId: string, weapon: Weapon): boolean {
    const data = this.getTemplateData(templateId);
    if (!data) return false;

    data.weapons.push(weapon);
    data.lastModified = new Date().toISOString();
    return true;
  }

  getVehicles(templateId: string): Vehicle[] {
    const data = this.getTemplateData(templateId);
    return data ? data.vehicles : [];
  }

  addVehicle(templateId: string, vehicle: Vehicle): boolean {
    const data = this.getTemplateData(templateId);
    if (!data) return false;

    data.vehicles.push(vehicle);
    data.lastModified = new Date().toISOString();
    return true;
  }

  // Clear all data for a template (useful for testing)
  clearTemplateData(templateId: string): boolean {
    const data = this.getTemplateData(templateId);
    if (!data) return false;

    data.players = [];
    data.assets = [];
    data.weapons = [];
    data.vehicles = [];
    data.tasks = [];
    data.incidents = [];
    data.documents = [];
    data.mugshots = [];
    data.playerMedia = [];
    data.houseMedia = [];
    data.chatMessages = [];
    data.quotes = [];
    data.commendations = [];
    data.events = [];
    data.lastModified = new Date().toISOString();
    data.dataVersion += 1;

    return true;
  }

  // Export template data (for backup/restore)
  exportTemplateData(templateId: string): string | null {
    const data = this.getTemplateData(templateId);
    if (!data) return null;

    return JSON.stringify(data, null, 2);
  }

  // Import template data (for backup/restore)
  importTemplateData(templateId: string, jsonData: string): boolean {
    try {
      const importedData: TemplateData = JSON.parse(jsonData);

      // Validate the imported data
      if (!importedData.id || importedData.id !== templateId) {
        throw new Error('Template ID mismatch');
      }

      this.templateData.set(templateId, {
        ...importedData,
        lastModified: new Date().toISOString(),
        dataVersion: importedData.dataVersion + 1
      });

      return true;
    } catch (error) {
      console.error('Failed to import template data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const templateDataManager = TemplateDataManager.getInstance();