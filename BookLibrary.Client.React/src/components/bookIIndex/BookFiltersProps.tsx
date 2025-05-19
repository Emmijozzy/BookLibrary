import { useState } from 'react';
import { AdjustmentsHorizontalIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface BookFiltersProps {
  onFilterChange: (filterName: string, value: string | number) => void;
  currentGenre: string;
  currentSortBy: string;
  currentPrivacyFilter?: string;
}

export const BookFilters = ({ 
  onFilterChange, 
  currentGenre, 
  currentSortBy,
  currentPrivacyFilter = "all"
}: BookFiltersProps) => {
  // State to track if filters are visible
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  // Toggle filters visibility
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };
  
  return (
    <div className="mb-6">
      {/* Filter Toggle Button */}
      <button
        onClick={toggleFilters}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
      >
        <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
        <span>Filters</span>
        {filtersVisible ? (
          <ChevronUpIcon className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        )}
      </button>
      
      {/* Filters Panel - Only visible when filtersVisible is true */}
      {filtersVisible && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Books</h3>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-auto">
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
            
            <div className="w-full md:w-auto">
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
            
            {/* Privacy Filter */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
              <div className="relative">
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none pr-10"
                  value={currentPrivacyFilter}
                  onChange={(e) => onFilterChange('isPrivate', e.target.value)}
                >
                  <option value="">All Books</option>
                  <option value="false">Public Books</option>
                  <option value="true">Private Books</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Active Filters Display */}
          <div className="mt-4 flex flex-wrap gap-2">
            {currentGenre && (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Genre: {currentGenre}
                <button 
                  onClick={() => onFilterChange('genre', '')}
                  className="ml-1.5 text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </div>
            )}
            
            {currentSortBy && (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Sorted by: {currentSortBy.replace('_desc', ' (desc)')}
                <button 
                  onClick={() => onFilterChange('sortBy', '')}
                  className="ml-1.5 text-purple-500 hover:text-purple-700"
                >
                  ×
                </button>
              </div>
            )}
            
            {currentPrivacyFilter !== 'all' && (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {currentPrivacyFilter === 'true' ? 'Private Only' : 'Public Only'}
                <button 
                  onClick={() => onFilterChange('isPrivate', 'all')}
                  className="ml-1.5 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
