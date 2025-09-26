import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContexts'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message)
      // 🔹 Clear out the location state so it won't persist after logout/refresh
      navigate(location.pathname, { replace: true, state: {} })
    } else {
      setError('')
    }
  }, [location, navigate])

  function handleSubmit(e) {
    e.preventDefault()
    const success = login({ email, password })
    if (success) {
      setError('')
      navigate('/')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Log In</button>
      </form>
      <p className="mt-3 text-center">
        Don’t have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  )
}
