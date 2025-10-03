const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}/api${endpoint}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || `HTTP error! status: ${response.status}` }
      }

      return { data }
    } catch (error) {
      console.error('API request failed:', error)
      return { error: 'Network error occurred' }
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()

// Authentication specific API calls
export const authApi = {
  async login(username: string, password: string) {
    const response = await apiClient.post('/auth/login', { username, password })
    if (response.error) {
      return { success: false, error: response.error }
    }
    return { success: true, data: response.data }
  },

  async logout() {
    return await apiClient.post('/auth/logout')
  },

  async getSession() {
    return await apiClient.get('/auth/session')
  },

  async register(userData: {
    username: string
    password: string
    name: string
    role?: string
  }) {
    return await apiClient.post('/auth/register', userData)
  }
}

// Players API
export const playersApi = {
  async getPlayers() {
    return await apiClient.get('/players')
  },

  async getPlayer(id: string) {
    return await apiClient.get(`/players/${id}`)
  },

  async createPlayer(playerData: any) {
    return await apiClient.post('/players', playerData)
  },

  async updatePlayer(id: string, playerData: any) {
    return await apiClient.put(`/players/${id}`, playerData)
  },

  async deletePlayer(id: string) {
    return await apiClient.delete(`/players/${id}`)
  }
}

// Tasks API
export const tasksApi = {
  async getTasks() {
    return await apiClient.get('/tasks')
  },

  async createTask(taskData: any) {
    return await apiClient.post('/tasks', taskData)
  },

  async updateTask(id: string, taskData: any) {
    return await apiClient.put(`/tasks/${id}`, taskData)
  },

  async deleteTask(id: string) {
    return await apiClient.delete(`/tasks/${id}`)
  }
}

// Users API
export const usersApi = {
  async getUsers() {
    return await apiClient.get('/users')
  },

  async createUser(userData: {
    username: string
    password: string
    name: string
    role?: string
  }) {
    return await apiClient.post('/users', userData)
  },

  async updateUser(id: string, userData: any) {
    return await apiClient.put(`/users/${id}`, userData)
  },

  async suspendUser(id: string) {
    return await apiClient.put(`/users/${id}`, { isSuspended: true })
  },

  async unsuspendUser(id: string) {
    return await apiClient.put(`/users/${id}`, { isSuspended: false })
  }
}