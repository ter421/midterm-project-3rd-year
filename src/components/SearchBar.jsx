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
    <div className="search-container">
      {/* Search input */}
      <div className="searchbar-input-container">
        <input
          ref={inputRef}
          className={`form-control mb-3 searchbar-input ${isFocused ? 'focused' : ''}`}
          placeholder="Search by name or location..."
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
        
        {/* Search icon */}
        <div className={`searchbar-search-icon ${isFocused ? 'focused' : ''}`}>
          🔍
        </div>

        {/* Clear button */}
        {value && (
          <button
            type="button"
            onClick={clearSearch}
            className="searchbar-clear-btn"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="searchbar-suggestions">
          <div className="py-2">
            {value.length === 0 && (
              <div className="searchbar-suggestions-header">
                Popular searches
              </div>
            )}
            
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                ref={el => suggestionRefs.current[index] = el}
                type="button"
                onClick={() => selectSuggestion(suggestion)}
                className={`searchbar-suggestion-btn ${activeSuggestion === index ? 'active' : ''}`}
              >
                <span className="searchbar-suggestion-icon">
                  {value.length > 0 ? '🔍' : '⭐'}
                </span>
                <span>{suggestion}</span>
                {activeSuggestion === index && (
                  <span className="searchbar-suggestion-enter">
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