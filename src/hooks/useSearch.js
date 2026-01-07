import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Custom hook for handling search functionality with debouncing
 * @param {Function} searchFunction - Function to perform the search
 * @param {number} debounceDelay - Delay in milliseconds for debouncing
 * @returns {Object} Search state and handlers
 */
export const useSearch = (searchFunction, debounceDelay = 500) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  
  // Use ref to store the latest search function to avoid recreating performSearch
  const searchFunctionRef = useRef(searchFunction)
  
  // Update ref when searchFunction changes
  useEffect(() => {
    searchFunctionRef.current = searchFunction
  }, [searchFunction])

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim() === '') {
      setResults([])
      setHasSearched(false)
      return
    }

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const searchResults = await searchFunctionRef.current(searchQuery)
      setResults(searchResults)
    } catch (err) {
      setError('Failed to search. Please try again.')
      setResults([])
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, []) // Empty dependency array - searchFunction is accessed via ref

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, debounceDelay)

    return () => clearTimeout(timer)
  }, [query, debounceDelay, performSearch])

  const resetSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setHasSearched(false)
    setError(null)
  }, [])

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    hasSearched,
    resetSearch,
  }
}

