import { Link } from "react-router-dom"
import { Book } from "../Types/book"
import { LockClosedIcon } from '@heroicons/react/24/solid'
import Avatar from "./Avatar"
import { useApp } from "../Hooks/useApp"
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

type Props = {
  item: Book
}

const BookCard = ({ item }: Props) => {
   const { appUserId, currentRole } = useApp()

    const isOwner = appUserId === item.createdBy
    const isAdmin = currentRole === 'Admin'
    const isAdminOrOwner = isAdmin || isOwner

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      {/* Image Container with LazyLoadImage */}
      <div className="relative aspect-[3/3] overflow-hidden rounded-t-xl">
        <LazyLoadImage
          src={item.imageUrl || `https://picsum.photos/seed/${item.id}/400/600`}
          alt={item.title}
          effect="blur"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          wrapperClassName="w-full h-full"
          placeholderSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMWYxIi8+PC9zdmc+"
          threshold={100}
        />
        {item.isPrivate && (
          <div className="absolute top-2 right-2 bg-black/80 text-white p-1.5 rounded-full backdrop-blur-sm">
            <LockClosedIcon className="h-4 w-4" aria-hidden="true" />
          </div>
        )}
      </div>
      
      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title and Private Badge */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-bold text-lg line-clamp-2 text-gray-900 flex-1">
            {item.title}
          </h3>
          {item.isPrivate && (
            <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              <LockClosedIcon className="h-3 w-3 mr-1" aria-hidden="true" />
              Private
            </span>
          )}
        </div>
        
        {/* Author and Genre */}
        <p className="text-sm text-gray-700 mb-1">By {item.author}</p>
        <p className="text-sm text-gray-500 mb-3 italic">{item.genre}</p>
        
        {/* Added By Section */}
        {item.createdBy && (
          <div className="mt-auto mb-3">
            <p className="text-xs text-gray-500 mb-1">Added by:</p>
            <Avatar userId={item.createdBy} size="sm" />
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 mt-auto">
          <Link 
            to={`/Books/Details/${item.id}`} 
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1.5 rounded-md text-sm text-center transition-colors duration-200"
          >
            Details
          </Link>
          {
            isOwner && (
                <Link
                    to={`/Books/Edit/${item.id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1.5 rounded-md text-sm text-center transition-colors duration-200"
                >
                    Edit
                </Link>
            )
          }
          {
            isAdminOrOwner && (
                <Link
                    to={`/Books/Delete/${item.id}`}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1.5 rounded-md text-sm text-center transition-colors duration-200"
                >
                    Delete
                </Link>
            )
          }              
        </div>
      </div>
    </div>  
  )
}

export default BookCard
