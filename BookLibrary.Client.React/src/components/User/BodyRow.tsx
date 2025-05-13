import { useMemo } from "react"
import { Link } from "react-router-dom"
import { User } from "../../Types/User"
import ViewIcon from "../Icons/ViewIcon"
import { LockIcon } from "../Icons/LockIcon"

type Props = {
    item: User
    index: number
}

const BodyRow = ({ item, index }: Props) => {
    // Memoize the initials to avoid recalculation on re-renders
    const initials = useMemo(() => {
        return item.fullName.split(' ').map(name => name[0]).join('')
    }, [item.fullName])

    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-3 sm:px-6 py-4 text-sm whitespace-nowrap text-gray-600">{index + 1}</td>
        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium shadow-sm">
              {initials}
            </div>
        </td>
        <td className="px-3 sm:px-6 py-4 text-sm whitespace-nowrap font-medium text-gray-800">
          <div className="flex items-center">
            {item.fullName}
            {item.locked && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                <LockIcon className="w-4 h-4 mr-1" />
                Locked
              </span>
            )}
          </div>
        </td>
        <td className="px-3 sm:px-6 py-4 text-sm whitespace-nowrap text-gray-600">{item.email}</td>
        <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-sm whitespace-nowrap">
          <div className="flex flex-wrap gap-1">
            {item.roles.map((role, i) => (
              <span 
                key={i} 
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}
              >
                {role}
              </span>
            ))}
          </div>
        </td>
        <td className="px-3 sm:px-6 py-4 text-sm whitespace-nowrap">
          <Link 
            to={`/Users/Details/${item.id}`} 
            className="inline-flex items-center bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 transition-colors duration-200 text-sm font-medium"
          >
            <ViewIcon className="w-4 h-4 mr-2" />
            Details
          </Link>
        </td>
      </tr>
    )
}

export default BodyRow
