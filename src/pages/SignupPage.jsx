import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContexts'

export default function SignUp() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const success = register({ name, email, password })
    if (success) {
      navigate('/')
    } else {
      setError('Email already exists')
    }
  }

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="w-100" style={{maxWidth: '400px'}}>
        <h2 className="mb-4 text-center">Sign Up</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
          <div className="mb-3">
            <label htmlFor="signup-name" className="form-label">Name</label>
            <input
              id="signup-name"
              type="text"
              className="form-control"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="signup-email" className="form-label">Email</label>
            <input
              id="signup-email"
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="signup-password" className="form-label">Password</label>
            <input
              id="signup-password"
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Sign Up</button>
        </form>
        <p className="mt-3 text-center">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  )
}