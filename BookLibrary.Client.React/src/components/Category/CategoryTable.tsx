import { Category } from '../../Types/category'
import ActionButtons from './ActionButtons'

interface CategoryTableProps {
  categories: Category[]
  isAdmin: boolean
}

const CategoryTable = ({ categories, isAdmin }: CategoryTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Books
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {categories.map((category) => (
              <CategoryTableRow 
                key={category.id} 
                category={category} 
                isAdmin={isAdmin} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const CategoryTableRow = ({ category, isAdmin }: { category: Category; isAdmin: boolean }) => {
  const bookCount = category.books?.length || 0

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
        <div className="font-medium text-slate-900">{category.name}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-slate-600 max-w-xs truncate">
          {category.description || 'No description'}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
          {bookCount} {bookCount === 1 ? 'book' : 'books'}
        </span>
      </td>
      <td className="px-6 py-4">
        <ActionButtons 
          categoryId={category.id || ''} 
          isAdmin={isAdmin} 
          variant="table"
        />
      </td>
    </tr>
  )
}

export default CategoryTable