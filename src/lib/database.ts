export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
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
}

export interface Asset {
  id: string
  playerId: string
  type: string
  name: string
  quantity: number
  value: number
  acquiredAt: string
  notes?: string
}

export interface FinanceTransaction {
  id: string
  playerId: string
  amount: number
  type: 'credit' | 'debit'
  description: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  assigneeUserId?: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  percentComplete: number
  dueDate?: string
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