import { useState, useEffect } from 'react'
import type { Task, ApiTask } from '../types'
import { useLocalStorage } from './useLocalStorage'

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', [])
  const [loading, setLoading] = useState(false)

  // Fetch initial tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      if (tasks.length > 0) return // Don't fetch if we already have tasks

      setLoading(true)
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/todos?_limit=5'
        )
        const apiTasks: ApiTask[] = await response.json()

        const formattedTasks: Task[] = apiTasks.map((task) => ({
          id: task.id,
          title: task.title,
          completed: task.completed,
          category: Math.random() > 0.5 ? 'work' : 'personal',
          createdAt: new Date().toISOString(),
          priority: ['low', 'medium', 'high'][
            Math.floor(Math.random() * 3)
          ] as Task['priority'],
        }))

        setTasks(formattedTasks)
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const addTask = (
    title: string,
    category: Task['category'],
    priority: Task['priority']
  ) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
      category,
      priority,
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [newTask, ...prev])
  }

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const editTask = (id: number, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    )
  }

  const getStats = () => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.completed).length
    const pending = total - completed
    return { total, completed, pending }
  }

  return {
    tasks,
    loading,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    getStats,
  }
}
