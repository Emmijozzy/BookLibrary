import { Category } from "../Types/category";

export const CategorySelect = ({ 
  categories, 
  selectedCategoryId, 
  handleChange 
}: { 
  categories: Category[];
  selectedCategoryId: string;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div>
    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
      Category
    </label>
    <select
      id="categoryId"
      name="categoryId"
      onChange={handleChange}
      value={selectedCategoryId || ""}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
    >
      <option value="">Select Category</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>{category.name}</option>
      ))}
    </select>
  </div>
);
