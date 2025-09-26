import React, { useState, useEffect, useMemo, useCallback } from 'react'
import spacesData from '../data/spaces.json'
import SpaceCard from '../components/SpaceCard'
import SearchBar from '../components/SearchBar'

// Performance optimization: Memoized SpaceCard wrapper
const MemoizedSpaceCard = React.memo(SpaceCard)

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [spaces, setSpaces] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState('name') // name, price, location
  const [filterBy, setFilterBy] = useState('all') // all, low, medium, high

  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setSpaces(spacesData)
      setIsLoading(false)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  // Memoized search function for performance
  const handleSearch = useCallback((newQuery) => {
    setQuery(newQuery)
  }, [])

  // Memoized filtered and sorted results
  const filteredAndSortedSpaces = useMemo(() => {
    let filtered = spaces.filter(space => {
      const q = query.toLowerCase()
      const matchesSearch = space.name.toLowerCase().includes(q) || 
                           space.location.toLowerCase().includes(q) ||
                           space.description.toLowerCase().includes(q)
      
      // Price filter
      if (filterBy === 'low') return matchesSearch && space.base_price <= 250
      if (filterBy === 'medium') return matchesSearch && space.base_price > 250 && space.base_price <= 400
      if (filterBy === 'high') return matchesSearch && space.base_price > 400
      
      return matchesSearch
    })

    // Sort results
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.base_price - b.base_price
        case 'location':
          return a.location.localeCompare(b.location)
        default:
          return a.name.localeCompare(b.name)
      }
    })
  }, [spaces, query, sortBy, filterBy])

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="row g-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="col-12 col-md-6 col-lg-4">
          <div className="card h-100 homepage-skeleton-card">
            <div className="card-img-top homepage-skeleton-img" />
            <div className="card-body">
              <div className="homepage-skeleton-text" />
              <div className="homepage-skeleton-text short" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="container py-4">
      {/* Enhanced page header */}
      <div className="text-center mb-5">
        <h1 className="display-3 mb-4">
          Discover Amazing Study Spaces
        </h1>
        <p className="lead text-muted mx-auto homepage-header-title">
          Find the perfect environment to boost your productivity and focus
        </p>
      </div>

      {/* Enhanced search and filters */}
      <div className="search-container">
        <SearchBar value={query} onChange={handleSearch} />
      </div>

      <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
        {/* Sort dropdown */}
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="sortBy" className="form-label mb-0 fw-bold">Sort by:</label>
          <select
            id="sortBy"
            className="form-select form-select-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="location">Location</option>
          </select>
        </div>

        {/* Price filter */}
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="filterBy" className="form-label mb-0 fw-bold">Price range:</label>
          <select
            id="filterBy"
            className="form-select form-select-sm"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="all">All prices</option>
            <option value="low">₱0 - ₱250</option>
            <option value="medium">₱251 - ₱400</option>
            <option value="high">₱400+</option>
          </select>
        </div>

        {/* Results counter */}
        <div className="ms-auto">
          <span className="badge bg-light text-dark px-3 py-2">
            {isLoading ? 'Loading...' : `${filteredAndSortedSpaces.length} spaces found`}
          </span>
        </div>
      </div>

      {/* Results section */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : filteredAndSortedSpaces.length > 0 ? (
        <div className="row g-4">
          {filteredAndSortedSpaces.map((space, index) => (
            <div 
              key={space.id} 
              className="col-12 col-md-6 col-lg-4"
            >
              <MemoizedSpaceCard space={space} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="display-1 mb-3">🔍</div>
          <h3 className="text-muted">No spaces found</h3>
          <p className="text-muted">
            Try adjusting your search terms or filters
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setQuery('')
              setFilterBy('all')
              setSortBy('name')
            }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}