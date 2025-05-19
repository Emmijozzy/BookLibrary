import { Link } from "react-router-dom"
import { Book } from "../Types/book"
import { useApp } from "../Hooks/useApp"
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid'
import { format } from 'date-fns'

type Props = {
  item: Book
  index: number
}

const BodyRow = ({item, index}: Props) => {
  const { appUserId, currentRole } = useApp()
  
  const isOwner = appUserId === item.createdBy
  const isAdmin = currentRole === 'Admin'
  const isAdminOrOwner = isAdmin || isOwner
  
  // // Format the date if it exists
  // const formattedDate = item.createdAt 
  //   ? format(new Date(item.createdAt), 'MMM dd, yyyy')
  //   : 'N/A';
    
  // Format publication date
  const formattedPublicationDate = item.publicationDate 
    ? format(new Date(item.publicationDate), 'MMM dd, yyyy')
    : 'N/A';
  
  return (
    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100">
      <td className="px-3 sm:px-6 py-4 text-sm whitespace-nowrap text-gray-700">{index + 1}</td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
        <div className="relative">
          <img 
            src={item.imageUrl || `https://picsum.photos/seed/${item.id}/50/50`} 
            alt={item.title}
            className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded-md shadow-sm"
          />
          {item.isPrivate && (
            <div className="absolute -top-1 -right-1 bg-gray-800 bg-opacity-75 rounded-full p-0.5">
              <LockClosedIcon className="h-3 w-3 text-white" aria-hidden="true" />
            </div>
          )}
        </div>
      </td>
      <td className="px-3 sm:px-6 py-4 text-sm whitespace-nowrap">
        <div className="font-medium text-gray-900">{item.title}</div>
      </td>
      <td className="px-3 sm:px-6 py-4 text-sm whitespace-nowrap text-gray-700">{item.author}</td>
      <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-sm whitespace-nowrap text-gray-500">{item.isbn}</td>
      <td className="hidden md:table-cell px-3 sm:px-6 py-4 text-sm whitespace-nowrap text-gray-500">{formattedPublicationDate}</td>
      <td className="hidden lg:table-cell px-3 sm:px-6 py-4 text-sm whitespace-nowrap text-gray-500">{item.numberOfPage}</td>
      <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-sm whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          {item.genre}
        </span>
      </td>
      <td className="hidden md:table-cell px-3 sm:px-6 py-4 text-sm whitespace-nowrap text-gray-500">{item.publisher}</td>
      <td className="hidden lg:table-cell px-3 sm:px-6 py-4 text-sm whitespace-nowrap text-gray-500">{item.language}</td>
      {/* <td className="hidden xl:table-cell px-3 sm:px-6 py-4 text-sm whitespace-nowrap text-gray-500">{formattedDate}</td> */}
      <td className="hidden xl:table-cell px-3 sm:px-6 py-4 text-sm whitespace-nowrap">
        {item.isPrivate ? (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            <LockClosedIcon className="h-3 w-3 mr-1" aria-hidden="true" />
            Private
          </span>
        ) : (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            <LockOpenIcon className="h-3 w-3 mr-1" aria-hidden="true" />
            Public
          </span>
        )}
      </td>
      <td className="px-3 sm:px-6 py-4 text-sm whitespace-nowrap">
        <div className="flex flex-col sm:flex-row gap-2">
          <Link 
            to={`/Books/Details/${item.id}`} 
            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors duration-200 text-center text-xs sm:text-sm shadow-sm"
          >
            Details
          </Link>
          {
            isOwner && (
              <Link
                to={`/Books/Edit/${item.id}`}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors duration-200 text-center text-xs sm:text-sm shadow-sm"
              >
                Edit
              </Link>
            )
          }
          {isAdminOrOwner && (
            <Link 
              to={`/Books/Delete/${item.id}`} 
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-200 text-center text-xs sm:text-sm shadow-sm"
            >
              Delete
            </Link>
          )}
        </div>
      </td>
    </tr>
  )
}

export default BodyRow
