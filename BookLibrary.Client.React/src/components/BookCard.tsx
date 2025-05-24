import { LockClosedIcon } from '@heroicons/react/24/solid'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { Book } from "../Types/book"
import Avatar from "./Avatar"
import BookActionButtons from './BookActionButtons'
import { useBookPermissions } from '../Hooks/useBookPermissions'

type Props = {
  item: Book
}

const BookCard = ({ item }: Props) => {
  const { isOwner, isAdmin } = useBookPermissions(item.createdBy)

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <LazyLoadImage
          src={item.imageUrl || `https://picsum.photos/seed/${item.id}/400/600`}
          alt={item.title}
          effect="blur"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          wrapperClassName="w-full h-full"
          placeholderSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMWYxIi8+PC9zdmc+"
          threshold={100}
        />
        
        {/* Privacy Badge */}
        {item.isPrivate && (
          <div className="absolute top-3 right-3">
            <div className="bg-black/80 backdrop-blur-sm text-white p-2 rounded-full shadow-lg">
              <LockClosedIcon className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Header Section */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-bold text-lg line-clamp-2 text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
              {item.title}
            </h3>
            {item.isPrivate && (
              <span className="flex-shrink-0 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border">
                <LockClosedIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                Private
              </span>
            )}
          </div>
          
          {/* Book Details */}
          <div className="space-y-2 mb-4">
            <p className="text-sm font-medium text-slate-700">
              by <span className="text-slate-900">{item.author}</span>
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                {item.genre}
              </span>
            </div>
          </div>
        </div>
        
        {/* Added By Section */}
        {item.createdBy && (
          <div className="mb-4 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-2">Added by:</p>
            <Avatar userId={item.createdBy} size="sm" />
          </div>
        )}
        
        {/* Action Buttons */}
        <BookActionButtons 
          bookId={item.id || ''}
          isOwner={isOwner}
          isAdmin={isAdmin}
          variant="card"
        />
      </div>
    </div>  
  )
}

export default BookCard
