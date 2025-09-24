import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import spacesData from '../data/spaces.json'
import BookingForm from '../components/BookingForm'

export default function SpaceDetail() {
  const { spaceId } = useParams()
  const navigate = useNavigate()
  const [space, setSpace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    // Simulate loading and find space
    const timer = setTimeout(() => {
      const foundSpace = spacesData.find(s => String(s.id) === String(spaceId))
      setSpace(foundSpace)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [spaceId])

  if (loading) {
    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-md-8">
            <div className="skeleton-img mb-4" style={{ height: '400px' }}></div>
            <div className="skeleton-text" style={{ width: '60%', height: '32px' }}></div>
            <div className="skeleton-text" style={{ width: '40%' }}></div>
          </div>
          <div className="col-md-4">
            <div className="card p-3">
              <div className="skeleton-text"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!space) {
    return (
      <div className="container py-4">
        <div className="text-center py-5">
          <div className="display-1 mb-3">🏢</div>
          <h3 className="text-muted">Space not found</h3>
          <p className="text-muted">The space you're looking for doesn't exist or has been removed.</p>
          <div className="d-flex gap-2 justify-content-center">
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate(-1)}
            >
              ← Go Back
            </button>
            <Link to="/" className="btn btn-primary">
              Browse All Spaces
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Create image gallery (main image + any additional images)
  const images = [space.main_image, ...space.images].filter(Boolean)

  // Generate placeholder image URL based on space ID
  const getPlaceholderImage = (spaceId, width = 800, height = 400) => {
    return `/assets/${spaceId}/${width}/${height}`
  }

  const handleImageError = (e) => {
    e.target.src = getPlaceholderImage(space.id)
  }

  return (
    <div className="container py-4">
      <div className="row">
        {/* Left column - Space details */}
        <div className="col-md-8">
          {/* Image gallery */}
          <div className="mb-4">
            {/* Main image */}
            <div className="position-relative mb-3">
              <img 
                src={images[selectedImage] || getPlaceholderImage(space.id)} 
                alt={space.name}
                className="img-fluid w-100"
                style={{ 
                  height: '400px', 
                  objectFit: 'cover', 
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(12,18,36,0.1)'
                }}
                onError={handleImageError}
              />
              
              {/* Image counter */}
              {images.length > 1 && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '500'
                  }}
                >
                  {selectedImage + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail gallery */}
            {images.length > 1 && (
              <div className="d-flex gap-2 overflow-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className="btn p-0"
                    style={{
                      minWidth: '80px',
                      height: '60px',
                      border: selectedImage === index ? '3px solid var(--accent-text)' : '2px solid #e9ecef',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={img || getPlaceholderImage(space.id, 80, 60)}
                      alt={`${space.name} view ${index + 1}`}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }}
                      onError={handleImageError}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Space header */}
          <div className="mb-4">
            <h1 className="mb-3" style={{ fontSize: '2.5rem', fontWeight: '700' }}>
              {space.name}
            </h1>
            
            <div className="d-flex align-items-center gap-4 mb-3">
              <div className="d-flex align-items-center text-muted">
                <span style={{ fontSize: '1.1rem' }}>📍</span>
                <span className="ms-2 fs-5">{space.location}</span>
              </div>
              
              <div className="d-flex align-items-center">
                <span style={{ fontSize: '1.1rem' }}>🕒</span>
                <span className="ms-2 text-muted">{space.hours}</span>
              </div>
              
              <div 
                className="badge px-3 py-2"
                style={{
                  background: space.price <= 250 ? '#22c55e' : space.price <= 400 ? '#f59e0b' : '#ef4444',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '700'
                }}
              >
                ₱{space.price}/session
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h4 className="mb-3">About This Space</h4>
            <p className="fs-6 text-secondary lh-lg">
              {space.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="mb-4">
            <h4 className="mb-3">Amenities & Features</h4>
            <div className="row g-2">
              {space.amenities.map((amenity, index) => (
                <div key={index} className="col-auto">
                  <span 
                    className="badge bg-light text-dark d-flex align-items-center gap-2"
                    style={{
                      padding: '10px 16px',
                      fontSize: '0.9rem',
                      borderRadius: '25px',
                      border: '1px solid #e9ecef',
                      fontWeight: '500'
                    }}
                  >
                    <span>✓</span>
                    {amenity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Time slots */}
          <div className="mb-4">
            <h4 className="mb-3">Available Time Slots</h4>
            <div className="d-flex flex-wrap gap-2">
              {space.time_slots.map((slot, index) => (
                <div 
                  key={index}
                  className="badge bg-primary"
                  style={{
                    padding: '10px 16px',
                    fontSize: '0.9rem',
                    borderRadius: '20px',
                    fontWeight: '500'
                  }}
                >
                  {slot}
                </div>
              ))}
            </div>
          </div>

          {/* Back to browse button */}
          <div className="mt-5">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline-secondary me-3"
            >
              Back to Browse
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn btn-outline-primary"
            >
              Browse All Spaces
            </button>
          </div>
        </div>

        {/* Right column - Booking form */}
        <div className="col-md-4">
          <div className="position-sticky" style={{ top: '2rem' }}>
            <BookingForm space={space} />
            
            {/* Additional info card */}
            <div className="card mt-4 p-3">
              <h6 className="mb-3">Booking Information</h6>
              <div className="small text-muted">
                <div className="mb-2">
                  <strong>Cancellation:</strong> Free cancellation up to 24 hours before your session
                </div>
                <div className="mb-2">
                  <strong>Payment:</strong> Pay when you arrive at the space
                </div>
                <div>
                  <strong>Contact:</strong> You'll receive booking confirmation with contact details
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}