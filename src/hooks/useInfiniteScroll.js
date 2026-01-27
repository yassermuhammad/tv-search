import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Custom hook for infinite scroll pagination
 * @param {Function} fetchFunction - Function to fetch data (should accept page number)
 * @param {Object} options - Options object
 * @param {number} options.initialPage - Initial page number (default: 1)
 * @param {number} options.threshold - Scroll threshold in pixels (default: 200)
 * @returns {Object} Infinite scroll state and methods
 */
export const useInfiniteScroll = (fetchFunction, options = {}) => {
  const { initialPage = 1, threshold = 200 } = options
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(initialPage)
  const [hasMore, setHasMore] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const observerTarget = useRef(null)

  // Store fetchFunction in ref to avoid dependency issues
  const fetchFunctionRef = useRef(fetchFunction)
  useEffect(() => {
    fetchFunctionRef.current = fetchFunction
  }, [fetchFunction])

  /**
   * Fetches data for a specific page
   */
  const fetchData = useCallback(async (pageNum, append = false) => {
    try {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const response = await fetchFunctionRef.current(pageNum)
      
      // Handle both old format (array) and new format (object with results)
      const newItems = response.results || response
      const responseTotalPages = response.totalPages || response.total_pages || 1
      const responsePage = response.page || pageNum

      if (append) {
        setItems((prev) => [...prev, ...newItems])
      } else {
        setItems(newItems)
      }

      setTotalPages(responseTotalPages)
      // Check if there are more pages available
      const moreAvailable = responsePage < responseTotalPages
      setHasMore(moreAvailable)
    } catch (err) {
      setError('Failed to load content')
      console.error('Error fetching content:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  /**
   * Loads more data
   */
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      setPage((currentPage) => {
        const nextPage = currentPage + 1
        fetchData(nextPage, true)
        return nextPage
      })
    }
  }, [hasMore, loadingMore, fetchData])

  /**
   * Resets to initial state
   */
  const reset = useCallback(() => {
    setItems([])
    setPage(initialPage)
    setHasMore(true)
    setTotalPages(1)
    fetchData(initialPage, false)
  }, [initialPage, fetchData])

  // Initial load and reset when fetch function changes
  useEffect(() => {
    setItems([])
    setPage(initialPage)
    setHasMore(true)
    setTotalPages(1)
    fetchData(initialPage, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFunction]) // Reset when fetch function changes

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || loadingMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px', // Start loading 200px before reaching the element
      }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loadingMore, loading, loadMore])

  return {
    items,
    loading,
    loadingMore,
    error,
    hasMore,
    totalPages,
    page,
    loadMore,
    reset,
    observerTarget,
  }
}

export default useInfiniteScroll

