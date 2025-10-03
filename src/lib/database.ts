export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'marshall'
  avatarUrl?: string
  createdAt: string
}

export interface Player {
  id: string
  name: string
  alias: string
  avatarUrl?: string
  notes?: string
  createdAt: string
  dna?: string
  fingerprint?: string
  phoneNumber?: string
  status?: 'active' | 'inactive' | 'MIA'
  houseAddress?: string
  houseImageUrl?: string
}

export interface Asset {
  id: string
  playerId: string
  vehicleName: string
  vehicleReg: string
  vehicleVin: string
  vehicleColour: string
  vehicleValue: number
  vehicleLocation: string
  acquiredAt: string
  notes?: string
  vehicleImages?: string[]
}

export interface FinanceTransaction {
  id: string
  playerId: string
  amount: number
  type: 'credit' | 'debit'
  description: string
  createdAt: string
}


export interface Document {
  id: string
  ownerUserId: string
  playerId?: string
  filename: string
  url: string
  storagePath?: string
  isGoogleDoc: boolean
  createdAt: string
  description?: string
  originalFilename?: string
}

export interface TaskComment {
  id: string
  taskId: string
  userId: string
  username: string
  text: string
  mediaUrls?: string[]
  documentIds?: string[]
  createdAt: string
}

export interface Task {
  id: string
  name: string
  description: string
  priority: 'high' | 'medium' | 'low'
  risk: 'dangerous' | 'high' | 'medium' | 'low'
  assignedUsers: string[]
  deadline: string
  createdBy: string
  createdAt: string
  status: 'active' | 'completed' | 'overdue'
  comments: TaskComment[]
  mediaUrls?: string[]
}

export interface Mugshot {
  id: string
  playerId: string
  filename: string
  displayName?: string
  url: string
  storagePath?: string
  isProfilePicture: boolean
  createdAt: string
}

export interface Media {
  id: string
  playerId: string
  filename: string
  displayName?: string
  url: string
  storagePath?: string
  createdAt: string
}

export interface HouseMedia {
  id: string
  playerId: string
  filename: string
  displayName?: string
  url: string
  storagePath?: string
  createdAt: string
}

export interface Incident {
  id: string
  title: string
  incidentDateTime: string
  suspects: string[]
  officers: string[]
  otherIndividuals: string[]
  description: string
  mediaUrls: string[]
  createdBy: string
  createdAt: string
  status: 'open' | 'closed' | 'under_investigation'
}

export interface Weapon {
  id: string
  playerId: string
  gunName: string
  serialNumber: string
  ballisticsReference: string
  status: 'seized' | 'not_seized'
  notes?: string
  createdAt: string
}

export interface Template {
  id: string
  name: string
  logoUrl?: string
  createdBy: string
  createdAt: string
  isActive: boolean
  description?: string
}

export interface TemplatePermission {
  id: string
  templateId: string
  userId: string
  assignedBy: string
  assignedAt: string
}

export interface StaffMember {
  id: string
  name: string
  username: string
  password: string
  role: 'admin' | 'marshall'
  tagLine: string
  description: string
  bloodType: string
  favouriteHobby: string
  portraitUrl?: string
  isSuspended: boolean
  suspendedAt?: string
  suspendedBy?: string
  createdAt: string
  createdBy: string
}

export interface Vehicle {
  id: string
  name: string
  description: string
  imageUrl: string
  details: string
  status?: 'available' | 'unavailable' | 'maintenance'
  createdAt: string
  createdBy: string
}

export interface ChatMessage {
  id: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
  editedAt?: string
  reactions: { [emoji: string]: string[] } // emoji -> array of user IDs
  mediaUrls?: string[]
}

export interface MediaItem {
  id: string
  url: string
  description: string
  uploaderId: string
  uploaderName: string
  createdAt: string
}

export interface Quote {
  id: string
  quoteText: string
  whoSaidIt: string
  whenSaid: string
  whySaid: string
  submittedBy: string
  submittedByName: string
  createdAt: string
}

export interface Commendation {
  id: string
  recipientName: string
  shortReason: string
  fullExplanation: string
  issuedBy: string
  issuedByName: string
  imageUrl: string
  issuedAt: string
}

export interface Event {
  id: string
  title: string
  description: string
  dateTime: string
  createdBy: string
  createdByName: string
  createdAt: string
}

export interface DashboardSummary {
  totalPlayers: number
  totalAssetsValue: number
  totalCashBalance: number
  recentTasks: Task[]
  recentActivity: {
    type: 'player' | 'document' | 'task'
    message: string
    timestamp: string
  }[]
}