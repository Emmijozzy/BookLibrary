import { Category } from '../../Types/category'
import CategoryCard from './CategoryCard'

interface CategoryGridProps {
  categories: Category[]
  isAdmin: boolean
}

const CategoryGrid = ({ categories, isAdmin }: CategoryGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category) => (
        <CategoryCard 
          key={category.id} 
          category={category} 
          isAdmin={isAdmin} 
        />
      ))}
    </div>
  )
}

export default CategoryGrid