import { useMemo, useState } from 'react'
import { Category } from '../../Types/category'

export const useCategoryFilter = (categories: Category[]) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchField, setSearchField] = useState('name')

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories
    
    return categories.filter(category => {
      const value = category[searchField.toLowerCase() as keyof Category]
      const searchValue = typeof value === 'string' ? value : String(value)
      return searchValue.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }, [categories, searchTerm, searchField])

  return {
    searchTerm,
    setSearchTerm,
    searchField,
    setSearchField,
    filteredCategories
  }
}