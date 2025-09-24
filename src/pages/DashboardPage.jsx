import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContexts'
import ConfirmModal from '../components/ConfirmModal'

export default function DashboardPage() {
  const { user, bookings, cancelBooking } = useAuth()
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const myBookings = bookings.filter(b => b.userId === user?.id)

  function handleCancel(booking) {
    setSelected(booking)
    setShowModal(true)
  }

  function confirmCancel() {
    cancelBooking(selected.id)
    setShowModal(false)
    setSelected(null)
  }

  return (
    <div className="container py-4">
      <h2>My Bookings</h2>
      {!myBookings.length && <p>No bookings yet. Make one from a space page.</p>}
      <div className="list-group">
        {myBookings.map(b => (
          <div key={b.id} className="list-group-item d-flex justify-content-between align-items-start">
            <div>
              <strong>{b.spaceName}</strong>
              <div className="text-muted">{b.date} • {b.timeSlot} • ₱{b.price}</div>
            </div>
            <div>
              <button className="btn btn-sm btn-danger" onClick={() => handleCancel(b)}>Cancel</button>
            </div>
          </div>
        ))}
      </div>
      <ConfirmModal
        show={showModal}
        title="Cancel Booking"
        message={`Are you sure you want to cancel your booking for ${selected?.spaceName}?`}
        onConfirm={confirmCancel}
        onCancel={() => setShowModal(false)}
      />
    </div>
  )
}
