import React, { useState, useRef, useEffect } from 'react'

export default function SearchBar({ value, onChange }) {
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef(null)
  const suggestionRefs = useRef([])
  const [activeSuggestion, setActiveSuggestion] = useState(-1)

  // Common search suggestions
  const commonSearches = [
    'Manila', 'Makati', 'Quiapo', 'Quezon City', 'Cebu',
    'library', 'cafe', 'coworking', 'quiet', 'wifi',
    'study rooms', 'group study', 'private rooms'
  ]

  // Generate suggestions based on input
  useEffect(() => {
    if (value.length > 0) {
      const filtered = commonSearches
        .filter(term => 
          term.toLowerCase().includes(value.toLowerCase()) &&
          term.toLowerCase() !== value.toLowerCase()
        )
        .slice(0, 5)
      
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions(commonSearches.slice(0, 5))
      setShowSuggestions(false)
    }
  }, [value])

  // Handle input change with debouncing effect
  const handleInputChange = (e) => {
    const newValue = e.target.value
    onChange(newValue)
    setActiveSuggestion(-1)
  }

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true)
    if (value.length === 0) {
      setShowSuggestions(true)
    }
  }

  // Handle blur with delay to allow suggestion clicks
  const handleBlur = () => {
    setIsFocused(false)
    setTimeout(() => {
      setShowSuggestions(false)
      setActiveSuggestion(-1)
    }, 200)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (activeSuggestion >= 0) {
          selectSuggestion(suggestions[activeSuggestion])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setActiveSuggestion(-1)
        inputRef.current.blur()
        break
    }
  }

  // Select a suggestion
  const selectSuggestion = (suggestion) => {
    onChange(suggestion)
    setShowSuggestions(false)
    setActiveSuggestion(-1)
    inputRef.current.focus()
  }

  // Clear search
  const clearSearch = () => {
    onChange('')
    inputRef.current.focus()
  }

  return (
    <div className="search-container" style={{ position: 'relative' }}>
      {/* Search input */}
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          className="form-control mb-3"
          placeholder="Search by name or location..."
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{
            paddingLeft: '3.5rem',
            paddingRight: value ? '3rem' : '1.5rem',
            fontSize: '1.05rem',
            transition: 'all var(--transition-medium)',
            boxShadow: isFocused 
              ? '0 0 0 4px hsla(var(--bg-accent-1) / 0.15), var(--glass-shadow)' 
              : 'var(--card-shadow)'
          }}
        />
        
        {/* Search icon */}
        <div style={{
          position: 'absolute',
          left: '1.2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '1.2rem',
          color: isFocused ? 'var(--accent-text)' : 'var(--text-muted)',
          transition: 'color var(--transition-fast)',
          pointerEvents: 'none',
          zIndex: 2
        }}>
          🔍
        </div>

        {/* Clear button */}
        {value && (
          <button
            type="button"
            onClick={clearSearch}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'var(--text-muted)',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              color: 'white',
              fontSize: '0.8rem',
              zIndex: 2
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--accent-text)'
              e.target.style.transform = 'translateY(-50%) scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--text-muted)'
              e.target.style.transform = 'translateY(-50%) scale(1)'
            }}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% - 1rem)',
          left: 0,
          right: 0,
          background: 'var(--surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--card-radius)',
          boxShadow: 'var(--glass-shadow)',
          zIndex: 1000,
          maxHeight: '300px',
          overflowY: 'auto',
          animation: 'fadeInDown 0.2s ease-out'
        }}>
          <div style={{ padding: '0.5rem 0' }}>
            {value.length === 0 && (
              <div style={{ 
                padding: '0.5rem 1.5rem', 
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                fontWeight: '600'
              }}>
                Popular searches
              </div>
            )}
            
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                ref={el => suggestionRefs.current[index] = el}
                type="button"
                onClick={() => selectSuggestion(suggestion)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  background: activeSuggestion === index 
                    ? 'hsla(var(--bg-accent-1) / 0.08)' 
                    : 'transparent',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
                onMouseEnter={(e) => {
                  if (activeSuggestion !== index) {
                    e.target.style.background = 'hsla(var(--bg-accent-1) / 0.05)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSuggestion !== index) {
                    e.target.style.background = 'transparent'
                  }
                }}
              >
                <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                  {value.length > 0 ? '🔍' : '⭐'}
                </span>
                <span>{suggestion}</span>
                {activeSuggestion === index && (
                  <span style={{ 
                    marginLeft: 'auto', 
                    fontSize: '0.8rem',
                    opacity: 0.7
                  }}>
                    ↵
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}