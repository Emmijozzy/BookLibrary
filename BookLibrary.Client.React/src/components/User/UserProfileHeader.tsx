import { User } from '../../Types/User';

interface UserProfileHeaderProps {
  user: User;
  isEditing: boolean;
  onEditToggle: () => void;
  onDeleteClick: () => void;
  onBackClick: () => void;
}

const UserProfileHeader = ({
  user,
  isEditing,
  onEditToggle,
  onDeleteClick,
  onBackClick
}: UserProfileHeaderProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6 mb-4 lg:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg sm:text-xl font-bold">
            {user.fullName.split(' ').map(name => name[0]).join('')}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{user.fullName}</h1>
            <p className="text-sm sm:text-base text-gray-600">{user.email}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onEditToggle}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md transition-colors ${
              isEditing 
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isEditing ? 'Cancel Editing' : 'Edit User'}
          </button>
          <button 
            onClick={onDeleteClick}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Delete User
          </button>
          <button 
            onClick={onBackClick} 
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 ml-auto bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;