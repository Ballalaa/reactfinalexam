import { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { User } from '../types'

export default function Profile() {
  const [user, setUser] = useLocalStorage<User | null>('user', null)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  // Fetch user data from API if not exists
  useEffect(() => {
    const fetchUser = async () => {
      if (user) return

      setLoading(true)
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/users/1'
        )
        const userData: User = await response.json()
        setUser(userData)
        setFormData({
          name: userData.name,
          email: userData.email,
        })
      } catch (error) {
        console.error('Failed to fetch user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [user, setUser])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
      }
      setUser(updatedUser)
      setEditing(false)
    }
  }

  const clearData = () => {
    if (
      confirm(
        'Are you sure you want to clear all data? This will remove all tasks and user data.'
      )
    ) {
      localStorage.clear()
      window.location.reload()
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Profile</h1>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              User Information
            </h2>
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>
        <div className="p-6">
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <p className="text-gray-900">{user?.name || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="text-gray-900">{user?.email || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User ID
                </label>
                <p className="text-gray-900">{user?.id || 'Not set'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
