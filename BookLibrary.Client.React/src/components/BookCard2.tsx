import { Link } from 'react-router-dom'
import { useApp } from '../Hooks/useApp'
import { Book } from '../Types/book'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

type Props = {
  book: Book
}

const BookCard2 = ({book}: Props) => {
  const { currentRole, appUserId} = useApp()

  return (
      <div key={book.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
            <LazyLoadImage
                src={book.imageUrl || `https://picsum.photos/seed/${book.id}/400/300`}
                alt={book.title}
                effect="blur"
                className="w-full h-48 object-cover"
                wrapperClassName="w-full h-48"
                placeholderSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMWYxIi8+PC9zdmc+"
                threshold={100}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(book.title)}`;
                }}
            />
            {book.isPrivate && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-1.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold line-clamp-2 text-gray-800">{book.title}</h3>
                {book.isPrivate && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Private
                    </span>
                )}
            </div>
            <p className="text-gray-600 mb-4 line-clamp-3">{book.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-500">Author</p>
                    <p className="font-medium">{book.author}</p>
                </div>
                <div>
                    <p className="text-gray-500">Genre</p>
                    <p className="font-medium">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {book.genre}
                        </span>
                    </p>
                </div>
                <div>
                    <p className="text-gray-500">Publisher</p>
                    <p className="font-medium">{book.publisher}</p>
                </div>
                <div>
                    <p className="text-gray-500">Language</p>
                    <p className="font-medium">{book.language}</p>
                </div>
                <div>
                    <p className="text-gray-500">ISBN</p>
                    <p className="font-medium">{book.isbn}</p>
                </div>
                <div>
                    <p className="text-gray-500">Pages</p>
                    <p className="font-medium">{book.numberOfPage}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-gray-500">Publication Date</p>
                    <p className="font-medium">{book.publicationDate ? new Date(book.publicationDate).toLocaleDateString() : 'N/A'}</p>
                </div>
            </div>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-end space-x-4">
          <Link to={`/Books/Details/${book.id}`} className="bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 transition-colors duration-200 text-sm shadow-sm">Details</Link>
              {
                appUserId === book.createdBy && (
                  <Link to={`/Books/Edit/${book.id}`} className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors duration-200 text-sm shadow-sm">Edit</Link>
                )
              }
            {(currentRole === 'Admin' || appUserId === book.createdBy) && (
                <>
                    <Link to={`/Books/Delete/${book.id}`} className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition-colors duration-200 text-sm shadow-sm">Delete</Link>
                </>
            )}
        </div>
    </div>
  )
}

export default BookCard2
