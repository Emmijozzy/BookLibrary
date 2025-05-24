import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid'
import { format } from 'date-fns'
import { useApp } from "../Hooks/useApp"
import { Book } from "../Types/book"
import BookActionButtons from "./BookActionButtons"

type Props = {
  item: Book
  index: number
}

const BodyRow = ({ item, index }: Props) => {
  const { appUserId, currentRole } = useApp()
  
  const isOwner = appUserId === item.createdBy
  const isAdmin = currentRole === 'Admin'
  
  // Format publication date
  const formattedPublicationDate = item.publicationDate 
    ? format(new Date(item.publicationDate), 'MMM dd, yyyy')
    : 'N/A'
  
  return (
    <tr className="hover:bg-slate-50 transition-colors duration-200 group">
      {/* Index */}
      <td className="px-4 sm:px-6 py-4 text-sm text-slate-600 font-medium">
        {index + 1}
      </td>
      
      {/* Image */}
      <td className="px-4 sm:px-6 py-4">
        <div className="relative">
          <img 
            src={item.imageUrl || `https://picsum.photos/seed/${item.id}/80/120`} 
            alt={item.title}
            className="w-10 h-14 sm:w-12 sm:h-16 object-cover rounded-lg shadow-sm border border-slate-200 group-hover:shadow-md transition-shadow"
          />
          {item.isPrivate && (
            <div className="absolute -top-1 -right-1 bg-slate-800 rounded-full p-1 shadow-sm">
              <LockClosedIcon className="h-3 w-3 text-white" aria-hidden="true" />
            </div>
          )}
        </div>
      </td>
      
      {/* Title */}
      <td className="px-4 sm:px-6 py-4">
        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
          {item.title}
        </div>
      </td>
      
      {/* Author */}
      <td className="px-4 sm:px-6 py-4 text-sm text-slate-700 font-medium">
        {item.author}
      </td>
      
      {/* ISBN */}
      <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-slate-600 font-mono">
        {item.isbn}
      </td>
      
      {/* Publication Date */}
      <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-sm text-slate-600">
        {formattedPublicationDate}
      </td>
      
      {/* Pages */}
      <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-sm text-slate-600">
        {item.numberOfPage ? `${item.numberOfPage} pages` : 'N/A'}
      </td>
      
      {/* Genre */}
      <td className="hidden sm:table-cell px-4 sm:px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
          {item.genre}
        </span>
      </td>
      
      {/* Publisher */}
      <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-sm text-slate-600">
        {item.publisher}
      </td>
      
      {/* Language */}
      <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-sm text-slate-600">
        {item.language}
      </td>
      
      {/* Privacy Status */}
      <td className="hidden xl:table-cell px-4 sm:px-6 py-4">
        {item.isPrivate ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <LockClosedIcon className="h-3 w-3 mr-1" aria-hidden="true" />
            Private
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <LockOpenIcon className="h-3 w-3 mr-1" aria-hidden="true" />
            Public
          </span>
        )}
      </td>
      
      {/* Actions */}
      <td className="px-4 sm:px-6 py-4">
        <BookActionButtons 
          bookId={item.id || ''} 
          isOwner={isOwner}
          isAdmin={isAdmin}
          variant="table"
        />
      </td>
    </tr>
  )
}

export default BodyRow
