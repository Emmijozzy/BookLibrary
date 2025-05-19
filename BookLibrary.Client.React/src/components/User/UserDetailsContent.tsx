import { Link } from "react-router-dom"
import { User } from "../../Types/User"

type Props = {
  user: User;
  ondeleteModalOpen: () => void;
}

const UserDetailsContent = ({user, ondeleteModalOpen}: Props) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold mr-4">
            {user.fullName.split(' ').map(name => name[0]).join('')}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Link 
            to={`/Users/Edit/${user.id}`}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Edit User
          </Link>
          <button 
            onClick={ondeleteModalOpen}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Delete User
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-3">User Information</h2>
          <div className="space-y-2">
            <div className="flex">
              <span className="font-medium w-32">Full Name:</span>
              <span>{user.fullName}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32">User ID:</span>
              <span className="text-sm text-gray-500">{user.id}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-3">Roles</h2>
          <div className="flex flex-wrap gap-2">
            {user.roles.map((role, index) => (
              <span 
                key={index} 
                className={`px-3 py-1 rounded-full text-sm ${
                  role === 'Admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetailsContent