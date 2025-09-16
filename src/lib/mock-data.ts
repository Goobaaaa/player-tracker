import { Player, Asset, FinanceTransaction, Task, DashboardSummary } from './database';

// Mock players data
export const mockPlayers: Player[] = [
  {
    id: "1",
    name: "Shadow",
    alias: "Shadow Walker",
    notes: "Stealth specialist with exceptional infiltration skills. Expert in close-quarters combat and silent takedowns. Has completed 47 successful missions without detection.",
    createdAt: "2024-12-01T00:00:00Z"
  },
  {
    id: "2",
    name: "Nyx",
    alias: "Night Hunter",
    notes: "Expert tracker and reconnaissance specialist. Masters in surveillance and intelligence gathering. Specializes in night operations and urban tracking.",
    createdAt: "2024-12-02T00:00:00Z"
  },
  {
    id: "3",
    name: "Phoenix",
    alias: "Fire Starter",
    notes: "Demolitions expert with tactical combat experience. Specializes in explosive ordinance and heavy weapons. Known for quick thinking in high-pressure situations.",
    createdAt: "2024-12-03T00:00:00Z"
  },
  {
    id: "4",
    name: "Echo",
    alias: "Silent Strike",
    notes: "Sniper and long-range operations specialist. Expert marksman with over 100 confirmed long-range eliminations. Trained in multiple weapons systems.",
    createdAt: "2024-12-04T00:00:00Z"
  },
  {
    id: "5",
    name: "Raven",
    alias: "Dark Wing",
    notes: "Intel gatherer and surveillance expert. Skilled in electronic warfare and cyber operations. Expert in social engineering and information extraction.",
    createdAt: "2024-12-05T00:00:00Z"
  }
];

// Mock assets data
export const mockAssets: Asset[] = [
  {
    id: "1",
    playerId: "1",
    type: "Weapon",
    name: "Silenced Pistol",
    quantity: 1,
    value: 2500,
    acquiredAt: "2024-12-01T00:00:00Z",
    notes: "Custom modified with extended magazine and suppressor"
  },
  {
    id: "2",
    playerId: "1",
    type: "Equipment",
    name: "Night Vision Goggles",
    quantity: 1,
    value: 5000,
    acquiredAt: "2024-12-02T00:00:00Z",
    notes: "Latest generation with thermal imaging capabilities"
  },
  {
    id: "3",
    playerId: "1",
    type: "Vehicle",
    name: "Motorcycle",
    quantity: 1,
    value: 15000,
    acquiredAt: "2024-12-03T00:00:00Z",
    notes: "Modified for stealth operations with noise reduction"
  },
  {
    id: "4",
    playerId: "2",
    type: "Weapon",
    name: "Assault Rifle",
    quantity: 1,
    value: 3500,
    acquiredAt: "2024-12-04T00:00:00Z",
    notes: "Tactical rifle with various attachments"
  },
  {
    id: "5",
    playerId: "2",
    type: "Equipment",
    name: "Body Armor",
    quantity: 2,
    value: 8000,
    acquiredAt: "2024-12-05T00:00:00Z",
    notes: "Kevlar reinforced with ceramic plates"
  },
  {
    id: "6",
    playerId: "3",
    type: "Weapon",
    name: "Shotgun",
    quantity: 1,
    value: 1200,
    acquiredAt: "2024-12-06T00:00:00Z",
    notes: "Pump-action with extended magazine"
  },
  {
    id: "7",
    playerId: "4",
    type: "Equipment",
    name: "Sniper Rifle",
    quantity: 1,
    value: 8500,
    acquiredAt: "2024-12-07T00:00:00Z",
    notes: "Long-range precision rifle with scope"
  },
  {
    id: "8",
    playerId: "5",
    type: "Vehicle",
    name: "Van",
    quantity: 1,
    value: 25000,
    acquiredAt: "2024-12-08T00:00:00Z",
    notes: " Surveillance van with advanced equipment"
  }
];

