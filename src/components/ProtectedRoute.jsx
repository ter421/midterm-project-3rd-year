import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContexts'

export default function ProtectedRoute({ children, message }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, message }}
      />
    )
  }

  return children
}
