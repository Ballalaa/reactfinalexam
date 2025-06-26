export interface Task {
  id: number
  title: string
  completed: boolean
  category: 'work' | 'personal' | 'shopping'
  createdAt: string
  priority: 'low' | 'medium' | 'high'
}

export interface User {
  id: number
  name: string
  email: string
}

export interface ApiTask {
  id: number
  title: string
  completed: boolean
  userId: number
}