// Mock transactions data
export const mockTransactions: FinanceTransaction[] = [
  {
    id: "1",
    playerId: "1",
    amount: 50000,
    type: "credit",
    description: "Mission completion bonus - Operation Silent Night",
    createdAt: "2024-12-15T00:00:00Z"
  },
  {
    id: "2",
    playerId: "1",
    amount: 5000,
    type: "debit",
    description: "Equipment purchase - Night Vision Goggles",
    createdAt: "2024-12-14T00:00:00Z"
  },
  {
    id: "3",
    playerId: "1",
    amount: 2500,
    type: "debit",
    description: "Weapon upgrade - Silenced Pistol modification",
    createdAt: "2024-12-13T00:00:00Z"
  },
  {
    id: "4",
    playerId: "2",
    amount: 15000,
    type: "credit",
    description: "Contract fulfillment - Corporate espionage",
    createdAt: "2024-12-12T00:00:00Z"
  },
  {
    id: "5",
    playerId: "2",
    amount: 8000,
    type: "debit",
    description: "Body armor purchase - Level IV protection",
    createdAt: "2024-12-11T00:00:00Z"
  },
  {
    id: "6",
    playerId: "3",
    amount: 35000,
    type: "credit",
    description: "Demolition contract success",
    createdAt: "2024-12-10T00:00:00Z"
  }
];

// Mock tasks data
export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Update player profiles",
    description: "Review and update all player information including skills and equipment",
    status: "in-progress",
    priority: "high",
    percentComplete: 75,
    dueDate: "2024-12-20",
    createdAt: "2024-12-15"
  },
  {
    id: "2",
    title: "Asset audit",
    description: "Conduct quarterly asset valuation and inventory check",
    status: "todo",
    priority: "medium",
    percentComplete: 0,
    dueDate: "2024-12-25",
    createdAt: "2024-12-14"
  },
  {
    id: "3",
    title: "Security protocol review",
    description: "Review and update security protocols and access controls",
    status: "todo",
    priority: "high",
    percentComplete: 0,
    dueDate: "2024-12-18",
    createdAt: "2024-12-13"
  },
  {
    id: "4",
    title: "Training schedule coordination",
    description: "Coordinate and schedule training sessions for all players",
    status: "in-progress",
    priority: "medium",
    percentComplete: 30,
    dueDate: "2024-12-22",
    createdAt: "2024-12-12"
  },
  {
    id: "5",
    title: "Equipment maintenance",
    description: "Perform routine maintenance on all equipment and vehicles",
    status: "done",
    priority: "low",
    percentComplete: 100,
    dueDate: "2024-12-14",
    createdAt: "2024-12-11"
  },
  {
    id: "6",
    title: "Intelligence briefing preparation",
    description: "Prepare intelligence briefing for upcoming operations",
    status: "in-progress",
    priority: "high",
    percentComplete: 60,
    dueDate: "2024-12-17",
    createdAt: "2024-12-10"
  }
];

// Mock dashboard summary
export const mockDashboardSummary: DashboardSummary = {
  totalPlayers: mockPlayers.length,
  totalAssetsValue: mockAssets.reduce((total, asset) => total + (asset.value * asset.quantity), 0),
  totalCashBalance: mockTransactions.reduce((balance, transaction) => {
    return transaction.type === 'credit' ? balance + transaction.amount : balance - transaction.amount;
  }, 0),
  recentTasks: mockTasks.slice(0, 4),
  recentActivity: [
    {
      type: "player",
      message: "New player 'Raven' added to the system",
      timestamp: "2024-12-16T10:30:00Z"
    },
    {
      type: "document",
      message: "Mission Brief uploaded for player 'Shadow'",
      timestamp: "2024-12-16T09:15:00Z"
    },
    {
      type: "task",
      message: "Task 'Equipment Maintenance' marked as completed",
      timestamp: "2024-12-16T08:45:00Z"
    },
    {
      type: "player",
      message: "Player 'Phoenix' completed advanced training",
      timestamp: "2024-12-16T07:30:00Z"
    },
    {
      type: "document",
      message: "Security Protocol v2.1 published",
      timestamp: "2024-12-16T06:00:00Z"
    }
  ]
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
  return assets.reduce((total, asset) => total + (asset.value * asset.quantity), 0);
};