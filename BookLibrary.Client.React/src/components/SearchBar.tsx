import { KeyboardEvent, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

type Props = {
    searchField: string;
    setSearchField: (value: React.SetStateAction<string>) => void;
    searchTerm: string;
    setSearchTerm: (value: React.SetStateAction<string>) => void;
    onSearch?: () => void;
    searchOptions: string[];
}

const SearchBar = ({searchField, searchTerm, setSearchField, setSearchTerm, onSearch, searchOptions}: Props) => {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    const handleSearch = () => {
      setSearchTerm(localSearchTerm);
      if (onSearch) {
        onSearch();
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };

    const handleClear = () => {
      setLocalSearchTerm('');
      setSearchTerm('');
      if (onSearch) {
        onSearch();
      }
    };

    return (
      <div className="w-full">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-auto">
            <select 
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 capitalize"
              aria-label="Search field"
            >
              {
                searchOptions && searchOptions.map((option) => <option key={option} value={option == "search by" ? "" : option} className='capitalize'>{option}</option>)
              }
            </select>
          </div>
        
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
          
            <input
              type="text"
              placeholder={`Search by ${searchField}...`}
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded border border-slate-300 pl-10 pr-12 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              aria-label="Search term"
            />
          
            {localSearchTerm && (
              <button 
                onClick={handleClear}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
            aria-label="Search"
          >
            <span className="flex items-center justify-center gap-2">
              <FaSearch />
              <span>Search</span>
            </span>
          </button>
        </div>
      
        {searchTerm && (
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <span>Searching for: <span className="font-medium">{searchTerm}</span> in <span className="font-medium">{searchField}</span></span>
            <button 
              onClick={handleClear}
              className="ml-2 text-indigo-600 hover:text-indigo-800 underline text-sm"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    );
};

export default SearchBar;