import { Category } from '../../Types/category'
import ActionButtons from './ActionButtons'

interface CategoryCardProps {
  category: Category
  isAdmin: boolean
}

const CategoryCard = ({ category, isAdmin }: CategoryCardProps) => {
  const bookCount = category.books?.length || 0

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 flex flex-col h-full group">
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {category.name}
          </h3>
          <div className="px-2 py-1 bg-slate-100 rounded-full">
            <span className="text-xs font-medium text-slate-600">
              {bookCount} {bookCount === 1 ? 'book' : 'books'}
            </span>
          </div>
        </div>
        
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
          {category.description || 'No description available'}
        </p>
      </div>
      
      <div className="p-6 pt-0">
        <ActionButtons 
          categoryId={category.id || ''} 
          isAdmin={isAdmin} 
          variant="card"
        />
      </div>
    </div>
  )
}
export default CategoryCard