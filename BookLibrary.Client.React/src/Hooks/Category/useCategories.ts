import { useEffect } from 'react'
import { Category } from '../../Types/category'
import { useApp } from '../useApp'
import useFetch from '../useFetch'

export const useCategories = () => {
  const { data, error, fetchData, loading } = useFetch()
  const { currentRole } = useApp()
  const isAdmin = currentRole === 'Admin'

  useEffect(() => {
    const getCategories = async () => {
      const endpoint = isAdmin 
        ? "Category/all-with-users-books" 
        : "Category/all-with-users-public-books"
      
      await fetchData(endpoint, { method: 'get' })
    }
    
    getCategories()
  }, [fetchData, isAdmin])

  const categories = (data as unknown as Category[]) || []

  return {
    categories,
    loading,
    error,
    isAdmin,
    refetch: () => fetchData(
      isAdmin ? "Category/all-with-users-books" : "Category/all-with-users-public-books",
      { method: 'get' }
    )
  }
}