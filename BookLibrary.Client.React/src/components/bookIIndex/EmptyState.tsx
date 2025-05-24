import { BookOpenIcon } from '@heroicons/react/24/outline'

const EmptyState = () => {
  return (
    <div className="text-center py-16">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 max-w-md mx-auto">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpenIcon className="w-10 h-10 text-slate-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-slate-900 mb-3">No Books Found</h3>
        <p className="text-slate-600 leading-relaxed">
          Try adjusting your search or filter criteria to find the books you're looking for.
        </p>
      </div>
    </div>
  )
}

export default EmptyState