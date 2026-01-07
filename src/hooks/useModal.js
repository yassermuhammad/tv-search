import { useState, useCallback } from 'react'

/**
 * Custom hook for managing modal state
 * @returns {Object} Modal state and handlers
 */
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [itemType, setItemType] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const openModal = useCallback((item, type) => {
    setSelectedItem(item)
    setItemType(type)
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setSelectedItem(null)
    setItemType(null)
    setLoadingDetails(false)
  }, [])

  const setLoading = useCallback((loading) => {
    setLoadingDetails(loading)
  }, [])

  return {
    isOpen,
    selectedItem,
    itemType,
    loadingDetails,
    openModal,
    closeModal,
    setLoading,
    setSelectedItem,
  }
}

