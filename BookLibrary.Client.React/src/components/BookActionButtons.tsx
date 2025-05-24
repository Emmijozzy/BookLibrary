import { Link } from 'react-router-dom'

interface BookActionButtonsProps {
  bookId: string
  isOwner: boolean
  isAdmin: boolean
  variant: 'card' | 'table'
}

const BookActionButtons = ({ bookId, isOwner, isAdmin, variant }: BookActionButtonsProps) => {
  const isAdminOrOwner = isAdmin || isOwner
  
  const buttonClass = variant === 'card' 
    ? "px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-center flex-1"
    : "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 text-center"

  const containerClass = variant === 'card'
    ? "flex gap-2"
    : "flex gap-2 flex-wrap"

  return (
    <div className={containerClass}>
      <Link 
        to={`/Books/Details/${bookId}`} 
        className={`${buttonClass} bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300`}
      >
        Details
      </Link>
      
      {isOwner && (
        <Link
          to={`/Books/Edit/${bookId}`}
          className={`${buttonClass} bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 hover:border-blue-300`}
        >
          Edit
        </Link>
      )}
      
      {isAdminOrOwner && (
        <Link
          to={`/Books/Delete/${bookId}`}
          className={`${buttonClass} bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 hover:border-red-300`}
        >
          Delete
        </Link>
      )}              
    </div>
  )
}

export default BookActionButtons