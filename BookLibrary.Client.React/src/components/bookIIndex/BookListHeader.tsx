import { FaList, FaThLarge } from "react-icons/fa";
import { Link } from "react-router-dom";

export const BookListHeader = ({ 
  totalItems, 
  viewMode, 
  setViewMode,
  headerTitle = "Book List",
}: { 
  totalItems: number, 
  viewMode: string, 
  setViewMode: (mode: string) => void 
  headerTitle?: string
}) => (
  <div className="mt-2 flex flex-col sm:flex-row justify-between items-center gap-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">{headerTitle}</h1>
          <span className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600">
              Library Collection ({totalItems} books)
          </span>
      </div>
      <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg border">
            <button 
                onClick={() => setViewMode('grid')}
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
                onClick={() => setViewMode('table')}
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
          <Link 
              to="/Books/create" 
              className="inline-flex items-center justify-center rounded-lg py-2.5 px-5 text-sm font-medium transition-all duration-200 ease-in-out bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
              <span className="mr-2">Add New Book</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
          </Link>
      </div>
  </div>
);