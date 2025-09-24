import React, { createContext, useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  // Logged in user
  const [user, setUser] = useLocalStorage('ss_user', null)
  // Bookings
  const [bookings, setBookings] = useLocalStorage('ss_bookings', [])
  // Registered users
  const [users, setUsers] = useLocalStorage('ss_users', [
    { id: 1, name: 'Juan Dela Cruz', email: 'juan@example.com', password: 'password123' }
  ])

  function login({ email, password }) {
    const found = users.find(u => u.email === email && u.password === password)
    if (found) {
      setUser(found)
      return true
    }
    return false
  }

  function logout() {
    setUser(null)
  }

  function register(newUser) {
    // Prevent duplicate email
    if (users.some(u => u.email === newUser.email)) {
      return false
    }
    const id = Date.now()
    const userWithId = { id, ...newUser }
    setUsers(prev => [...prev, userWithId])
    setUser(userWithId)
    return true
  }

  function addBooking(booking) {
    setBookings(prev => [...prev, booking])
  }

  function cancelBooking(bookingId) {
    setBookings(prev => prev.filter(b => b.id !== bookingId))
  }

  const value = { user, users, login, logout, register, bookings, addBooking, cancelBooking }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
