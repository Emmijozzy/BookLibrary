import { User } from '../../Types/User';

interface UserInformationProps {
  user: User;
  editedUser: User | null;
  isEditing: boolean;
  onUserChange: (user: User | null) => void;
  onSave: () => void;
}

const UserInformation = ({
  user,
  editedUser,
  isEditing,
  onUserChange,
  onSave
}: UserInformationProps) => {
  return (
    <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base sm:text-lg font-semibold">User Information</h2>
      </div>
      
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              value={editedUser?.fullName || ''}
              onChange={(e) => onUserChange(editedUser ? {...editedUser, fullName: e.target.value} : null)}
              className="w-full mt-1 p-2 border rounded-md text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={editedUser?.email || ''}
              onChange={(e) => onUserChange(editedUser ? {...editedUser, email: e.target.value} : null)}
              className="w-full mt-1 p-2 border rounded-md text-sm sm:text-base"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={onSave}
              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm sm:text-base"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row">
            <span className="font-medium w-32 mb-1 sm:mb-0">Full Name:</span>
            <span className="text-sm sm:text-base">{user.fullName}</span>
          </div>
          <div className="flex flex-col sm:flex-row">
            <span className="font-medium w-32 mb-1 sm:mb-0">Email:</span>
            <span className="text-sm sm:text-base">{user.email}</span>
          </div>
          <div className="flex flex-col sm:flex-row">
            <span className="font-medium w-32 mb-1 sm:mb-0">User ID:</span>
            <span className="text-xs sm:text-sm text-gray-500">{user.id}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInformation;