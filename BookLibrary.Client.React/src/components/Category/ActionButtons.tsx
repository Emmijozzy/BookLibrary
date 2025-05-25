import { Link } from 'react-router-dom'

interface ActionButtonsProps {
  categoryId: string
  isAdmin: boolean
  variant: 'card' | 'table'
}

const ActionButtons = ({ categoryId, isAdmin, variant }: ActionButtonsProps) => {
  const buttonClass = variant === 'card' 
    ? "px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200"
    : "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200"

  return (
    <div className={`flex gap-2 ${variant === 'card' ? 'flex-wrap' : ''}`}>
      <Link 
        to={`/categories/Details/${categoryId}`}
        className={`${buttonClass} bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200`}
      >
        View Details
      </Link>
      
      {isAdmin && (
        <>
          <Link 
            to={`/categories/edit/${categoryId}`}
            className={`${buttonClass} bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200`}
          >
            Edit
          </Link>
          <Link 
            to={`/categories/Delete/${categoryId}`}
            className={`${buttonClass} bg-red-50 text-red-700 hover:bg-red-100 border border-red-200`}
          >
            Delete
          </Link>
        </>
      )}
    </div>
  )
}

export default ActionButtons