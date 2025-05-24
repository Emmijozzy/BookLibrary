import { Link } from 'react-router-dom'

interface EmptyStateProps {
  isAdmin: boolean
}

const EmptyState = ({ isAdmin }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-md mx-auto">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Categories Found</h3>
        <p className="text-slate-600 mb-6">
          {isAdmin 
            ? "Get started by creating your first category to organize your books."
            : "No categories are available at the moment. Please check back later."
          }
        </p>
        
        {isAdmin && (
          <Link 
            to="/categories/create"
            className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
            Create First Category
          </Link>
        )}
      </div>
    </div>
  )
}

export default EmptyState