interface BookFiltersProps {
  onFilterChange: (filterName: string, value: string | number) => void;
  currentGenre: string;
  currentSortBy: string;
}

export const BookFilters = ({ 
  onFilterChange, 
  currentGenre, 
  currentSortBy 
}: BookFiltersProps) => {
  return (
      <div className="flex gap-4">
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
              <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={currentGenre}
                  onChange={(e) => onFilterChange('genre', e.target.value)}
              >
                  <option value="">All Genres</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Biography">Biography</option>
              </select>
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={currentSortBy}
                  onChange={(e) => onFilterChange('sortBy', e.target.value)}
              >
                  <option value="">Default</option>
                  <option value="title">Title</option>
                  <option value="title_desc">Title (Z-A)</option>
                  <option value="author">Author</option>
                  <option value="author_desc">Author (Z-A)</option>
                  <option value="published_date">Publication Date (Oldest)</option>
                  <option value="published_date_desc">Publication Date (Newest)</option>
              </select>
          </div>
      </div>
  );
};