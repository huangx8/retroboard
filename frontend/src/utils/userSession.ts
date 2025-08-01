import { v4 as uuidv4 } from 'uuid'

export interface User {
  id: string
  name: string
  color: string
  socketId?: string
}

const USER_STORAGE_KEY = 'retroboard_user_session'
const USER_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF']

// Generate a random color that's not already taken by existing users
const getRandomColor = (excludeColors: string[] = []): string => {
  const availableColors = USER_COLORS.filter(color => !excludeColors.includes(color))
  if (availableColors.length === 0) {
    // If all colors are taken, return a random one anyway
    return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
  }
  return availableColors[Math.floor(Math.random() * availableColors.length)]
}

// Get or create a persistent user session
export const getUserSession = (): User => {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY)
    if (stored) {
      const user = JSON.parse(stored) as User
      // Validate that the stored user has required properties
      if (user.id && user.name && user.color) {
        return user
      }
    }
  } catch (error) {
    console.warn('Failed to load user session from localStorage:', error)
  }

  // Create a new user if no valid session exists
  const newUser: User = {
    id: uuidv4(),
    name: `User ${Math.floor(Math.random() * 1000)}`,
    color: getRandomColor()
  }

  saveUserSession(newUser)
  return newUser
}

// Save user session to localStorage
export const saveUserSession = (user: User): void => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  } catch (error) {
    console.warn('Failed to save user session to localStorage:', error)
  }
}

// Update user session (for example, when user changes their name)
export const updateUserSession = (updates: Partial<User>): User => {
  const currentUser = getUserSession()
  const updatedUser = { ...currentUser, ...updates }
  saveUserSession(updatedUser)
  return updatedUser
}

// Clear user session (for logout or reset)
export const clearUserSession = (): void => {
  try {
    localStorage.removeItem(USER_STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear user session from localStorage:', error)
  }
}

// Generate a user-friendly name based on their color
export const generateUserName = (color: string): string => {
  const colorNames: { [key: string]: string } = {
    '#FF6B6B': 'Red',
    '#4ECDC4': 'Teal', 
    '#45B7D1': 'Blue',
    '#96CEB4': 'Green',
    '#FECA57': 'Yellow',
    '#FF9FF3': 'Pink',
    '#54A0FF': 'Purple'
  }
  
  const colorName = colorNames[color] || 'Colorful'
  return `${colorName} User`
}

// Check if user session exists
export const hasUserSession = (): boolean => {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY)
    return stored !== null
  } catch {
    return false
  }
}
