import { createClient } from './supabase';
import { Player, Asset, Task, DashboardSummary, Document, Incident, Weapon, Template, TemplatePermission, StaffMember, Vehicle } from './database';

const supabase = createClient();

// Player functions
export const getPlayers = async (): Promise<Player[]> => {
  const { data, error } = await supabase.from('players').select('*');
  if (error) throw error;
  return data;
};

export const getPlayer = async (id: string): Promise<Player | null> => {
  const { data, error } = await supabase.from('players').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createPlayer = async (player: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>): Promise<Player> => {
  const { data, error } = await supabase.from('players').insert(player).single();
  if (error) throw error;
  return data;
};

export const updatePlayer = async (id: string, updates: Partial<Player>): Promise<Player> => {
  const { data, error } = await supabase.from('players').update(updates).eq('id', id).single();
  if (error) throw error;
  return data;
};

export const deletePlayer = async (id: string): Promise<void> => {
  const { error } = await supabase.from('players').delete().eq('id', id);
  if (error) throw error;
};

// Asset functions
export const getAssets = async (): Promise<Asset[]> => {
  const { data, error } = await supabase.from('assets').select('*');
  if (error) throw error;
  return data;
};

export const getPlayerAssets = async (playerId: string): Promise<Asset[]> => {
  const { data, error } = await supabase.from('assets').select('*').eq('playerId', playerId);
  if (error) throw error;
  return data;
};

export const createAsset = async (asset: Omit<Asset, 'id' | 'acquiredAt'>): Promise<Asset> => {
  const { data, error } = await supabase.from('assets').insert(asset).single();
  if (error) throw error;
  return data;
};

export const updateAsset = async (id: string, updates: Partial<Asset>): Promise<Asset> => {
  const { data, error } = await supabase.from('assets').update(updates).eq('id', id).single();
  if (error) throw error;
  return data;
};

export const deleteAsset = async (id: string): Promise<void> => {
  const { error } = await supabase.from('assets').delete().eq('id', id);
  if (error) throw error;
};

// Task functions
export const getTasks = async (): Promise<Task[]> => {
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) throw error;
    return data;
};

export const getTemplateById = async (id: string): Promise<Template | null> => {
    const { data, error } = await supabase.from('templates').select('*').eq('id', id).single();
    if (error) return null;
    return data;
};

// TaskComment functions
export const addTaskComment = async (comment: Omit<TaskComment, 'id' | 'createdAt'>): Promise<TaskComment> => {
    const { data, error } = await supabase.from('task_comments').insert(comment).single();
    if (error) throw error;
    return data;
};

export const deleteTaskComment = async (id: string): Promise<void> => {
    const { error } = await supabase.from('task_comments').delete().eq('id', id);
    if (error) throw error;
};

export const createStaffMember = async (member: Omit<StaffMember, 'id' | 'createdAt'>): Promise<StaffMember> => {
    const { data, error } = await supabase.from('staff_members').insert(member).single();
    if (error) throw error;
    return data;
};

export const updateStaffMember = async (id: string, updates: Partial<StaffMember>): Promise<StaffMember> => {
    const { data, error } = await supabase.from('staff_members').update(updates).eq('id', id).single();
    if (error) throw error;
    return data;
};

export const deleteStaffMember = async (id: string): Promise<void> => {
    const { error } = await supabase.from('staff_members').delete().eq('id', id);
    if (error) throw error;
};

// Quote functions
export const getQuotes = async (): Promise<Quote[]> => {
    const { data, error } = await supabase.from('quotes').select('*');
    if (error) throw error;
    return data;
};

export const createQuote = async (quote: Omit<Quote, 'id' | 'createdAt'>): Promise<Quote> => {
    const { data, error } = await supabase.from('quotes').insert(quote).single();
    if (error) throw error;
    return data;
};

// ChatMessage functions
export const getChatMessages = async (): Promise<ChatMessage[]> => {
    const { data, error } = await supabase.from('chat_messages').select('*');
    if (error) throw error;
    return data;
};

export const createChatMessage = async (message: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage> => {
    const { data, error } = await supabase.from('chat_messages').insert(message).single();
    if (error) throw error;
    return data;
};

export const updateChatMessage = async (id: string, updates: Partial<ChatMessage>): Promise<ChatMessage> => {
    const { data, error } = await supabase.from('chat_messages').update(updates).eq('id', id).single();
    if (error) throw error;
    return data;
};

export const deleteChatMessage = async (id: string): Promise<void> => {
    const { error } = await supabase.from('chat_messages').delete().eq('id', id);
    if (error) throw error;
};

// MediaItem functions
export const getMediaItems = async (): Promise<MediaItem[]> => {
    const { data, error } = await supabase.from('media_items').select('*');
    if (error) throw error;
    return data;
};

export const createMediaItem = async (item: Omit<MediaItem, 'id' | 'createdAt'>): Promise<MediaItem> => {
    const { data, error } = await supabase.from('media_items').insert(item).single();
    if (error) throw error;
    return data;
};

export const deleteMediaItem = async (id: string): Promise<void> => {
    const { data, error: fetchError } = await supabase.from('media_items').select('url').eq('id', id).single();
    if (fetchError) throw fetchError;

    // Delete file from storage first
    if (data?.url) {
        const fileName = data.url.split('/').pop();
        if (fileName) {
            await supabase.storage.from('media').remove([fileName]);
        }
    }

    const { error: deleteError } = await supabase.from('media_items').delete().eq('id', id);
    if (deleteError) throw deleteError;
};

export const uploadMediaFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('media').upload(fileName, file);
    if (error) {
        throw error;
    }
    const { data } = supabase.storage.from('media').getPublicUrl(fileName);
    return data.publicUrl;
};

