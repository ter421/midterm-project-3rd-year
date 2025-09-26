import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContexts'
import { useNavigate } from 'react-router-dom'

export default function BookingForm({ space, selectedTimeSlot, currentPrice }) {
  const { user, addBooking } = useAuth()
  const navigate = useNavigate()

  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [displayPrice, setDisplayPrice] = useState(0)

  // Get today's date in YYYY-MM-DD format for min date validation
  const today = new Date().toISOString().split('T')[0]

  // Get max date (e.g., 3 months from now)
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 3)
  const maxDateString = maxDate.toISOString().split('T')[0]

  // Initialize time slot and price when component mounts or selectedTimeSlot changes
  useEffect(() => {
    if (selectedTimeSlot) {
      // If a time slot is pre-selected from the parent component
      setTimeSlot(selectedTimeSlot.name)
      setDisplayPrice(selectedTimeSlot.price)
    } else {
      // Set default time slot and price
      const defaultSlot = getFirstTimeSlot()
      if (defaultSlot) {
        setTimeSlot(defaultSlot.name || defaultSlot)
        setDisplayPrice(defaultSlot.price || space.base_price || space.price || 0)
      } else {
        setDisplayPrice(currentPrice || space.base_price || space.price || 0)
      }
    }
  }, [selectedTimeSlot, currentPrice, space])

  // Helper function to get the first available time slot
  const getFirstTimeSlot = () => {
    if (!space.time_slots || space.time_slots.length === 0) return null
    return space.time_slots[0]
  }

  // Helper function to get time slot details by name
  const getTimeSlotByName = (slotName) => {
    if (!space.time_slots) return null
    
    return space.time_slots.find(slot => {
      const name = typeof slot === 'object' ? slot.name : slot
      return name === slotName
    })
  }

  // Handle time slot change
  const handleTimeSlotChange = (selectedSlotName) => {
    setTimeSlot(selectedSlotName)
    
    const slot = getTimeSlotByName(selectedSlotName)
    if (slot) {
      const price = typeof slot === 'object' ? slot.price : (space.base_price || space.price)
      setDisplayPrice(price)
    }
  }

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
      const selectedSlotDetails = getTimeSlotByName(timeSlot)
      const bookingPrice = typeof selectedSlotDetails === 'object' ? 
        selectedSlotDetails.price : 
        (space.base_price || space.price)

      const booking = {
        id: Date.now(),
        userId: user.id,
        spaceId: space.id,
        spaceName: space.name,
        date,
        timeSlot,
        timeSlotDetails: selectedSlotDetails,
        price: bookingPrice,
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

  // Format time slots for display
  const formatTimeSlotOption = (slot) => {
    if (typeof slot === 'object') {
      return `${slot.name} - ₱${slot.price} (${slot.duration || ''})`
    }
    return slot
  }

  // Get time slot description for selected slot
  const getSelectedSlotDescription = () => {
    const slot = getTimeSlotByName(timeSlot)
    if (typeof slot === 'object' && slot.description) {
      return slot.description
    }
    return null
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
          Time Options <span className="text-danger">*</span>
        </label>
        <select 
          id="booking-timeslot"
          className="form-select" 
          value={timeSlot} 
          onChange={e => handleTimeSlotChange(e.target.value)} 
          required
          disabled={isSubmitting}
        >
          {space.time_slots && space.time_slots.map((slot, i) => {
            const slotName = typeof slot === 'object' ? slot.name : slot
            return (
              <option key={i} value={slotName}>
                {formatTimeSlotOption(slot)}
              </option>
            )
          })}
        </select>
      </div>

      {/* Price display */}
      <div className="mb-3 p-3 booking-form-price-display rounded">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-semibold">Selected Time Slot:</span>
          <span className="text-muted">{timeSlot || 'None selected'}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-semibold">Total Price:</span>
          <span className="h5 mb-0 text-success">₱{displayPrice}</span>
        </div>
        {selectedTimeSlot && (
          <div className="mt-2">
            <small className="text-muted">
              <i className="bi bi-clock me-1"></i>
              Duration: {selectedTimeSlot.duration || 'Contact space for details'}
            </small>
          </div>
        )}
      </div>

      {/* Pricing note */}
      {!timeSlot && (
        <div className="mb-3">
          <small className="text-muted">
            <i className="bi bi-info-circle me-1"></i>
            Price will update based on selected time slot
          </small>
        </div>
      )}

      {/* Submit button */}
      <button 
        type="submit" 
        className="btn btn-success w-100 d-flex align-items-center justify-content-center"
        disabled={isSubmitting || !user || !timeSlot}
      >
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Processing...
          </>
        ) : (
          <>
            {!user ? 'Log in to Book' : 
             !timeSlot ? 'Select Time Slot' : 
             `Confirm Booking (₱${displayPrice})`}
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

      {/* Booking terms */}
      <div className="mt-3 pt-3 border-top">
        <small className="text-muted">
          By booking this space, you agree to the cancellation policy and terms of service.
        </small>
      </div>
    </form>
  )
}