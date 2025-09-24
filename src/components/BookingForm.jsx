import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContexts'
import { useNavigate } from 'react-router-dom'

export default function BookingForm({ space }) {
  const { user, addBooking } = useAuth()
  const navigate = useNavigate()

  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState(space.time_slots[0] || '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get today's date in YYYY-MM-DD format for min date validation
  const today = new Date().toISOString().split('T')[0]

  // Get max date (e.g., 3 months from now)
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 3)
  const maxDateString = maxDate.toISOString().split('T')[0]

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!user) {
      setError('Please log in to make a booking')
      return
    }

    if (!date || !timeSlot) {
      setError('Please select both date and time slot')
      return
    }

    // Additional validation: check if date is not in the past
    const selectedDate = new Date(date)
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0) // Reset time to start of day

    if (selectedDate < currentDate) {
      setError('Cannot book for past dates')
      return
    }

    setIsSubmitting(true)

    try {
      const booking = {
        id: Date.now(),
        userId: user.id,
        spaceId: space.id,
        spaceName: space.name,
        date,
        timeSlot,
        price: space.price,
        createdAt: new Date().toISOString()
      }
      
      addBooking(booking)
      
      // Show success message briefly before redirecting
      setSuccess('Booking confirmed successfully!')
      
      setTimeout(() => {
        navigate('/dashboard/my-bookings')
      }, 1500)
      
    } catch (err) {
      setError('Failed to create booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-3">
      <h5 className="card-title mb-3">Book This Space</h5>
      
      {/* Error message */}
      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError('')}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      {/* Success message */}
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="booking-date" className="form-label">
          Date <span className="text-danger">*</span>
        </label>
        <input 
          id="booking-date"
          type="date" 
          className="form-control" 
          value={date} 
          onChange={e => setDate(e.target.value)} 
          min={today}
          max={maxDateString}
          required 
          disabled={isSubmitting}
        />
        <div className="form-text">
          Available dates: Today to {new Date(maxDateString).toLocaleDateString()}
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="booking-timeslot" className="form-label">
          Time Slot <span className="text-danger">*</span>
        </label>
        <select 
          id="booking-timeslot"
          className="form-select" 
          value={timeSlot} 
          onChange={e => setTimeSlot(e.target.value)} 
          required
          disabled={isSubmitting}
        >
          {space.time_slots.map((slot, i) => (
            <option key={i} value={slot}>{slot}</option>
          ))}
        </select>
      </div>

      {/* Price display */}
      <div className="mb-3 p-2 bg-light rounded">
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-semibold">Total Price:</span>
          <span className="h5 mb-0 text-success">₱{space.price}</span>
        </div>
      </div>

      {/* Submit button */}
      <button 
        type="submit" 
        className="btn btn-success w-100 d-flex align-items-center justify-content-center"
        disabled={isSubmitting || !user}
      >
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Processing...
          </>
        ) : (
          <>
            {!user ? 'Log in to Book' : `Confirm Booking (₱${space.price})`}
          </>
        )}
      </button>

      {/* Login prompt for non-authenticated users */}
      {!user && (
        <div className="mt-2 text-center">
          <small className="text-muted">
            <a href="/login" className="text-decoration-none">Log in</a> or{' '}
            <a href="/signup" className="text-decoration-none">Sign up</a> to make a booking
          </small>
        </div>
      )}
    </form>
  )
}