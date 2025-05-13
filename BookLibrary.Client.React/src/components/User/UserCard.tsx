import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { User } from '../../Types/User'
import ViewIcon from '../Icons/ViewIcon'
import { LockIcon } from '../Icons/LockIcon'

type Props = {
  user: User
}

export const UserCard = ({ user }: Props) => {
  // Memoize the initials to avoid recalculation on re-renders
  const initials = useMemo(() => {
    return user.fullName.split(' ').map(name => name[0]).join('')
  }, [user.fullName])

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="flex items-center mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold mr-4 flex-shrink-0 shadow-md">
          {initials}
        </div>
        <div className="overflow-hidden">
          <h3 className="font-bold text-lg sm:text-xl text-gray-800 truncate">{user.fullName}</h3>
          <p className="text-sm sm:text-base text-gray-500 truncate hover:text-clip hover:text-blue-500 transition-colors">
            {user.email}
          </p>
        </div>
      </div>
      
      <div className="mb-4 flex-grow">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-700">Roles:</p>
          {user.locked && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <LockIcon className="w-4 h-4 mr-2" />
              Locked
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {user.roles &&  user.roles.map((role, index) => (
            <span key={index} className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              role === 'Admin' 
                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {role}
            </span>
          ))}
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-4 mt-auto">
        <div className="flex gap-3">
          <Link 
            to={`/Users/Details/${user.id}`} 
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-green-600 transition-colors duration-200 text-center flex items-center justify-center"
          >
            <ViewIcon />
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
