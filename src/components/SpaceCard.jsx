import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SpaceCard({ space }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Fallback image if main image fails to load
  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  // Truncate description with better logic
  const truncateDescription = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text
    const truncated = text.slice(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    return lastSpace > maxLength * 0.8 ? truncated.slice(0, lastSpace) + '...' : truncated + '...'
  }

  // Generate price color based on value
  const getPriceColor = (price) => {
    if (price <= 250) return '#22c55e' // green for low price
    if (price <= 400) return '#f59e0b' // amber for medium price
    return '#ef4444' // red for high price
  }

  return (
    <div className="card h-100">
      {/* Image container with loading state */}
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--card-radius) var(--card-radius) 0 0' }}>
        {!imageLoaded && !imageError && (
          <div 
            className="card-img-top d-flex align-items-center justify-content-center"
            style={{ 
              background: 'linear-gradient(45deg, #f0f0f0, #e0e0e0)',
              color: '#999',
              fontSize: '1.5rem'
            }}
          >
            📸
          </div>
        )}
        
        {imageError ? (
          <div 
            className="card-img-top d-flex flex-column align-items-center justify-content-center"
            style={{ 
              background: 'linear-gradient(135deg, var(--surface-elevated), var(--surface))',
              color: 'var(--text-muted)',
              fontSize: '2rem'
            }}
          >
            🏢
            <small style={{ fontSize: '0.8rem', marginTop: '8px' }}>Study Space</small>
          </div>
        ) : (
          <img 
            src={space.main_image} 
            className="card-img-top" 
            alt={space.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ 
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          />
        )}

        {/* Overlay badges */}
        <div style={{ 
          position: 'absolute', 
          top: '12px', 
          right: '12px', 
          display: 'flex', 
          gap: '8px',
          flexDirection: 'column',
          alignItems: 'flex-end'
        }}>
          {/* Price badge */}
          <span 
            className="badge px-3 py-2"
            style={{ 
              background: getPriceColor(space.base_price),
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: '700',
              borderRadius: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            Full Day Price Starts at ₱{space.base_price}
          </span>
          
          {/* Available time slots indicator */}
          {space.time_slots && space.time_slots.length > 0 && (
            <span 
              className="badge bg-success px-2 py-1"
              style={{ 
                fontSize: '0.7rem',
                borderRadius: '15px',
                opacity: 0.9
              }}
            >
              {space.time_slots.length} available schedule options
            </span>
          )}
        </div>
      </div>

      <div className="card-body d-flex flex-column">
        {/* Title with location */}
        <div className="mb-3">
          <h5 className="card-title mb-2" style={{ lineHeight: '1.3' }}>
            {space.name}
          </h5>
          
          <div className="d-flex align-items-center text-muted mb-2">
            <span style={{ fontSize: '0.9rem' }}>📍</span>
            <span className="ms-2" style={{ fontSize: '0.9rem' }}>
              {space.location}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="card-text flex-grow-1" style={{ 
          fontSize: '0.95rem', 
          lineHeight: '1.5',
          color: 'var(--text-secondary)'
        }}>
          {truncateDescription(space.description, 120)}
        </p>

        {/* Amenities preview (first 3) */}
        {space.amenities && space.amenities.length > 0 && (
          <div className="mb-3">
            <div className="d-flex flex-wrap gap-1">
              {space.amenities.slice(0, 3).map((amenity, index) => (
                <span 
                  key={index}
                  className="badge bg-light text-dark"
                  style={{ 
                    fontSize: '0.7rem',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  {amenity}
                </span>
              ))}
              {space.amenities.length > 3 && (
                <span 
                  className="badge bg-light text-muted"
                  style={{ 
                    fontSize: '0.7rem',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  +{space.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Operating hours */}
        {space.hours && (
          <div className="mb-3">
            <small className="text-muted d-flex align-items-center">
              <span>🕒</span>
              <span className="ms-2">{space.hours}</span>
            </small>
          </div>
        )}

        {/* Action button */}
        <div className="mt-auto">
          <Link 
            to={`/space/${space.id}`} 
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
            style={{ fontWeight: '600' }}
          >
            <span>View Details</span>
            <span style={{ fontSize: '0.9rem' }}>→</span>
          </Link>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, hsla(var(--bg-accent-1) / 0.05), hsla(var(--bg-accent-2) / 0.03))',
          opacity: 0,
          transition: 'opacity var(--transition-medium)',
          pointerEvents: 'none',
          borderRadius: 'var(--card-radius)'
        }}
        className="card-hover-overlay"
      />
    </div>
  )
}