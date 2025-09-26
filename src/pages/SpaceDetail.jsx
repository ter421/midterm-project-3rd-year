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
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [currentPrice, setCurrentPrice] = useState(0)

  useEffect(() => {
    // Simulate loading and find space
    const timer = setTimeout(() => {
      const foundSpace = spacesData.find(s => String(s.id) === String(spaceId))
      setSpace(foundSpace)
      if (foundSpace) {
        // Set default price to base_price or first time slot price
        const defaultPrice = foundSpace.base_price || (foundSpace.time_slots?.[0]?.price || foundSpace.price)
        setCurrentPrice(defaultPrice)
      }
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [spaceId])

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot)
    setCurrentPrice(timeSlot.price)
  }

  if (loading) {
    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-md-8">
            <div className="skeleton-img mb-4 spacedetail-main-image"></div>
            <div className="skeleton-text spacedetail-title-skeleton"></div>
            <div className="skeleton-text short"></div>
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

  // Get price badge class
  const getPriceBadgeClass = (price) => {
    if (price <= 200) return 'spacedetail-price-badge low'
    if (price <= 350) return 'spacedetail-price-badge medium'
    return 'spacedetail-price-badge high'
  }

  return (
    <div className="container py-4">
      <div className="row">
        {/* Left column - Space details */}
        <div className="col-md-8">
          {/* Image gallery */}
          <div className="mb-4">
            {/* Main image */}
            <div className="spacedetail-image-container">
              <img 
                src={images[selectedImage] || getPlaceholderImage(space.id)} 
                alt={space.name}
                className="img-fluid w-100 spacedetail-main-image"
                onError={handleImageError}
              />
              
              {/* Image counter */}
              {images.length > 1 && (
                <div className="spacedetail-image-counter">
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
                    className={`btn p-0 spacedetail-thumbnail-btn ${selectedImage === index ? 'active' : ''}`}
                  >
                    <img
                      src={img || getPlaceholderImage(space.id, 80, 60)}
                      alt={`${space.name} view ${index + 1}`}
                      className="spacedetail-thumbnail-img"
                      onError={handleImageError}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Space header */}
          <div className="mb-4">
            <h1 className="mb-3 spacedetail-title">
              {space.name}
            </h1>
            
            <div className="spacedetail-meta">
              <div className="d-flex align-items-center text-muted">
                <span className="spacedetail-location-icon">📍</span>
                <span className="ms-2 spacedetail-location-text">{space.location}</span>
              </div>
              
              <div className="d-flex align-items-center">
                <span className="spacedetail-hours-icon">🕒</span>
                <span className="ms-2 text-muted">{space.hours}</span>
              </div>
              
              <div className={`badge px-3 py-2 ${getPriceBadgeClass(currentPrice)}`}>
                ₱{currentPrice}
                {selectedTimeSlot ? (
                  <small className="spacedetail-price-duration">
                    {selectedTimeSlot.name}
                  </small>
                ) : (
                  <small className="spacedetail-price-duration">
                    base price
                  </small>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h4 className="mb-3">About This Space</h4>
            <p className="spacedetail-description">
              {space.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="mb-4">
            <h4 className="mb-3">Amenities & Features</h4>
            <div className="row g-2">
              {space.amenities.map((amenity, index) => (
                <div key={index} className="col-auto">
                  <span className="badge bg-light text-dark spacedetail-amenity">
                    <span>✓</span>
                    {amenity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Time slots with pricing */}
          <div className="mb-4">
            <h4 className="mb-3">Available Time Slots & Pricing</h4>
            <div className="row g-3">
              {/* Handle both old format (string array) and new format (object array) */}
              {Array.isArray(space.time_slots) && space.time_slots.length > 0 ? (
                space.time_slots.map((slot, index) => {
                  // Check if it's the new format (object) or old format (string)
                  const isNewFormat = typeof slot === 'object' && slot.price !== undefined
                  const slotName = isNewFormat ? slot.name : slot
                  const slotPrice = isNewFormat ? slot.price : (space.base_price || space.price)
                  const slotDescription = isNewFormat ? slot.description : ''
                  const slotDuration = isNewFormat ? slot.duration : ''

                  const getSlotPriceClass = (price) => {
                    if (price <= 200) return 'spacedetail-timeslot-price low'
                    if (price <= 350) return 'spacedetail-timeslot-price medium'
                    return 'spacedetail-timeslot-price high'
                  }

                  return (
                    <div key={index} className="col-md-6">
                      <div 
                        className={`card h-100 spacedetail-timeslot-card ${selectedTimeSlot?.name === slotName ? 'selected' : ''}`}
                        onClick={() => handleTimeSlotSelect(isNewFormat ? slot : { name: slotName, price: slotPrice })}
                      >
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title mb-0 spacedetail-timeslot-title">
                              {slotName}
                            </h6>
                            <div className={`badge ${getSlotPriceClass(slotPrice)}`}>
                              ₱{slotPrice}
                            </div>
                          </div>
                          {slotDuration && (
                            <div className="text-muted small mb-1">
                              Duration: {slotDuration}
                            </div>
                          )}
                          {slotDescription && (
                            <div className="text-muted small">
                              {slotDescription}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="col-12">
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    Contact the space directly for time slot availability and pricing.
                  </div>
                </div>
              )}
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
          <div className="spacedetail-sticky-sidebar">
            <BookingForm 
              space={space} 
              selectedTimeSlot={selectedTimeSlot}
              currentPrice={currentPrice}
            />
            
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