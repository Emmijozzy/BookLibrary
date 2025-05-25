import { useState } from 'react'
import CategoryGrid from '../../components/Category/CategoryGrid'
import CategoryHeader from '../../components/Category/CategoryHeader'
import CategoryTable from '../../components/Category/CategoryTable'
import EmptyState from '../../components/Category/EmptyState'
import ErrorDisplay from '../../components/Category/ErrorDisplay'
import { LoadingSpinner2 } from '../../components/LoadingSpinner2'
import SearchBar from '../../components/SearchBar'
import { useCategories } from '../../Hooks/Category/useCategories'
import { useCategoryFilter } from '../../Hooks/Category/useCategoryFilter'

const ByCategory = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
    const { categories, loading, error, isAdmin } = useCategories()
    const { 
      searchTerm, 
      setSearchTerm, 
      searchField, 
      setSearchField, 
      filteredCategories 
    } = useCategoryFilter(categories)

    if (error) return <ErrorDisplay error={error as string} />
    // if (categories.length === 0) return <EmptyState isAdmin={isAdmin} />

    return (
      <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
        <CategoryHeader 
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          isAdmin={isAdmin}
          categoriesCount={filteredCategories.length}
        />
      
        <SearchBar 
          setSearchTerm={setSearchTerm} 
          setSearchField={setSearchField} 
          searchTerm={searchTerm} 
          searchField={searchField} 
          searchOptions={["Name", "Description"]} 
        />

        {filteredCategories.length === 0 && searchTerm ? (
          <div className="text-center py-8">
            <p className="text-slate-600">No categories found matching "{searchTerm}"</p>
          </div>
        ) : (
          <>
            {loading ? (
                <div className="my-auto">
                    <LoadingSpinner2 />
                </div>
            ) : viewMode === 'grid' ? (
              <CategoryGrid categories={filteredCategories} isAdmin={isAdmin} />
            ) : (
              <CategoryTable categories={filteredCategories} isAdmin={isAdmin} />
            )}
            {
                loading && categories.length > 0 && <EmptyState isAdmin={isAdmin} />
            }
          </>
        )}
      </div>
    )
}
export default ByCategory