// FinanceTransaction functions
export const getPlayerTransactions = async (playerId: string): Promise<FinanceTransaction[]> => {
    const { data, error } = await supabase.from('finance_transactions').select('*').eq('playerId', playerId);
    if (error) throw error;
    return data;
};

// Dashboard Summary
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
    const { count: totalPlayers } = await supabase.from('players').select('*', { count: 'exact', head: true });
    const { data: assets } = await supabase.from('assets').select('value');
    const { count: totalOfficers } = await supabase.from('staff_members').select('*', { count: 'exact', head: true });
    const { data: tasks } = await supabase.from('tasks').select('status');
    const { count: totalIncidents } = await supabase.from('incidents').select('*', { count: 'exact', head: true });
    const { count: totalVehicles } = await supabase.from('vehicles').select('*', { count: 'exact', head: true });

    const totalAssetsValue = assets ? assets.reduce((sum, asset) => sum + asset.value, 0) : 0;
    const activeTasks = tasks ? tasks.filter(task => task.status === 'active').length : 0;
    const completedTasks = tasks ? tasks.filter(task => task.status === 'completed').length : 0;

    return {
        totalPlayers: totalPlayers || 0,
        totalAssetsValue,
        activeTasks,
        completedTasks,
        totalOfficers: totalOfficers || 0,
        totalIncidents: totalIncidents || 0,
        totalVehicles: totalVehicles || 0,
    };
};

// Commendation functions
export const getCommendations = async (): Promise<Commendation[]> => {
    const { data, error } = await supabase.from('commendations').select('*');
    if (error) throw error;
    return data;
};

export const createCommendation = async (commendation: Omit<Commendation, 'id' | 'issuedAt'>): Promise<Commendation> => {
    const { data, error } = await supabase.from('commendations').insert(commendation).single();
    if (error) throw error;
    return data;
};

// AuditLog functions
export const getAuditLog = async (): Promise<any[]> => {
    const { data, error } = await supabase.from('audit_log').select('*');
    if (error) throw error;
    return data;
};

export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    const { data, error } = await supabase.from('tasks').insert(task).single();
    if (error) throw error;
    return data;
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
    const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).single();
    if (error) throw error;
    return data;
};

export const deleteTask = async (id: string): Promise<void> => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
};

// Incident functions
export const getIncidents = async (): Promise<Incident[]> => {
    const { data, error } = await supabase.from('incidents').select('*');
    if (error) throw error;
    return data;
};

export const createIncident = async (incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>): Promise<Incident> => {
    const { data, error } = await supabase.from('incidents').insert(incident).single();
    if (error) throw error;
    return data;
};

export const updateIncident = async (id: string, updates: Partial<Incident>): Promise<Incident> => {
    const { data, error } = await supabase.from('incidents').update(updates).eq('id', id).single();
    if (error) throw error;
    return data;
};

export const deleteIncident = async (id: string): Promise<void> => {
    const { error } = await supabase.from('incidents').delete().eq('id', id);
    if (error) throw error;
};

// Document functions
export const getDocuments = async (): Promise<Document[]> => {
    const { data, error } = await supabase.from('documents').select('*');
    if (error) throw error;
    return data;
};

export const createDocument = async (document: Omit<Document, 'id' | 'createdAt'>): Promise<Document> => {
    const { data, error } = await supabase.from('documents').insert(document).single();
    if (error) throw error;
    return data;
};

export const deleteDocument = async (id: string): Promise<void> => {
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) throw error;
};

// Weapon functions
export const getWeapons = async (): Promise<Weapon[]> => {
    const { data, error } = await supabase.from('weapons').select('*');
    if (error) throw error;
    return data;
};

export const createWeapon = async (weapon: Omit<Weapon, 'id' | 'createdAt'>): Promise<Weapon> => {
    const { data, error } = await supabase.from('weapons').insert(weapon).single();
    if (error) throw error;
    return data;
};

export const deleteWeapon = async (id: string): Promise<void> => {
    const { error } = await supabase.from('weapons').delete().eq('id', id);
    if (error) throw error;
};

// Vehicle functions
export const getVehicles = async (): Promise<Vehicle[]> => {
    const { data, error } = await supabase.from('vehicles').select('*');
    if (error) throw error;
    return data;
};

export const createVehicle = async (vehicle: Omit<Vehicle, 'id' | 'createdAt'>): Promise<Vehicle> => {
    const { data, error } = await supabase.from('vehicles').insert(vehicle).single();
    if (error) throw error;
    return data;
};

export const updateVehicle = async (id: string, updates: Partial<Vehicle>): Promise<Vehicle> => {
    const { data, error } = await supabase.from('vehicles').update(updates).eq('id', id).single();
    if (error) throw error;
    return data;
};

export const deleteVehicle = async (id: string): Promise<void> => {
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (error) throw error;
};

// StaffMember functions
export const getStaffMembers = async (): Promise<StaffMember[]> => {
    const { data, error } = await supabase.from('staff_members').select('*');
    if (error) throw error;
    return data;
};

// Template functions
export const getTemplates = async (): Promise<Template[]> => {
    const { data, error } = await supabase.from('templates').select('*');
    if (error) throw error;
    return data;
};

// TemplatePermission functions
export const getTemplatePermissions = async (): Promise<TemplatePermission[]> => {
    const { data, error } = await supabase.from('template_permissions').select('*');
    if (error) throw error;
    return data;
};