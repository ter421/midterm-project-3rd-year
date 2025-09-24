import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/HomePage'
import SpaceDetail from './pages/SpaceDetail'
import Dashboard from './pages/DashboardPage'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/LoginPage'
import SignUp from './pages/SignupPage'

export default function App() {
  return (
    <div>
      <Header />
      <Routes>
        {/* Home page - publicly accessible */}
        <Route path="/" element={<Home />} />
        
        {/* Space detail - publicly accessible to view, but booking requires login */}
        <Route path="/space/:spaceId" element={<SpaceDetail />} />
        
        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected routes - require authentication */}
        <Route
          path="/dashboard/my-bookings"
          element={
            <ProtectedRoute message="You must log in to view your bookings">
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}