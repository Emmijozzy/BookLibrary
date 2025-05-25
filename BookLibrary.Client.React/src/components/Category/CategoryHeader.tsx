import { FaList, FaThLarge } from 'react-icons/fa'
import { Link } from 'react-router-dom'

interface CategoryHeaderProps {
  viewMode: 'grid' | 'table'
  onViewModeChange: (mode: 'grid' | 'table') => void
  isAdmin: boolean
  categoriesCount: number
}

const CategoryHeader = ({ viewMode, onViewModeChange, isAdmin, categoriesCount }: CategoryHeaderProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Categories</h1>
            <p className="text-slate-600">Manage your library categories</p>
          </div>
          <div className="px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full">
            <span className="text-sm font-medium text-indigo-700">
              {categoriesCount} {categoriesCount === 1 ? 'Category' : 'Categories'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <ViewModeToggle 
            viewMode={viewMode} 
            onViewModeChange={onViewModeChange} 
          />
          
          {isAdmin && <AddCategoryButton />}
        </div>
      </div>
    </div>
  )
}

const ViewModeToggle = ({ viewMode, onViewModeChange }: Pick<CategoryHeaderProps, 'viewMode' | 'onViewModeChange'>) => {
  return (
    <div className="flex bg-slate-100 p-1 rounded-lg border">
      <button 
        onClick={() => onViewModeChange('grid')}
        className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
          viewMode === 'grid' 
            ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        }`}
      >
        <FaThLarge className="text-sm" />
        <span className="hidden sm:inline">Grid</span>
      </button>
      <button 
        onClick={() => onViewModeChange('table')}
        className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
          viewMode === 'table' 
            ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        }`}
      >
        <FaList className="text-sm" />
        <span className="hidden sm:inline">Table</span>
      </button>
    </div>
  )
}

const AddCategoryButton = () => {
  return (
    <Link 
      to="/categories/create" 
      className="inline-flex items-center justify-center rounded-lg py-2.5 px-5 text-sm font-medium transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
      </svg>
      <span>Add Category</span>
    </Link>
  )
}

export default CategoryHeader